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

const LupaPassword = () => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const [showDropdown, setShowDropdown] = useState(false);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const t = translations[language];
    const navigate = useNavigate();
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setShowDropdown(false);
        localStorage.setItem('language', lang);
    };
    const changePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error(t.kataSandiTidakSesuai, { position: 'top-right', autoClose: 2000 });
            return;
        }
        try {
            const emailCheck = await fetch('http://localhost:5000/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const emailResult = await emailCheck.json();
            if (!emailCheck.ok || emailResult.code !== 'EMAIL_FOUND') {
                toast.error(t.emailTidakDitemukan, { position: 'top-right', autoClose: 2000 });
                return;
            }
            const resetResponse = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });
            const resetResult = await resetResponse.json();
            if (resetResult.code === 'PASSWORD_SAME_AS_OLD') {
                toast.error(t.kataSandiSamaSebelumnya, { position: 'top-right', autoClose: 2000 });
            } else if (resetResponse.ok && resetResult.code === 'RESET_SUCCESS') {
                toast.success(t.kataSandiBerhasilDiubah, { position: 'top-right', autoClose: 1000 });
                setTimeout(() => navigate('/'), 2000);
            } else {
                toast.error(t.kataSandiGagalDiubah, { position: 'top-right', autoClose: 2000 });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(t.kataSandiGagalDiubah, { position: 'top-right', autoClose: 2000 });
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
                    <label htmlFor="new-password">{t.kataSandiBaru}</label>
                    <div className="login-password-wrapper">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t.placeholderKataSandiBaru}
                            required
                        />
                        <img
                            src={showNewPassword ? showIcon : hideIcon}
                            alt={showNewPassword ? "Show Password" : "Hide Password"}
                            className="login-icon"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        />
                    </div>
                    <label htmlFor="confirm-password">{t.konfirmasiKataSandiBaru}</label>
                    <div className="login-password-wrapper">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t.placeholderKonfirmasiKataSandiBaru}
                            required
                        />
                        <img
                            src={showConfirmPassword ? showIcon : hideIcon}
                            alt={showConfirmPassword ? "Show Password" : "Hide Password"}
                            className="login-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>
                    <button type="submit">{t.ubahKataSandi}</button>
                    <p className="login-register">
                        {t.sudahIngatKataSandi} <Link to="/">{t.masukDisini}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LupaPassword;