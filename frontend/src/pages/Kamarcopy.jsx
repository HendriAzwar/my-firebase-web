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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Kamar = () => {
    // ===== Pengaturan dark mode =====
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true'; 
    });
    useEffect(() => {
        document.body.className = darkMode ? 'kamar-dark-mode' : 'kamar-light-mode';
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);
    // ==============================

    // ===== Bahasa =====
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        setShowDropdown(false);
    };
    const t = translations[language];
    // ==============================

    // ===== Menu dropdown =====
    const dropdownRef = useRef(null);
    const globeRef = useRef(null);
    const otherMenuRef = useRef(null);
    const otherIconRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNavRightDropDown, setShowNavRightDropDown] = useState(false);

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
    // ===================================

    // ===== Sidebar =====
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
    // ==============================

    

    // ===== API Base URL =====
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_KAMAR;
    const [kamarData, setKamarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const fetchKamarData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/kamar`);
            if (!response.ok) {
                throw new Error('Failed to fetch room data');
            }
            const data = await response.json();
            setKamarData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching room data:', err);
            setError('Gagal memuat data kamar. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKamarData();
    }, []);
    // ==============================

    // ===== Tombol on/off kamar =====
    const [kamarPowerStatus, setKamarPowerStatus] = useState({});

    const togglePowerStatus = async (roomId) => {
        const kamar = kamarData.find(k => k.id === roomId);
        if (!kamar || kamar.status_penggunaan === "OVERLIMIT") {
            toast.error(`⚠️ Relay kamar ${roomId} dinonaktifkan karena melebihi batas penggunaan listrik.`);
            return;
        }

        const newStatus = !kamarPowerStatus[roomId]; // toggle

        setKamarPowerStatus((prevStatus) => ({
            ...prevStatus,
            [roomId]: newStatus,
        }));

        try {
            await fetch(`${API_BASE_URL}/kamar/${roomId}/relay`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                relay_status: newStatus ? "ON" : "OFF",
            }),
            });
        } catch (err) {
            console.error("Gagal update relay:", err);
        }
    };
    // ==============================

    // ===== Translate notifikasi =====
    const translateStatusPenggunaan = (status) => {
        if (!status) return null;
        switch (status.toUpperCase()) {
            case 'AMAN':
            return t.infoAman;
            case 'PERINGATAN':
            return t.infoPeringatan;
            case 'OVERLIMIT':
            return t.infoMelebihi;
            default:
            return status; // fallback, kalau belum diterjemahkan
        }
    };
    // ==============================

    // ===== Fungsi menampilkan notifikasi peringatan =====
    const showKamarNotifikasi = (kamar) => {
        if (!kamar) return;

        if (kamar.status_penggunaan === 'PERINGATAN') {
            toast.warn(`⚠️ Kamar ${kamar.id} hampir melebihi batas penggunaan listrik!`, {
            position: 'top-right',
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
        } else if (kamar.status_penggunaan === 'OVERLIMIT') {
            toast.error(`❌ Kamar ${kamar.id} telah melebihi batas penggunaan listrik!`, {
            position: 'top-right',
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
        }
    };
    // ==============================

    // ===== REGISTRASI KAMAR =====
    const [selectedKamarId, setSelectedKamarId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nomor_telepon_pengguna_kos: '',
        sisa_hari: 30,
        batas_kwh: ''
    });

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTombolGunakanKamar = (roomData) => {
        if (roomData.status_kamar === 0) {
            // Room is empty, show registration form
            setSelectedKamarId(roomData.id);
            setShowForm(true);
        }
    };

    const registerTenant = async (roomId, tenantData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/kamar/${roomId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tenantData),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Registration failed');
            }
            return result;
        } catch (err) {
            console.error('Error registering tenant:', err);
            throw err;
        }
    };

    const handleSubmitForm = async () => {
        // Validasi input
        if (!formData.nama_lengkap.trim() || !formData.nomor_telepon_pengguna_kos.trim()) {
            toast.error(t.namaDanNomorWajibKamar, { position: 'top-right', autoClose: 2000 });
            return;
        }
        // Submit data
        try {
            await registerTenant(selectedKamarId, formData);

            // Sync penggunaan_kwh setelah registrasi
            await fetch(`${API_BASE_URL}/kamar/${selectedKamarId}/sinkron-kwh`, {
                method: "POST",
            });

            toast.success(t.berhasilDaftarKamar, { position: 'top-right', autoClose: 1000 });
            // Bagian untuk menampilkan notif kedua (peringatan)
            setShowForm(false);
            setFormData({ nama_lengkap: '', nomor_telepon_pengguna_kos: '' });

            setTimeout(async () => {
                const response = await fetch(`${API_BASE_URL}/kamar`);
                if (!response.ok) throw new Error("Gagal fetch data");
                const data = await response.json();
                setKamarData(data);

                const updatedKamar = data.find(k => k.id === selectedKamarId);
                showKamarNotifikasi(updatedKamar);
            }, 300); 
        } catch (err) {
            toast.error(t.berhasilGagalKamar, { position: 'top-right', autoClose: 2000 });
        }
    };
    // ==============================

    // ===== EDIT DATA KAMAR =====
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedKamarData, setSelectedKamarData] = useState(null);
    const [showBiayaModal, setShowBiayaModal] = useState(false);
    const [estimasiBiaya, setEstimasiBiaya] = useState(0);
    const [tambahanKwh, setTambahanKwh] = useState(0);
    let submitReadyRef = useRef(false);
    const [editFormData, setEditFormData] = useState({
        nama_lengkap: '',
        nomor_telepon_pengguna_kos: '',
        batas_kwh: '',
        tambahan_kwh: ''
    });
    
    const handleEditFormInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleEditTenant = (roomData) => {
        setSelectedKamarId(roomData.id);
        setSelectedKamarData(roomData);
        setEditFormData({
            nama_lengkap: roomData.nama_lengkap,
            nomor_telepon_pengguna_kos: roomData.nomor_telepon_pengguna_kos,
            batas_kwh: roomData.batas_kwh || '',
            tambahan_kwh: ''
        });
        setShowEditForm(true);
    };
    
    const updateTenant = async (roomId, tenantData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/kamar/${roomId}/tenant`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tenantData),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Update failed');
            }
            return result;
        } catch (err) {
            console.error('Error updating tenant:', err);
            throw err;
        }
    };
    
    const submitTenantUpdate = async (batasBaru) => {
        try {
            await updateTenant(selectedKamarId, {
                nama_lengkap: editFormData.nama_lengkap,
                nomor_telepon_pengguna_kos: editFormData.nomor_telepon_pengguna_kos,
                batas_kwh: batasBaru
            });

            toast.success(t.berhasilEditKamar, { position: 'top-right', autoClose: 1500, closeButton: false, pauseOnHover: false });
            setSelectedKamarData(null);
            setShowEditForm(false);
            setEditFormData({ nama_lengkap: '', nomor_telepon_pengguna_kos: '', batas_kwh: '', tambahan_kwh: 0 });

            await fetch(`${API_BASE_URL}/kamar/${selectedKamarId}/sinkron-kwh`, { method: "POST" });

            setTimeout(async () => {
                const response = await fetch(`${API_BASE_URL}/kamar`);
                const data = await response.json();
                setKamarData(data);

                const updatedKamar = data.find(k => k.id === selectedKamarId);
                showKamarNotifikasi(updatedKamar);
            }, 300);
        } catch (err) {
            alert(err.message || 'Gagal mengupdate data. Silakan coba lagi.');
        }
    };
    
    const handleSubmitEditForm = async () => {
        if (!editFormData.nama_lengkap.trim() || !editFormData.nomor_telepon_pengguna_kos.trim()) {
            toast.error(t.namaDanNomorWajibKamar, { position: 'top-right', autoClose: 2000, closeButton: false, pauseOnHover: false });
            return;
        }

        const batasKwhLama = parseFloat(editFormData.batas_kwh || 0);
        const tambahan = parseFloat(editFormData.tambahan_kwh || 0);
        const batasBaru = batasKwhLama + tambahan;

        const tarif = 1445;
        const estimasi = tambahan * tarif;

        if (tambahan < 0) {
            toast.error("Tambahan kWh tidak boleh negatif");
            return;
        }

        if (tambahan > 0) {
            setEstimasiBiaya(estimasi);
            setTambahanKwh(tambahan);
            submitReadyRef.current = true;
            setShowBiayaModal(true);
            return;
        }

        await submitTenantUpdate(batasBaru);
    };
    
    useEffect(() => {
        if (showForm || showEditForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showForm, showEditForm]);
    // ==========================

    // ===== DELETE KAMAR =====
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const handleDeleteTenant = (roomId) => {
        setSelectedRoomId(roomId);
        setShowDeleteModal(true);
    };

    const deleteTenant = async (roomId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/kamar/${roomId}/tenant`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Delete failed');
            }
            return result;
        } catch (err) {
            console.error('Error deleting tenant:', err);
            throw err;
        }
    };
    
    const handleConfirmDeleteTenant = async () => {
        try {
            const result = await deleteTenant(selectedRoomId);
            console.log('Tenant deleted:', result);
            toast.success(t.berhasilHapusKamar, { position: 'top-right', autoClose: 1500 });
            setTimeout(() => {
                fetchKamarData();
                setShowDeleteModal(false);
                setSelectedRoomId(null);
            }, 2500);
        } catch (err) {
            toast.error(t.gagalHapusKamar, { position: 'top-right', autoClose: 2000 });
        }
    };
    // =====================================

    useEffect(() => {
        // Perbarui status relay berdasarkan data Firestore
        const updatedStatus = {};
        kamarData.forEach(kamar => {
            updatedStatus[kamar.id] = kamar.status_penggunaan !== 'OVERLIMIT';
        });
        setKamarPowerStatus(updatedStatus);
    }, [kamarData]);


    const convertFirebaseTimestamp = (timestamp) => {
        if (!timestamp) return null;
        
        // Jika timestamp adalah Firebase Timestamp object
        if (timestamp && typeof timestamp.toDate === 'function') {
            return timestamp.toDate();
        }
        
        // Jika timestamp adalah object dengan _seconds dan _nanoseconds
        if (timestamp && timestamp._seconds) {
            return new Date(timestamp._seconds * 1000);
        }
        
        // Fallback untuk format lain
        try {
            return new Date(timestamp);
        } catch (error) {
            console.error('Error converting timestamp:', error);
            return null;
        }
    };

    const getStatusColor = (status_penggunaan) => {
        if (status_penggunaan === 'OVERLIMIT') return 'red';
        if (status_penggunaan === 'PERINGATAN') return 'orange';
        return 'green';
    };


    // Update data kamar (Penyewa kost) - Edit dan Hapus
    const renderKamarItem = (roomData) => {
        let isPowerOn = kamarPowerStatus[roomData.id] !== false; // default true

        if (roomData.status_penggunaan === 'OVERLIMIT') {
            isPowerOn = false;
        }

        const buttonLabel = isPowerOn ? 'NYALA' : 'MATI';
        const buttonColor = isPowerOn ? '#27ae60' : '#C40000';

        return (
            <div key={roomData.id} className="kamar-item">
                <h3>{t.kamarKos} {roomData.id}</h3>
                <div className="kamar-list">
                    <div className="kamar-keterangan-isi">
                        <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-icon" />
                        <div className="kamar-info">
                            <p><strong>{roomData.nama_lengkap}</strong></p>
                            <p>{roomData.nomor_telepon_pengguna_kos}</p>
                            <p>{roomData.sisa_hari} {roomData.sisa_hari !== '-' ? t.hariPenggunakos : ''}</p>
                            <p>{roomData.penggunaan_kwh !== '-' && roomData.penggunaan_kwh !== undefined? `${Number(roomData.penggunaan_kwh).toFixed(2)} kWh`: ''}</p>
                            <p>{roomData.batas_kwh !== undefined && roomData.batas_kwh !== '-' ? `${t.batasKwhKamar}: ${roomData.batas_kwh} kWh` : ''}</p>
                            <p>{roomData.tanggal_masuk? `${t.awalDaftarKamar}: ${convertFirebaseTimestamp(roomData.tanggal_masuk)?.toLocaleDateString('id-ID') || 'Invalid Date'}`: ''}</p>
                        </div>
                    </div>
                    {/* Tombol tiap kamar */}
                    <div className="kamar-tombol-kamar">
                        {/* Tombol status on/off kamar */}
                        {roomData.status_penggunaan && (
                            <label 
                                className="kamar-status-label" 
                                style={{ color: getStatusColor(roomData.status_penggunaan) }}>
                                Status: {translateStatusPenggunaan(roomData.status_penggunaan)}
                            </label>
                        )}
                        <button
                            className="kamar-on-off"
                            style={{ backgroundColor: buttonColor }}
                            onClick={() => togglePowerStatus(roomData.id)}
                            disabled={roomData.status_penggunaan === 'OVERLIMIT'}
                        >
                            {buttonLabel === 'NYALA' ? t.tombolOnKontrol : t.tombolOffKontrol}
                        </button>
                        {/* Tombol gunakan kamar atau status "sedang digunakan" */}
                        <button
                            className={`kamar-status-gunakan ${roomData.status_kamar ? 'active' : 'inactive'}`}
                            onClick={() => handleTombolGunakanKamar(roomData)}
                            disabled={roomData.status_kamar === 1}
                        >
                            {roomData.status_kamar ? t.kamarSedangDigunakan : t.gunakanKamar}
                        </button>
                        {/* Tombol edit dan hapus setelah gunakan kamar */}
                        {roomData.status_kamar === 1 && (
                            <div className="kamar-tombol-edit-hapus">
                                <button
                                    className="kamar-tombol-edit"
                                    onClick={() => handleEditTenant(roomData)}
                                    title="Edit Data Penghuni"
                                >
                                    {t.editTombolKamar}
                                </button>
                                <button
                                    className="kamar-tombol-hapus"
                                    onClick={() => handleDeleteTenant(roomData.id)}
                                    title="Hapus Penghuni"
                                >
                                    {t.hapusTombolKamar}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="kamar-navbar-container">
                <div className="loading-container" style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh' 
                }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="kamar-navbar-container">
                <div className="error-container" style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    flexDirection: 'column'
                }}>
                    <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
                    <button onClick={fetchKamarData}>Coba Lagi</button>
                </div>
            </div>
        );
    }

    return (
        <div className="kamar-halaman">
            <ToastContainer />
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
                                <Link to="/kontak">{t.berandaKontak}</Link>
                                <Link to="/beranda">{t.berandaBeranda}</Link>
                                <Link to="/akun">{t.berandaAkun}</Link>
                            </div>
                        )}
                    </div>
                    {/* Ukuran Desktop */}
                    <div className="kamar-navbar-right-desktop">
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
                <Link to="/kamar" onClick={closeSidebar}>{t.berandaKamar}</Link>
                {/* <Link to="/kontrol" onClick={closeSidebar}>{t.berandaKontrol}</Link> */}
                <Link to="/grafik" onClick={closeSidebar}>{t.berandaGrafik}</Link>
            </div>
            <div className="kamar-main-content">
                <div className="kamar-feature-grid">
                    <div className="kamar-grid">
                        {kamarData.map(roomData => renderKamarItem(roomData))}
                    </div>
                </div>
            </div>

            {/* Daftar kamar */}
            {showForm && (
                <div className="kamar-daftar-overlay">
                    <div className="kamar-daftar-container">
                        <h2 className="kamar-daftar-title">Pendaftaran Kamar</h2>
                        <div className="kamar-daftar-content">
                            <div className="kamar-daftar-left">
                                <h3>{t.kamar} {selectedKamarId}</h3>
                                <div className="kamar-daftar-icon">
                                    <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-daftar-icon-kamar" />
                                </div>
                            </div>
                            <div className="kamar-daftar-right">
                                <label className="kamar-daftar-labelnama">{t.namaLengkap}</label>
                                <input 
                                    type="text" 
                                    name="nama_lengkap"
                                    className="kamar-daftar-inputnama" 
                                    placeholder={t.placeholderNamalengkap}
                                    value={formData.nama_lengkap}
                                    onChange={handleFormInputChange}
                                    required
                                />
                                <label className="kamar-daftar-labelnomor">{t.nomorTelepon}</label>
                                <input 
                                    type="text" 
                                    name="nomor_telepon_pengguna_kos"
                                    className="kamar-daftar-inputnomor" 
                                    placeholder={t.placeholderNomorTelepon}
                                    value={formData.nomor_telepon_pengguna_kos}
                                    onChange={handleFormInputChange}
                                    required
                                />
                                <label className="kamar-daftar-labelbatas">{t.labelBatasKwh}</label>
                                <input 
                                    type="number" 
                                    name="batas_kwh"
                                    className="kamar-daftar-inputbatas" 
                                    placeholder={t.placeholderBatasKwh}
                                    value={formData.batas_kwh}
                                    onChange={handleFormInputChange}
                                    required
                                />
                                <label className="kamar-daftar-labelsisa">{t.labelSisaHari}</label>
                                <input 
                                    type="number" 
                                    name="sisa_hari"
                                    className="kamar-daftar-inputsisa" 
                                    placeholder={t.placeholderSisaHari}
                                    value={formData.sisa_hari}
                                    onChange={handleFormInputChange}
                                    required
                                />
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

            {/* Edit Kamar */}
            {showEditForm && (
                <div className="kamar-daftar-overlay">
                    <div className="kamar-daftar-container">
                        <h2 className="kamar-daftar-title">{t.editJudul}</h2>
                        <div className="kamar-daftar-content">
                            <div className="kamar-daftar-left">
                                <h3>{t.kamar} {selectedKamarId}</h3>
                                <div className="kamar-daftar-icon">
                                    <img src={kamarKosIcon} alt="Kamar Icon" className="kamar-daftar-icon-kamar" />
                                </div>
                                {selectedKamarData && (
                                    <div className="kamar-data-sedang-digunakan">
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>{t.labelSisaHari}</td>
                                                <td>: {selectedKamarData.sisa_hari}</td>
                                            </tr>
                                            <tr>
                                                <td>{t.editPenggunaan}</td>
                                                <td>: {selectedKamarData.penggunaan_kwh} kWh</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="kamar-daftar-right">
                                <label className="kamar-daftar-labelnama">{t.namaLengkap}</label>
                                <input 
                                    type="text" 
                                    name="nama_lengkap"
                                    className="kamar-daftar-inputnama" 
                                    placeholder={t.placeholderNamalengkap}
                                    value={editFormData.nama_lengkap}
                                    onChange={handleEditFormInputChange}
                                />
                                <label className="kamar-daftar-labelnomor">{t.nomorTelepon}</label>
                                <input 
                                    type="text" 
                                    name="nomor_telepon_pengguna_kos"
                                    className="kamar-daftar-inputnomor" 
                                    placeholder={t.placeholderNomorTelepon}
                                    value={editFormData.nomor_telepon_pengguna_kos}
                                    onChange={handleEditFormInputChange}
                                />
                                <label className="kamar-daftar-labelbatas">{t.labelBatasKwh}</label>
                                <input 
                                    type="number" 
                                    name="batas_kwh"
                                    className="kamar-daftar-inputbatas" 
                                    placeholder={t.placeholderBatasKwh}
                                    value={editFormData.batas_kwh}
                                    onChange={handleEditFormInputChange}
                                />
                                {selectedKamarData?.status_penggunaan === 'OVERLIMIT' && (
                                <>
                                    <label className="kamar-daftar-labeltambahan">{t.labelTambahanKwh}</label>
                                    <input 
                                        type="number" 
                                        name="tambahan_kwh"
                                        className="kamar-daftar-inputtambahan" 
                                        placeholder="Masukkan tambahan kWh"
                                        value={editFormData.tambahan_kwh}
                                        onChange={(e) =>
                                            setEditFormData(prev => ({
                                                ...prev,
                                                tambahan_kwh: parseFloat(e.target.value),
                                            }))
                                        }
                                    />
                                    <label>{t.editBiayaTambahan}: Rp {(editFormData.tambahan_kwh * 1445).toLocaleString()}</label>
                                </>
                                )}

                                <button className="kamar-daftar-button-kamar" onClick={handleSubmitEditForm}>
                                    {t.editTombolPerbarui}
                                </button>
                                <button className="kamar-daftar-button-tutup" onClick={() => setShowEditForm(false)}>
                                    {t.tombolPembatalan}
                                </button>
                            </div>
                        </div>
                        <p>{t.editInfo}</p>
                    </div>
                </div>
            )}

            {/* Konfirmasi Penambahan Biaya */}
            {showBiayaModal && (
                <div className="kamar-hapus-overlay">
                    <div className="kamar-hapus-box">
                        <p>{t.konfirmasiTambahKwh1} {tambahanKwh} {t.konfirmasiTambahKwh2} <strong>Rp {estimasiBiaya.toLocaleString()}</strong>. {t.konfirmasiTambahKwh3}</p>
                        <div className="kamar-hapus-buttons">
                            <button
                                onClick={async () => {
                                    setShowBiayaModal(false);
                                    await submitTenantUpdate(parseFloat(editFormData.batas_kwh || 0) + tambahanKwh);
                                }}
                            >
                                {t.ya}
                            </button>
                            <button onClick={() => setShowBiayaModal(false)}>{t.tidak}</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Hapus kamar */}
            {showDeleteModal && (
                <div className="kamar-hapus-overlay">
                    <div className="kamar-hapus-box">
                        <p>{t.konfirmasiHapusKamar} {selectedRoomId}?</p>
                        <div className="kamar-hapus-buttons">
                            <button onClick={handleConfirmDeleteTenant}>{t.ya}</button>
                            <button onClick={() => setShowDeleteModal(false)}>{t.tidak}</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="kamar-footer-edit">
                <img src={copyrightIcon} className="kamar-footer-icon" />
                <p>{t.berandaHakCipta}</p>
            </footer>
        </div>
    );
};

export default Kamar;