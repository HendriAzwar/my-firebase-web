import { useState, useEffect } from 'react';
import './Kontak.css'; 
import logo from '../assets/LogoWeb.png';
import notificationIcon from '../assets/notification.svg';
import globeIcon from '../assets/language.svg';
import copyrightIcon from '../assets/copyright.svg';
import lightModeIcon from '../assets/lightmode.svg';
import darkModeIcon from '../assets/darkmode.svg';
import hamburgerIcon from '../assets/hamburger.svg';
import tripledotIcon from '../assets/other.svg';
import translations from '../components/Bahasa.js';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const Kontak = () => {
    const dropdownRef = useRef(null);
    const globeRef = useRef(null);
    const otherMenuRef = useRef(null);
    const otherIconRef = useRef(null);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true';
    });
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNavRightDropDown, setShowNavRightDropDown] = useState(false);
    const t = translations[language];
    const toggleSidebar = () => {
        const sidebar = document.getElementById("kontak-sidebar");
        if (sidebar) {
            sidebar.classList.toggle("kontak-open-sidebar");
        }
    };
    const closeSidebar = () => {
        const sidebar = document.getElementById("kontak-sidebar");
        if (sidebar) {
            sidebar.classList.remove("kontak-open-sidebar");
        }
    };
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        setShowDropdown(false);
    };

    useEffect(() => {
        document.body.className = darkMode ? 'kontak-dark-mode' : 'kontak-light-mode';
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                globeRef.current &&
                !globeRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }

            if (
                otherMenuRef.current &&
                !otherMenuRef.current.contains(event.target) &&
                otherIconRef.current &&
                !otherIconRef.current.contains(event.target)
            ) {
                setShowNavRightDropDown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideDropdown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById("kontak-sidebar");
            const hamburger = document.querySelector(".kontak-hamburger");

            if (
                sidebar &&
                !sidebar.contains(event.target) &&
                !hamburger.contains(event.target)
            ) {
                sidebar.classList.remove("kontak-open-sidebar");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="kontak-navbar-container">
            <div className="kontak-navbar">
                <div className="kontak-navbar-left">
                    <button className="kontak-hamburger" onClick={toggleSidebar}>
                        <img src={hamburgerIcon} alt="Menu Sidebar" />
                    </button>
                    <img src={logo} alt="Logo" className="kontak-logo-web" />
                    <a>Senergy</a>
                </div>
                <div className="kontak-navbar-right">
                    {/* Ukuran HandPhone */}
                    <div className="kontak-navbar-other-dropdown">
                        <img
                            ref={otherIconRef}
                            src={tripledotIcon}
                            alt="Menu"
                            className="kontak-other-icon"
                            onClick={() => setShowNavRightDropDown(!showNavRightDropDown)}
                        />
                        {showNavRightDropDown && (
                            <div className="kontak-navbar-other-dropdown-menu" ref={otherMenuRef}>
                                {/* untuk Link gunakan a untuk edit CSS */}
                                <Link to="/kontak">{t.berandaKontak}</Link>
                                <Link to="/beranda">{t.berandaBeranda}</Link>
                                <Link to="/akun">{t.berandaAkun}</Link>
                            </div>
                        )}
                    </div>
                    {/* Ukuran Desktop */}
                    <div className="kontak-navbar-right-desktop">
                        {/* untuk Link gunakan a untuk edit CSS */}
                        <Link to="/kontak">{t.berandaKontak}</Link>
                        <Link to="/beranda">{t.berandaBeranda}</Link>
                        <Link to="/akun">{t.berandaAkun}</Link>
                    </div>
                    <div className="kontak-garis"></div>
                    <img src={notificationIcon} alt="Notifikasi" className="kontak-notifikasi-icon" />
                    <div className="kontak-language-switch">
                        <img
                            ref={globeRef}
                            src={globeIcon}
                            alt="Pilih Bahasa"
                            className="kontak-globe-icon"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <div className="kontak-dropdown-language" ref={dropdownRef}>
                                <div onClick={() => handleLanguageChange('id')}>Indonesian</div>
                                <div onClick={() => handleLanguageChange('en')}>English</div>
                            </div>
                        )}
                    </div>
                    <button 
                        className={"kontak-mode-toggle " + (darkMode ? "kontak-dark" : "kontak-light")}
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <img src={darkModeIcon} alt="Dark Mode" className="kontak-mode-icon" />
                        ) : (
                            <img src={lightModeIcon} alt="Light Mode" className="kontak-mode-icon" />
                        )}
                    </button>
                </div>
            </div>
            <div className="kontak-sidebar" id="kontak-sidebar">
                {/* untuk Link gunakan a untuk edit CSS */}
                <Link to="/kamar" onClick={closeSidebar}>{t.berandaKamar}</Link>
                {/* <Link to="/kontrol" onClick={closeSidebar}>{t.berandaKontrol}</Link> */}
                <Link to="/grafik" onClick={closeSidebar}>{t.berandaGrafik}</Link>
            </div>
            <div className="kontak-main-content">
                <div className="kontak-feature-grid">
                    <div className="kontak-wrapper">
                        <h2 className="kontak-title">{t.judulHalamanKontak}</h2>
                        <div className="kontak-container">
                            <div className="kontak-logo">
                                <img src={logo} alt="Senergy Logo" className="kontak-logo-image" />
                                <h3 className="kontak-logo-text">Senergy</h3>
                            </div>
                            <div className="kontak-form">
                                <label className="kontak-form-label">{t.email}</label>
                                <input
                                    type="email"
                                    className="kontak-form-input"
                                    placeholder={t.placeholderEmail}
                                />
                                <label className="kontak-form-label">{t.labelPesanAnda}</label>
                                <textarea
                                    className="kontak-form-textarea"
                                    placeholder={t.placeholderPesan}
                                    rows="6"
                                />
                                <button className="kontak-form-button">{t.pesanKirim}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="kontak-footer-edit">
                <img src={copyrightIcon} className="kontak-footer-icon" />
                <p>{t.berandaHakCipta}</p>
            </footer>
        </div>
    );
};

export default Kontak;