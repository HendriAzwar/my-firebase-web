import { useState, useEffect, useRef } from 'react';
import './Akun.css'; 
import logo from '../assets/LogoWeb.png';
import notificationIcon from '../assets/notification.svg';
import globeIcon from '../assets/language.svg';
import copyrightIcon from '../assets/copyright.svg';
import lightModeIcon from '../assets/lightmode.svg';
import darkModeIcon from '../assets/darkmode.svg';
import hamburgerIcon from '../assets/hamburger.svg';
import tripledotIcon from '../assets/other.svg';
import showIcon from '../assets/unhide.svg';
import hideIcon from '../assets/hide.svg';
import translations from '../components/Bahasa.js';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; // pastikan sudah impor

const Akun = () => {
    // Menu sidebar kiri
    const toggleSidebar = () => {
        const sidebar = document.getElementById("akun-sidebar");
        if (sidebar) {
            sidebar.classList.toggle("akun-open-sidebar");
        }
    };
    const closeSidebar = () => {
        const sidebar = document.getElementById("akun-sidebar");
        if (sidebar) {
            sidebar.classList.remove("akun-open-sidebar");
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById("akun-sidebar");
            const hamburger = document.querySelector(".akun-hamburger");
            if (
                sidebar &&
                !sidebar.contains(event.target) &&
                !hamburger.contains(event.target)
            ) {
                sidebar.classList.remove("akun-open-sidebar");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Menu lainnya (Three Dots): kontak, akun, dan beranda
    const otherMenuThreeDots = useRef(null);
    const otherIconThreeDots = useRef(null);
    const [showNavRightDropDown, setShowNavRightDropDown] = useState(false);

    // Bahasa
    const dropdownLanguage = useRef(null);
    const globeLanguage = useRef(null);
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const [showDropdownLanguage, setShowDropdownLanguage] = useState(false);
    const t = translations[language];
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        setShowDropdownLanguage(false);
    };
    
    // Fitur ubah bahasa dan menu three dots (lainnya): kontak, akun, dan beranda
    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            if (
                dropdownLanguage.current &&
                !dropdownLanguage.current.contains(event.target) &&
                globeLanguage.current &&
                !globeLanguage.current.contains(event.target)
            ) {
                setShowDropdownLanguage(false);
            }
            if (
                otherMenuThreeDots.current &&
                !otherMenuThreeDots.current.contains(event.target) &&
                otherIconThreeDots.current &&
                !otherIconThreeDots.current.contains(event.target)
            ) {
                setShowNavRightDropDown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideDropdown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        };
    }, []);

    // Show dan hide password form kiri dan kanan
    const [showPasswordLeft, setShowPasswordLeft] = useState(false);
    const [showPasswordRight, setShowPasswordRight] = useState(false);
    const togglePasswordLeft = () => {
        setShowPasswordLeft(!showPasswordLeft);
    };
    const togglePasswordRight = () => {
        setShowPasswordRight(!showPasswordRight);
    };

    // Darkmode dan lightmode
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true'; 
    });
    useEffect(() => {
        document.body.className = darkMode ? 'akun-dark-mode' : 'akun-light-mode';
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const uid = localStorage.getItem('userId');

    // Tampilkan data akun
    const [userData, setUserData] = useState({});
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    toast.error("User tidak ditemukan");
                }
            } catch (err) {
                console.error('Gagal ambil data user:', err);
                toast.error(t.gagalAmbilData);
            }
        };
        if (uid) fetchUserData();
    }, [uid]);
    
    // Tombol logout
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('userId');
        toast.success(t.keluarBerhasil, { position: 'top-right', autoClose: 1000, closeButton: false, pauseOnHover: false });
        setTimeout(() => navigate('/'), 2000);
    };

    // untuk menampilkan hash
    const formatHashDisplay = (hash) => {
        if (!hash || hash.length <= 20) return hash;
        return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`;
    };

    // Ubah data user di halaman akun
    const [editData, setEditData] = useState({
        full_name: '',
        phone_number: '',
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        const { id, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleUpdate = async () => {
        const payload = {};
        Object.keys(editData).forEach((key) => {
            if (editData[key].trim() !== '') payload[key] = editData[key];
        });
        if (Object.keys(payload).length === 0) return;

        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, payload);
            toast.success(t.dataBerhasilDiubah, { position: 'top-right', autoClose: 1000, closeButton: false, pauseOnHover: false });
            setEditData({ full_name: '', phone_number: '', email: '', password: '' });
            const updatedSnap = await getDoc(userRef);
            setUserData(updatedSnap.data());
        } catch (error) {
            console.error('Update error:', error);
            toast.error(t.gagalUbahData, { autoClose: 2000 });
        }
    };

    // Hapus akun users
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [stepConfirm, setStepConfirm] = useState(1);
    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
        setStepConfirm(1);
        setConfirmEmail('');
    };
    
    const handleConfirmDelete = async () => {
        if (confirmEmail !== userData.email) {
            toast.error(t.gagalHapusAkun, { autoClose: 2000 });
            return;
        }
        try {
            await deleteDoc(doc(db, 'users', uid));
            toast.success(t.berhasilHapusAkun, { autoClose: 1500 });
            localStorage.removeItem('userId');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(t.errorHapusAkun, { autoClose: 2000 });
        }
    };

    return (
        <div className="akun-navbar-container">
            <ToastContainer />
            <div className="akun-navbar">
                <div className="akun-navbar-left">
                    <button className="akun-hamburger" onClick={toggleSidebar}>
                        <img src={hamburgerIcon} alt="Menu Sidebar" />
                    </button>
                    <img src={logo} alt="Logo" className="akun-logo-web" />
                    <a>Senergy</a>
                </div>
                <div className="akun-navbar-right">
                    {/* Ukuran HandPhone */}
                    <div className="akun-navbar-other-dropdown">
                        <img
                            ref={otherIconThreeDots}
                            src={tripledotIcon}
                            alt="Menu"
                            className="akun-other-icon"
                            onClick={() => setShowNavRightDropDown(!showNavRightDropDown)}
                        />
                        {showNavRightDropDown && (
                            <div className="akun-navbar-other-dropdown-menu" ref={otherMenuThreeDots}>
                                {/* untuk Link gunakan a untuk edit CSS */}
                                <Link to="/kontak">{t.berandaKontak}</Link>
                                <Link to="/beranda">{t.berandaBeranda}</Link>
                                <Link to="/akun">{t.berandaAkun}</Link>
                            </div>
                        )}
                    </div>
                    {/* Ukuran Desktop */}
                    <div className="akun-navbar-right-desktop">
                        {/* untuk Link gunakan a untuk edit CSS */}
                        <Link to="/kontak">{t.berandaKontak}</Link>
                        <Link to="/beranda">{t.berandaBeranda}</Link>
                        <Link to="/akun">{t.berandaAkun}</Link>
                    </div>
                    <div className="akun-garis"></div>
                    <img src={notificationIcon} alt="Notifikasi" className="akun-notifikasi-icon" />
                    <div className="akun-language-switch">
                        <img
                            ref={globeLanguage}
                            src={globeIcon}
                            alt="Pilih Bahasa"
                            className="akun-globe-icon"
                            onClick={() => setShowDropdownLanguage(!showDropdownLanguage)}
                        />
                        {showDropdownLanguage && (
                            <div className="akun-dropdown-language" ref={dropdownLanguage}>
                                <div onClick={() => handleLanguageChange('id')}>Indonesian</div>
                                <div onClick={() => handleLanguageChange('en')}>English</div>
                            </div>
                        )}
                    </div>
                    <button 
                        className={"akun-mode-toggle " + (darkMode ? "akun-dark" : "akun-light")}
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <img src={darkModeIcon} alt="Dark Mode" className="akun-mode-icon" />
                        ) : (
                            <img src={lightModeIcon} alt="Light Mode" className="akun-mode-icon" />
                        )}
                    </button>
                </div>
            </div>
            <div className="akun-sidebar" id="akun-sidebar">
                {/* untuk Link gunakan a untuk edit CSS */}
                <Link to="/kamar" onClick={closeSidebar}>{t.berandaKamar}</Link>
                {/* <Link to="/kontrol" onClick={closeSidebar}>{t.berandaKontrol}</Link> */}
                <Link to="/grafik" onClick={closeSidebar}>{t.berandaGrafik}</Link>
            </div>
            <div className="akun-main-content">
                <div className="akun-feature-grid">
                    {/* Isi Akun */}
                    <div className="akun-akun-user">
                        {/* Form kiri */}
                        <div className="akun-form">
                            <label htmlFor="full_name">{t.namaLengkap}</label>
                            <input 
                                type="text"
                                id="full_name"
                                value={editData.full_name}
                                onChange={handleChange}
                                placeholder={t.placeholderNamalengkap}
                            />
                            <label htmlFor="phone_number">{t.nomorTelepon}</label>
                            <input 
                                type="tel"
                                id="phone_number"
                                value={editData.phone_number}
                                onChange={handleChange}
                                placeholder={t.placeholderNomorTelepon}
                            />
                            <label htmlFor="email">{t.email}</label>
                            <input
                                type="email"
                                id="email"
                                value={editData.email}
                                onChange={handleChange}
                                placeholder={t.placeholderEmail}
                            />
                            <label htmlFor="password">{t.kataSandi}</label>
                            <div className="akun-password-wrapper">
                                <input
                                    type={showPasswordLeft ? 'text' : 'password'}
                                    id="password"
                                    value={editData.password}
                                    onChange={handleChange}
                                    placeholder={t.placeholderKataSandi}
                                />
                                <img
                                    src={showPasswordLeft ? showIcon : hideIcon}
                                    alt={showPasswordLeft ? "Show Password" : "Hide Password"}
                                    className="akun-icon"
                                    onClick={togglePasswordLeft}
                                />
                            </div>
                            <button onClick={handleUpdate}>{t.ubahDataUser}</button>
                        </div>
                        {/* Form kanan */}
                        <div className="akun-form">
                            <label htmlFor="full_name">{t.namaLengkap}</label>
                            <input 
                                type="text"
                                value={userData.full_name || ''}
                                id="full_name_readonly"
                                readOnly
                            />
                            <label htmlFor="phone_number">{t.nomorTelepon}</label>
                            <input 
                                type="tel"
                                value={userData.phone_number || ''}
                                id="phone_number_readonly"
                                readOnly
                            />
                            <label htmlFor="email">{t.email}</label>
                            <input
                                type="email"
                                value={userData.email || ''}
                                id="email_readonly"
                                readOnly
                            />
                            <label htmlFor="password">{t.kataSandi}</label>
                            <div className="akun-password-wrapper">
                                <input
                                    type={showPasswordRight ? 'text' : 'password'}
                                    id="password-right"
                                    value={showPasswordRight ? (userData.password || '') : formatHashDisplay(userData.password || '')}
                                    readOnly
                                    title={showPasswordRight ? userData.password : 'Click show to see full hash'}
                                />
                                <img
                                    src={showPasswordRight ? showIcon : hideIcon}
                                    alt={showPasswordRight ? "Show Password" : "Hide Password"}
                                    className="akun-icon"
                                    onClick={togglePasswordRight}
                                />
                            </div>
                            <button onClick={handleLogout}>{t.keluarDataUser}</button>
                        </div>
                    </div>
                    {/* Hapus akun */}
                    <div className="akun-hapus-akun">
                        <button onClick={handleDeleteAccount} className="akun-button-hapus" >{t.hapusDataUser}</button>
                    </div>
                    {showDeleteModal && (
                        <div className="akun-hapus-overlay">
                            <div className="akun-hapus-box">
                                {stepConfirm === 1 ? (
                                    // Tombol ya atau tidak hapus akun
                                    <>
                                        <p>{t.hapusAkun}</p>
                                        <div className="akun-hapus-buttons">
                                            <button onClick={() => setStepConfirm(2)}>{t.ya}</button>
                                            <button onClick={() => setShowDeleteModal(false)}>{t.tidak}</button>
                                        </div>
                                    </>
                                ) : (
                                    // Tombol konfirmasi atau tidak hapus akun
                                    <>
                                        <p>{t.email}</p>
                                        <input
                                            type="email"
                                            placeholder={t.placeholderEmail}
                                            value={confirmEmail}
                                            onChange={(e) => setConfirmEmail(e.target.value)}
                                        />
                                        <div className="akun-hapus-buttons">
                                            <button onClick={handleConfirmDelete}>{t.konfirmasiHapus}</button>
                                            <button onClick={() => setShowDeleteModal(false)}>{t.batalHapus}</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <footer className="akun-footer-edit">
                <img src={copyrightIcon} className="akun-footer-icon" />
                <p>{t.berandaHakCipta}</p>
            </footer>
        </div>
    );
};

export default Akun;