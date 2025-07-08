import { useState, useEffect } from 'react';
import './Kamar.css'; 
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

const Kamar = () => {
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
        const sidebar = document.getElementById("kamar-sidebar");
        if (sidebar) {
            sidebar.classList.toggle("kamar-open-sidebar");
        }
    };
    const closeSidebar = () => {
        const sidebar = document.getElementById("kamar-sidebar");
        if (sidebar) {
            sidebar.classList.remove("kamar-open-sidebar");
        }
    };
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        setShowDropdown(false);
    };
    useEffect(() => {
        document.body.className = darkMode ? 'kamar-dark-mode' : 'kamar-light-mode';
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
            const sidebar = document.getElementById("kamar-sidebar");
            const hamburger = document.querySelector(".kamar-hamburger");
            if (
                sidebar &&
                !sidebar.contains(event.target) &&
                !hamburger.contains(event.target)
            ) {
                sidebar.classList.remove("kamar-open-sidebar");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Tombol gunakan kamar 
    const [tombolGunakanKamar, setTombolGunakanKamar] = useState(() => {
        const stored = localStorage.getItem("tombolGunakanKamar");
        if (stored) {
            return JSON.parse(stored);
        }
        const initialState = {};
        for (let i = 1; i <= 11; i++) {
            initialState[i] = false;
        }
        return initialState;
    });

    const [showForm, setShowForm] = useState(false);
    const [selectedKamarId, setSelectedKamarId] = useState(null);
    const handleTombolGunakanKamar = (id) => {
        if (!tombolGunakanKamar[id]) {
            setSelectedKamarId(id);
            setShowForm(true);
        } else {
            // Jika ingin menonaktifkan kamar tanpa form
            setTombolGunakanKamar(prev => ({
                ...prev,
                [id]: false
            }));
        }
    };
    const handleSubmitForm = () => {
        setTombolGunakanKamar(prev => ({
            ...prev,
            [selectedKamarId]: true
        }));
        setShowForm(false);
    };

    useEffect(() => {
        localStorage.setItem("tombolGunakanKamar", JSON.stringify(tombolGunakanKamar));
    }, [tombolGunakanKamar]);

    // Fitur popup pendaftaran kamar
    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showForm]);

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
        <div className="kamar-navbar-container">
            <div className="kamar-navbar">
                <div className="kamar-navbar-left">
                    <button className="kamar-hamburger" onClick={toggleSidebar}>
                        <img src={hamburgerIcon} alt="Menu Sidebar" />
                    </button>
                    <img src={logo} alt="Logo" className="kamar-logo-web" />
                    <a>Senergy</a>
                </div>
                <div className="kamar-navbar-right">
                    {/* Ukuran HandPhone */}
                    <div className="kamar-navbar-other-dropdown">
                        <img
                            ref={otherIconRef}
                            src={tripledotIcon}
                            alt="Menu"
                            className="kamar-other-icon"
                            onClick={() => setShowNavRightDropDown(!showNavRightDropDown)}
                        />
                        {showNavRightDropDown && (
                            <div className="kamar-navbar-other-dropdown-menu" ref={otherMenuRef}>
                                {/* untuk Link gunakan a untuk edit CSS */}
                                <Link to="/kontak">{t.berandaKontak}</Link>
                                <Link to="/beranda">{t.berandaBeranda}</Link>
                                <Link to="/akun">{t.berandaAkun}</Link>
                            </div>
                        )}
                    </div>
                    {/* Ukuran Desktop */}
                    <div className="kamar-navbar-right-desktop">
                        {/* untuk Link gunakan a untuk edit CSS */}
                        <Link to="/kontak">{t.berandaKontak}</Link>
                        <Link to="/beranda">{t.berandaBeranda}</Link>
                        <Link to="/akun">{t.berandaAkun}</Link>
                    </div>
                    <div className="kamar-garis"></div>
                    <img src={notificationIcon} alt="Notifikasi" className="kamar-notifikasi-icon" />
                    <div className="kamar-language-switch">
                        <img
                            ref={globeRef}
                            src={globeIcon}
                            alt="Pilih Bahasa"
                            className="kamar-globe-icon"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (
                            <div className="kamar-dropdown-language" ref={dropdownRef}>
                                <div onClick={() => handleLanguageChange('id')}>Indonesian</div>
                                <div onClick={() => handleLanguageChange('en')}>English</div>
                            </div>
                        )}
                    </div>
                    <button 
                        className={"kamar-mode-toggle " + (darkMode ? "kamar-dark" : "kamar-light")}
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <img src={darkModeIcon} alt="Dark Mode" className="kamar-mode-icon" />
                        ) : (
                            <img src={lightModeIcon} alt="Light Mode" className="kamar-mode-icon" />
                        )}
                    </button>
                </div>
            </div>
            <div className="kamar-sidebar" id="kamar-sidebar">
                {/* untuk Link gunakan a untuk edit CSS */}
                <Link to="/kamar" onClick={closeSidebar}>{t.berandaKamar}</Link>
                {/* <Link to="/kontrol" onClick={closeSidebar}>{t.berandaKontrol}</Link> */}
                <Link to="/grafik" onClick={closeSidebar}>{t.berandaGrafik}</Link>
            </div>
            <div className="kamar-main-content">
                <div className="kamar-feature-grid">
                    <div className="kamar-grid">
                        <div className="kamar-item">
                            {/* --KAMAR 1 */}
                            <h3>{t.kamarKos} 1</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar1.nama_lengkap}</strong></p>
                                    <p>{kamar1.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar1.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar1.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar1.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar1.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar1.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                    {/* Pop up ini bisa digunakan di kamar lain meskipun di simpan di 1 kamar */}
                                    {showForm && (
                                        <div className="kamar-daftar-overlay">
                                            <div className="kamar-daftar-container">
                                                <h2 className="kamar-daftar-title">Pendaftaran Kamar</h2>
                                                <div className="kamar-daftar-content">
                                                    <div className="kamar-daftar-left">
                                                        <h3>Kamar {selectedKamarId}</h3>
                                                            <div className="kamar-daftar-icon">
                                                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-daftar-icon-kamar" />
                                                            </div>
                                                    </div>
                                                    <div className="kamar-daftar-right">
                                                        <label className="kamar-daftar-labelnama">{t.namaLengkap}</label>
                                                        <input type="text" className="kamar-daftar-inputnama" placeholder={t.placeholderNamalengkap} />
                                                        <label className="kamar-daftar-labelnomor">{t.nomorTelepon}</label>
                                                        <input type="text" className="kamar-daftar-inputnomor" placeholder={t.placeholderNomorTelepon} />
                                                        <button className="kamar-daftar-button-kamar" onClick={handleSubmitForm}>
                                                            {t.gunakanKamar}
                                                        </button>
                                                        <button className="kamar-daftar-button-tutup" onClick={() => setShowForm(false)}>
                                                            {t.tutupDaftarKamar}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p>{t.catatanDaftarKamar}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 2 */}
                            <h3>{t.kamarKos} 2</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar2.nama_lengkap}</strong></p>
                                    <p>{kamar2.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar2.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar2.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar2.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar2.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar2.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 3 */}
                            <h3>{t.kamarKos} 3</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar3.nama_lengkap}</strong></p>
                                    <p>{kamar3.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar3.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar3.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar3.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar3.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar3.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 4 */}
                            <h3>{t.kamarKos} 4</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar4.nama_lengkap}</strong></p>
                                    <p>{kamar4.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar4.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar4.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar4.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar4.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar4.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 5 */}
                            <h3>{t.kamarKos} 5</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar5.nama_lengkap}</strong></p>
                                    <p>{kamar5.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar5.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar5.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar5.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar5.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar5.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 6 */}
                            <h3>{t.kamarKos} 6</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar6.nama_lengkap}</strong></p>
                                    <p>{kamar6.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar6.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar6.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar6.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar6.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar6.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 7 */}
                            <h3>{t.kamarKos} 7</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar7.nama_lengkap}</strong></p>
                                    <p>{kamar7.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar7.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar7.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar7.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar7.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar7.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 8 */}
                            <h3>{t.kamarKos} 8</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar8.nama_lengkap}</strong></p>
                                    <p>{kamar8.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar8.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar8.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar8.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar8.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar8.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 9 */}
                            <h3>{t.kamarKos} 9</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar9.nama_lengkap}</strong></p>
                                    <p>{kamar9.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar9.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar9.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar9.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar9.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar9.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 10 */}
                            <h3>{t.kamarKos} 10</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar10.nama_lengkap}</strong></p>
                                    <p>{kamar10.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar10.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar10.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar10.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar10.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar10.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="kamar-item">
                            {/* --KAMAR 11 */}
                            <h3>{t.kamarKos} 11</h3>
                            <div className="kamar-list">
                                <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                                <div className="kamar-info">
                                    {/* --Data diambil dari dummy di atas */}
                                    <p><strong>{kamar11.nama_lengkap}</strong></p>
                                    <p>{kamar11.nomor_telepon_pengguna_kos}</p>
                                    <p>{kamar11.sisa_hari} {t.hariPenggunakos}</p>
                                    <p>{kamar11.penggunaan_kwh} kWh</p>
                                    <button
                                        className={`kamar-status-button ${tombolGunakanKamar[kamar11.id] ? 'active' : 'inactive'}`}
                                        onClick={() => {
                                            handleTombolGunakanKamar(kamar11.id);
                                            setShowForm(true);
                                        }}
                                    >
                                        {tombolGunakanKamar[kamar11.id] ? t.kamarSedangDigunakan : t.gunakanKamar}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="kamar-footer-edit">
                <img src={copyrightIcon} className="kamar-footer-icon" />
                <p>{t.berandaHakCipta}</p>
            </footer>
        </div>
    );
};

export default Kamar;