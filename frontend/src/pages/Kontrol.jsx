import { useState, useEffect } from 'react';
import './Kontrol.css'; 
import logo from '../assets/LogoWeb.png';
import notificationIcon from '../assets/notification.svg';
import globeIcon from '../assets/language.svg';
import copyrightIcon from '../assets/copyright.svg';
import lightModeIcon from '../assets/lightmode.svg';
import darkModeIcon from '../assets/darkmode.svg';
import hamburgerIcon from '../assets/hamburger.svg';
import tripledotIcon from '../assets/other.svg';
import kamarKosIcon from '../assets/kamarkos.svg';
import translations from '../components/Bahasa.js';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const Kontrol = () => {
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
        const sidebar = document.getElementById("kontrol-sidebar");
        if (sidebar) {
            sidebar.classList.toggle("kontrol-open-sidebar");
        }
    };
    const closeSidebar = () => {
        const sidebar = document.getElementById("kontrol-sidebar");
        if (sidebar) {
            sidebar.classList.remove("kontrol-open-sidebar");
        }
    };
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        setShowDropdown(false);
    };

    useEffect(() => {
        document.body.className = darkMode ? 'kontrol-dark-mode' : 'kontrol-light-mode';
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
            const sidebar = document.getElementById("kontrol-sidebar");
            const hamburger = document.querySelector(".kontrol-hamburger");

            if (
                sidebar &&
                !sidebar.contains(event.target) &&
                !hamburger.contains(event.target)
            ) {
                sidebar.classList.remove("kontrol-open-sidebar");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Tombol on/off yang tersambung ke data dummy melalui id
    const [tombolOnOff, setTombolOnOff] = useState(() => {
        const stored = localStorage.getItem("tombolOnOff");
        if (stored) {
            return JSON.parse(stored);
        }
        const initialState = {};
        for (let i = 1; i <= 11; i++) {
            initialState[i] = false;
        }
        return initialState;
    });
    const handleTombolOnOff = (id) => {
        setTombolOnOff(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    useEffect(() => {
        localStorage.setItem("tombolOnOff", JSON.stringify(tombolOnOff));
    }, [tombolOnOff]);

    // Data dummy data tiap kamar
    const kamar1 = {
        id: 1,
        nama_lengkap: "Irman Prayista",
        nomor_telepon_pengguna_kos: "0882221999",
        sisa_hari: 30,
        penggunaan_kwh: 257
    };
    const kamar2 = {
        id: 2,
        nama_lengkap: "Ahmad Harits Burhani",
        nomor_telepon_pengguna_kos: "0882221888",
        sisa_hari: 26,
        penggunaan_kwh: 291
    };
    const kamar3 = {
        id: 3,
        nama_lengkap: "Faiz Hibatullah",
        nomor_telepon_pengguna_kos: "0882221777",
        sisa_hari: 20,
        penggunaan_kwh: 223
    };
    const kamar4 = {
        id: 4,
        nama_lengkap: "Hendri Maulana Azwar",
        nomor_telepon_pengguna_kos: "0882221666",
        sisa_hari: 18,
        penggunaan_kwh: 274
    };
    const kamar5 = {
        id: 5,
        nama_lengkap: "-",
        nomor_telepon_pengguna_kos: "-",
        sisa_hari: "-",
        penggunaan_kwh: "-"
    };
    const kamar6 = {
        id: 6,
        nama_lengkap: "-",
        nomor_telepon_pengguna_kos: "-",
        sisa_hari: "-",
        penggunaan_kwh: "-"
    };
    const kamar7 = {
        id: 7,
        nama_lengkap: "-",
        nomor_telepon_pengguna_kos: "-",
        sisa_hari: "-",
        penggunaan_kwh: "-"
    };
    const kamar8 = {
        id: 8,
        nama_lengkap: "-",
        nomor_telepon_pengguna_kos: "-",
        sisa_hari: "-",
        penggunaan_kwh: "-"
    };
    const kamar9 = {
        id: 9,
        nama_lengkap: "-",
        nomor_telepon_pengguna_kos: "-",
        sisa_hari: "-",
        penggunaan_kwh: "-"
    };
    const kamar10 = {
        id: 10,
        nama_lengkap: "-",
        nomor_telepon_pengguna_kos: "-",
        sisa_hari: "-",
        penggunaan_kwh: "-"
    };
    const kamar11 = {
        id: 11,
        nama_lengkap: "-",
        nomor_telepon_pengguna_kos: "-",
        sisa_hari: "-",
        penggunaan_kwh: "-"
    };
    
    return (
        <div className="kontrol-navbar-container">
            <div className="kontrol-navbar">
                <div className="kontrol-navbar-left">
                    <button className="kontrol-hamburger" onClick={toggleSidebar}>
                        <img src={hamburgerIcon} alt="Menu Sidebar" />
                    </button>
                    <img src={logo} alt="Logo" className="kontrol-logo-web" />
                    <a>Senergy</a>
                </div>
                <div className="kontrol-navbar-right">
                    {/* Ukuran HandPhone */}
                    <div className="kontrol-navbar-other-dropdown">
                        <img
                            ref={otherIconRef}
                            src={tripledotIcon}
                            alt="Menu"
                            className="kontrol-other-icon"
                            onClick={() => setShowNavRightDropDown(!showNavRightDropDown)}
                        />
                        {showNavRightDropDown && (
                            <div className="kontrol-navbar-other-dropdown-menu" ref={otherMenuRef}> 
                                {/* untuk Link gunakan a untuk edit CSS */}
                                <Link to="/kontak">{t.berandaKontak}</Link>
                                <Link to="/beranda">{t.berandaBeranda}</Link>
                                <Link to="/akun">{t.berandaAkun}</Link>
                            </div>
                        )}
                    </div>
                    {/* Ukuran Desktop */}
                    <div className="kontrol-navbar-right-desktop">
                        {/* untuk Link gunakan a untuk edit CSS */}
                        <Link to="/kontak">{t.berandaKontak}</Link>
                        <Link to="/beranda">{t.berandaBeranda}</Link>
                        <Link to="/akun">{t.berandaAkun}</Link>
                    </div>
                    <div className="kontrol-garis"></div>
                    <img src={notificationIcon} alt="Notifikasi" className="kontrol-notifikasi-icon" />
                    <div className="kontrol-language-switch">
                        <img
                            ref={globeRef}
                            src={globeIcon}
                            alt="Pilih Bahasa"
                            className="kontrol-globe-icon"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <div className="kontrol-dropdown-language" ref={dropdownRef}>
                                <div onClick={() => handleLanguageChange('id')}>Indonesian</div>
                                <div onClick={() => handleLanguageChange('en')}>English</div>
                            </div>
                        )}
                    </div>
                    <button 
                        className={"kontrol-mode-toggle " + (darkMode ? "kontrol-dark" : "kontrol-light")}
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <img src={darkModeIcon} alt="Dark Mode" className="kontrol-mode-icon" />
                        ) : (
                            <img src={lightModeIcon} alt="Light Mode" className="kontrol-mode-icon" />
                        )}
                    </button>
                </div>
            </div>
            <div className="kontrol-sidebar" id="kontrol-sidebar">
                {/* untuk Link gunakan a untuk edit CSS */}
                <Link to="/kamar" onClick={closeSidebar}>{t.berandaKamar}</Link>
                <Link to="/kontrol" onClick={closeSidebar}>{t.berandaKontrol}</Link>
                <Link to="/grafik" onClick={closeSidebar}>{t.berandaGrafik}</Link>
            </div>
            <div className="kontrol-main-content">
                <div className="kontrol-feature-grid">
                    <div className="kontrol-grid">
                        <div className="kontrol-item">
                            {/* --KAMAR 1 */}
                            <h3>{t.kamarKos} 1</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar1.nama_lengkap}</strong></p>
                                        <p>{kamar1.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar1.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar1.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar1.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar1.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar1.id)}>
                                            {tombolOnOff[kamar1.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 2 */}
                            <h3>{t.kamarKos} 2</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar2.nama_lengkap}</strong></p>
                                        <p>{kamar2.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar2.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar2.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar2.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar2.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar2.id)}>
                                            {tombolOnOff[kamar2.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 3 */}
                            <h3>{t.kamarKos} 3</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar3.nama_lengkap}</strong></p>
                                        <p>{kamar3.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar3.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar3.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar3.id}
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar3.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar3.id)}>
                                            {tombolOnOff[kamar3.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 4 */}
                            <h3>{t.kamarKos} 4</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar4.nama_lengkap}</strong></p>
                                        <p>{kamar4.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar4.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar4.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar4.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar4.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar4.id)}>
                                            {tombolOnOff[kamar4.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 5 */}
                            <h3>{t.kamarKos} 5</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar5.nama_lengkap}</strong></p>
                                        <p>{kamar5.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar5.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar5.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar5.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar5.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar5.id)}>
                                            {tombolOnOff[kamar5.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 6 */}
                            <h3>{t.kamarKos} 6</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar6.nama_lengkap}</strong></p>
                                        <p>{kamar6.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar6.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar6.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar6.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar6.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar6.id)}>
                                            {tombolOnOff[kamar6.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 7 */}
                            <h3>{t.kamarKos} 7</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar7.nama_lengkap}</strong></p>
                                        <p>{kamar7.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar7.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar7.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar7.id}
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar7.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar7.id)}>
                                            {tombolOnOff[kamar7.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 8 */}
                            <h3>{t.kamarKos} 8</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar8.nama_lengkap}</strong></p>
                                        <p>{kamar8.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar8.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar8.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar8.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar8.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar8.id)}>
                                            {tombolOnOff[kamar8.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 9 */}
                            <h3>{t.kamarKos} 9</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar9.nama_lengkap}</strong></p>
                                        <p>{kamar9.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar9.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar9.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar9.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar9.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar9.id)}>
                                            {tombolOnOff[kamar9.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 10 */}
                            <h3>{t.kamarKos} 10</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar10.nama_lengkap}</strong></p>
                                        <p>{kamar10.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar10.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar10.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar10.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar10.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar10.id)}>
                                            {tombolOnOff[kamar10.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className="kontrol-item">
                            {/* --KAMAR 11 */}
                            <h3>{t.kamarKos} 11</h3>
                            <div className="kontrol-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kontrol-icon" />
                                    <div className="kontrol-info">
                                        {/* --Data diambil dari dummy di atas */}
                                        <p><strong>{kamar11.nama_lengkap}</strong></p>
                                        <p>{kamar11.nomor_telepon_pengguna_kos}</p>
                                        <p>{kamar11.sisa_hari} {t.hariPenggunakos}</p>
                                        <p>{kamar11.penggunaan_kwh} kWh</p>
                                        <label><strong>{t.labelBatasKwh}</strong></label>
                                        <input
                                            // id untuk nomor tiap kamar
                                            id={kamar11.id} 
                                            type="number"
                                            placeholder={t.placeholderBatasKwh}
                                            className="kontrol-kwh-input"
                                            max={999}
                                            min={0}
                                        />
                                        <label><strong>{t.labelStatusRelay}</strong></label>
                                        <button className="kontrol-on-off" style={{ backgroundColor: tombolOnOff[kamar11.id] ? "#27ae60" : "#C40000" }} onClick={() => handleTombolOnOff(kamar11.id)}>
                                            {tombolOnOff[kamar11.id] ? t.tombolOnKontrol : t.tombolOffKontrol}
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="kontrol-footer-edit">
                <img src={copyrightIcon} className="kontrol-footer-icon" />
                <p>{t.berandaHakCipta}</p>
            </footer>
        </div>
    );
};

export default Kontrol;