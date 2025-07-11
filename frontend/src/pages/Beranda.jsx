import { useState, useEffect } from 'react';
import './Beranda.css'; 
import logo from '../assets/LogoWeb.png';
import notificationIcon from '../assets/notification.svg';
import globeIcon from '../assets/language.svg';
import graphicIcon from '../assets/graphic.svg';
import controlIcon from '../assets/control.svg';
import copyrightIcon from '../assets/copyright.svg';
import lightModeIcon from '../assets/lightmode.svg';
import darkModeIcon from '../assets/darkmode.svg';
import hamburgerIcon from '../assets/hamburger.svg';
import tripledotIcon from '../assets/other.svg';
import translations from '../components/Bahasa.js';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const Beranda = () => {
    // === DARK MODE FUNCTIONALITY ===
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true';
    });
    useEffect(() => {
        document.body.className = darkMode ? 'beranda-dark-mode' : 'beranda-light-mode';
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);
    // ================================

    // === LANGUAGE FUNCTIONALITY ===
    const dropdownRef = useRef(null);
    const globeRef = useRef(null);
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const [showDropdown, setShowDropdown] = useState(false);
    const t = translations[language];
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        setShowDropdown(false);
    };
    // ================================

    // === NAVIGATION DROPDOWN FUNCTIONALITY ===
    const otherMenuRef = useRef(null);
    const otherIconRef = useRef(null);
    const [showNavRightDropDown, setShowNavRightDropDown] = useState(false);
    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            // Handle language dropdown
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                globeRef.current &&
                !globeRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }

            // Handle navigation right dropdown
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
    // ================================

    // ======== SIDEBAR ========
    const toggleSidebar = () => {
        const sidebar = document.getElementById("beranda-sidebar");
        if (sidebar) {
            sidebar.classList.toggle("beranda-open-sidebar");
        }
    };
    const closeSidebar = () => {
        const sidebar = document.getElementById("beranda-sidebar");
        if (sidebar) {
            sidebar.classList.remove("beranda-open-sidebar");
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById("beranda-sidebar");
            const hamburger = document.querySelector(".beranda-hamburger");

            if (
                sidebar &&
                !sidebar.contains(event.target) &&
                !hamburger.contains(event.target)
            ) {
                sidebar.classList.remove("beranda-open-sidebar");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // ================================

    return (
        <div className="beranda-halaman">
            <div className="beranda-navbar">
                <div className="beranda-navbar-left">
                    <button className="beranda-hamburger" onClick={toggleSidebar}>
                        <img src={hamburgerIcon} alt="Menu Sidebar" />
                    </button>
                    <img src={logo} alt="Logo" className="beranda-logo-web" />
                    <a>Senergy</a>
                </div>
                <div className="beranda-navbar-right">
                    {/* Ukuran HandPhone */}
                    <div className="beranda-navbar-other-dropdown">
                        <img
                            ref={otherIconRef}
                            src={tripledotIcon}
                            alt="Menu"
                            className="beranda-other-icon"
                            onClick={() => setShowNavRightDropDown(!showNavRightDropDown)}
                        />
                        {showNavRightDropDown && (
                            <div className="beranda-navbar-other-dropdown-menu" ref={otherMenuRef}>
                                {/* untuk Link gunakan a untuk edit CSS */}
                                <Link to="/kontak">{t.berandaKontak}</Link>
                                <Link to="/beranda">{t.berandaBeranda}</Link>
                                <Link to="/akun">{t.berandaAkun}</Link>
                            </div>
                        )}
                    </div>
                    {/* Ukuran Desktop */}
                    <div className="beranda-navbar-right-desktop">
                        {/* untuk Link gunakan a untuk edit CSS */}
                        <Link to="/kontak">{t.berandaKontak}</Link>
                        <Link to="/beranda">{t.berandaBeranda}</Link>
                        <Link to="/akun">{t.berandaAkun}</Link>
                    </div>
                    <div className="beranda-garis"></div>
                    <img src={notificationIcon} alt="Notifikasi" className="beranda-notifikasi-icon" />
                    <div className="beranda-language-switch">
                        <img
                            ref={globeRef}
                            src={globeIcon}
                            alt="Pilih Bahasa"
                            className="beranda-globe-icon"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <div className="beranda-dropdown-language" ref={dropdownRef}>
                                <div onClick={() => handleLanguageChange('id')}>Indonesian</div>
                                <div onClick={() => handleLanguageChange('en')}>English</div>
                            </div>
                        )}
                    </div>
                    <button 
                        className={"beranda-mode-toggle " + (darkMode ? "beranda-dark" : "beranda-light")}
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <img src={darkModeIcon} alt="Dark Mode" className="beranda-mode-icon" />
                        ) : (
                            <img src={lightModeIcon} alt="Light Mode" className="beranda-mode-icon" />
                        )}
                    </button>
                </div>
            </div>
            <div className="beranda-sidebar" id="beranda-sidebar">
                {/* untuk Link gunakan a untuk edit CSS */}
                <Link to="/kamar" onClick={closeSidebar}>{t.berandaKamar}</Link>
                {/* <Link to="/kontrol" onClick={closeSidebar}>{t.berandaKontrol}</Link> */}
                <Link to="/grafik" onClick={closeSidebar}>{t.berandaGrafik}</Link>
            </div>
            <div className="beranda-main-content">
                <h1>{t.berandaSelamatDatang}</h1>
                <p className="beranda-deskripsi-main-content">{t.berandaDeskripsi}</p>
                <h2>{t.berandaFiturUtama}</h2>
                <div className="beranda-feature-grid">
                    <div className="beranda-feature-grafik">
                        <img src={graphicIcon} alt="Grafik" />
                        <div className="beranda-feature-description-grafik">
                            <h3>{t.berandaJudulGrafik}</h3>
                            <p>{t.berandaDeskripsiGrafik}</p>
                        </div>
                    </div>
                    <div className="beranda-feature-kontrol">
                        <div className="beranda-feature-description-kontrol">
                            <h3>{t.berandaJudulKontrol}</h3>
                            <p>{t.berandaDeskripsiKontrol}</p>
                        </div>
                        <img src={controlIcon} alt="Kontrol" />
                    </div>
                    <div className="beranda-feature-notifikasi">
                        <img src={notificationIcon} alt="Notifikasi" />
                        <div className="beranda-feature-description-notifikasi">
                            <h3>{t.berandaJudulNotifikasi}</h3>
                            <p>{t.berandaDeskripsiNotifikasi}</p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="beranda-footer-edit">
                <img src={copyrightIcon} className="beranda-footer-icon" />
                <p>{t.berandaHakCipta}</p>
            </footer>
        </div>
    );
};

export default Beranda;