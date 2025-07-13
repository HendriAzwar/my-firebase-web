import { useState } from 'react';
import './Masuk_Daftar_Lupa.css';
import logo from '../assets/LogoWeb.png';
import translations from '../components/Bahasa.js';
import globeIcon from '../assets/language.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const LupaPassword = () => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const [showDropdown, setShowDropdown] = useState(false);
    const [email, setEmail] = useState('');
    const t = translations[language];
    const navigate = useNavigate();

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setShowDropdown(false);
        localStorage.setItem('language', lang);
    };

    const changePassword = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email wajib diisi", { position: 'top-right', autoClose: 2000 });
            return;
        }

        try {
            // Cek apakah email ada di Firestore
            const q = query(collection(db, 'users'), where('email', '==', email));
            const snap = await getDocs(q);

            if (snap.empty) {
                toast.error("Email tidak terdaftar di sistem kami", { position: 'top-right', autoClose: 2000 });
                return;
            }

            // Kirim email reset password via Firebase Auth
            await sendPasswordResetEmail(auth, email);
            toast.success("Tautan reset telah dikirim ke email kamu", { position: 'top-right', autoClose: 3000 });
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            console.error("Reset password error:", error);
            if (error.code === 'auth/user-not-found') {
                toast.error("Email tidak ditemukan di Firebase Authentication", { position: 'top-right', autoClose: 2000 });
            } else {
                toast.error("Gagal mengirim tautan reset. Coba lagi nanti.", { position: 'top-right', autoClose: 2000 });
            }
        }
    };

    return (
        <div className="login-flex-container">
            <ToastContainer />
            <div className="login-left-column">
                <div className="login-logo-wrapper">
                    <img src={logo} alt="Logo Senergy" className="login-logo-img" />
                    <h1>Senergy</h1>
                </div>
                <p className="login-description">{t.selamatDatang}</p>
            </div>
            <div className="login-right-column">
                <div className="login-language-switch">
                    <img
                        src={globeIcon}
                        alt="Pilih Bahasa"
                        className="login-globe-icon"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                        <div className="login-dropdown-language">
                            <div onClick={() => handleLanguageChange('id')}>Indonesian</div>
                            <div onClick={() => handleLanguageChange('en')}>English</div>
                        </div>
                    )}
                </div>
                <h2>{t.halamanLupaPassword}</h2>
                <form onSubmit={changePassword}>
                    <label htmlFor="email">{t.email}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.placeholderEmail}
                        required
                    />
                    <button type="submit">{t.pesanKirim}</button>
                    <p className="login-register">
                        {t.sudahIngatKataSandi} <Link to="/">{t.masukDisini}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LupaPassword;
