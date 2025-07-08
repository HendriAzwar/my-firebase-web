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
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


const Masuk = () => {
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            localStorage.setItem('userId', user.uid); // Simpan UID ke localStorage

            toast.success(t.masukBerhasil, {
                position: 'top-right',
                autoClose: 1000,
                closeButton: false,
                pauseOnHover: false
            });

            setTimeout(() => navigate('/beranda'), 2000);
        } catch (error) {
            console.error("Login error:", error.code);

            if (error.code === 'auth/user-not-found') {
                toast.error(t.emailGagal, { position: 'top-right', autoClose: 2000 });
            } else if (error.code === 'auth/wrong-password') {
                toast.error(t.katasandiGagal, { position: 'top-right', autoClose: 2000 });
            } else {
                toast.error(t.terjadiKesalahan, { position: 'top-right', autoClose: 2000 });
            }

            setTimeout(() => navigate('/'), 2000);
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
                <h2>{t.masuk}</h2>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">{t.email}</label>
                    <input
                        type="email"
                        id="email"
                        placeholder={t.placeholderEmail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">{t.kataSandi}</label>
                    <div className="login-password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder={t.placeholderKataSandi}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <img
                            src={showPassword ? showIcon : hideIcon}
                            alt={showPassword ? "Show Password" : "Hide Password"}
                            className="login-icon"
                            onClick={togglePassword}
                        />
                    </div>
                    <div className="login-forgot">
                        <Link to="/lupa-password">{t.lupaKataSandi }</Link>
                    </div>
                    <button type="submit">{t.masuk}</button>
                    <p className="login-register">{t.belumPunyaAkun} <Link to="/daftar">{t.daftarDisini}</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Masuk;