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
    const handleLogin = async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok && data.code === 'LOGIN_SUCCESS') {
                localStorage.setItem('userId', data.user.id);
                toast.success(t.masukBerhasil, { position: 'top-right', autoClose: 1000 });
                setTimeout(() => navigate('/beranda'), 2000);
            } else {
                switch (data.code) {
                    case 'WRONG_EMAIL':
                        toast.error(t.emailGagal, { position: 'top-right', autoClose: 2000 });
                        break;
                    case 'WRONG_PASSWORD':
                        toast.error(t.katasandiGagal, { position: 'top-right', autoClose: 2000 });
                        break;
                    default:
                        toast.error(t.terjadiKesalahan, { position: 'top-right', autoClose: 2000 });
                        break;
                }
                setTimeout(() => navigate('/'), 2000);
            }                       
        } catch (error) {
            toast.error(t.terjadiKesalahan, { position: 'top-right', autoClose: 2000 });
        }
        console.log("Data dari Firebase:", userData);

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