import { useState } from 'react';
import './Masuk_Daftar_Lupa.css';
import logo from '../assets/LogoWeb.png';
import translations from '../components/Bahasa.js';
import globeIcon from '../assets/language.svg';
import showIcon from '../assets/unhide.svg';
import hideIcon from '../assets/hide.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


const Daftar = () => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const t = translations[language];
    const navigate = useNavigate();
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setShowDropdown(false);
        localStorage.setItem('language', lang);
    };
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSignup = async (e) => {
        e.preventDefault();

        const full_name = document.getElementById('full_name').value;
        const phone_number = document.getElementById('phone_number').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Daftar user via Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Simpan data tambahan ke Firestore
            await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            full_name,
            phone_number,
            email
            });

            toast.success(t.daftarBerhasil, { position: 'top-right', autoClose: 1000 });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Register error:', error);
            const code = error.code;

            if (code === 'auth/email-already-in-use') {
            toast.error(t.emailTelahDigunakan, { position: 'top-right', autoClose: 2000 });
            } else {
            toast.error(t.daftarTerjadiKesalahan, { position: 'top-right', autoClose: 2000 });
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
                <h2>{t.daftar}</h2>
                <form onSubmit={handleSignup}>
                    <label htmlFor="full_name">{t.namaLengkap}</label>
                    <input 
                        type="text"
                        id="full_name"
                        placeholder={t.placeholderNamalengkap}
                        required
                    />
                    <label htmlFor="phone_number">{t.nomorTelepon}</label>
                    <input 
                        type="tel"
                        id="phone_number"
                        placeholder={t.placeholderNomorTelepon}
                        required
                    />
                    <label htmlFor="email">{t.email}</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder={t.placeholderEmail} 
                        required 
                    />
                    <label htmlFor="password">{t.kataSandi}</label>
                    <div className="login-password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder={t.placeholderKataSandi}
                            required
                        />
                        <img
                            src={showPassword ? showIcon : hideIcon}
                            alt={showPassword ? "Show Password" : "Hide Password"}
                            className="login-icon"
                            onClick={togglePassword}
                        />
                    </div>
                    <></>
                    <button type="submit">{t.daftar}</button>
                    <p className="login-register">{t.sudahPunyaAkun} <Link to="/">{t.masukDisini}</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Daftar;