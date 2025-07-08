import { useState, useEffect, useRef } from 'react';
import './Grafik.css'; 
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const Grafik = () => {
    // State untuk grafik MCB1
    const [data_mcb1, setDataMCB1] = useState([]);
    const [selected_mcb1, setSelectedMCB1] = useState("harian");
    const [xKey_mcb1, setXKeyMCB1] = useState("hari_ke");
    const [loading, setLoading] = useState(false);

    const [selectedLines, setSelectedLines] = useState(["kamar1", "kamar2", "kamar3"]);

    // Untuk filter per kamar (keterangan bagian bawah)
    const handleLegendClick = (dataKey) => {
        setSelectedLines((prev) =>
            prev.length === 1 && prev[0] === dataKey
                ? ["kamar1", "kamar2", "kamar3"] 
                : [dataKey] 
        );
    };

    const [summaryData, setSummaryData] = useState(null);


    // ===== STATE UNTUK FILTER HARIAN DENGAN KALENDER =====
    const [dailyFilter_mcb1, setDailyFilter_mcb1] = useState('default'); // 'default', 'calendar'
    const [startDate_mcb1, setStartDate_mcb1] = useState('');
    const [endDate_mcb1, setEndDate_mcb1] = useState('');
    

    // ===== STATE UNTUK FILTER BULANAN =====
    const [monthlyYear_mcb1, setMonthlyYear] = useState(new Date().getFullYear());
    const [selectedMonthStart, setSelectedMonthStart] = useState(1);
    const [selectedMonthEnd, setSelectedMonthEnd] = useState(12);
    const [monthlyType_mcb1, setMonthlyType_mcb1] = useState('all'); // 'all', 'range'


    // Helper function untuk format tanggal
    const formatDateForAPI = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    };

    // Helper function untuk mendapatkan tanggal hari ini
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Helper function untuk mendapatkan tanggal seminggu lalu
    const getWeekAgoDate = () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo.toISOString().split('T')[0];
    };



    // Tombol Garis 3 Sidebar Left
    const toggleSidebar = () => {
        const sidebar = document.getElementById("grafik-sidebar");
        if (sidebar) {
            sidebar.classList.toggle("grafik-open-sidebar");
        }
    };
    const closeSidebar = () => {
        const sidebar = document.getElementById("grafik-sidebar");
        if (sidebar) {
            sidebar.classList.remove("grafik-open-sidebar");
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById("grafik-sidebar");
            const hamburger = document.querySelector(".grafik-hamburger");

            if (
                sidebar &&
                !sidebar.contains(event.target) &&
                hamburger &&
                !hamburger.contains(event.target)
            ) {
                sidebar.classList.remove("grafik-open-sidebar");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Menu Navbar Lainnya: Kontak, Akun, dan Beranda (Three Dots)
    const otherMenuThreeDots = useRef(null);
    const otherIconThreeDots = useRef(null);
    const [showOtherMenuThreeDots, setShowOtherMenuThreeDots] = useState(false);
    
    // Bahasa
    const globeLanguage = useRef(null);
    const dropdownLanguage = useRef(null);
    const [showDropdownLanguage, setShowDropdownLanguage] = useState(false);
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const t = translations[language];
    
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        setShowDropdownLanguage(false);
    };

    // Darkmode dan LightMode
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true';
    });
    
    useEffect(() => {
        document.body.className = darkMode ? 'grafik-dark-mode' : 'grafik-light-mode';
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Fitur ubah bahasa dan menu lainnya: kontak, beranda, dan akun (Three Dots)
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
                setShowOtherMenuThreeDots(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideDropdown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDropdown);
        };
    }, []);


    // ===== useEffect FILTER HARIAN, MINGGUAN, DAN BULANAN =====
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/api/grafik/${selected_mcb1}`;

                // Parameter untuk filter harian
                if (selected_mcb1 === "harian") {
                    const params = new URLSearchParams();

                    if (dailyFilter_mcb1 === "calendar") {
                        params.append("dailyFilter", "calendar");

                        if (startDate_mcb1) {
                            params.append("startDate", formatDateForAPI(startDate_mcb1));
                        }
                        if (endDate_mcb1) {
                            params.append("endDate", formatDateForAPI(endDate_mcb1));
                        }
                    }

                    if (params.toString()) {
                        url += `?${params.toString()}`;
                    }
                }

                // Parameter untuk filter bulanan
                if (selected_mcb1 === "bulanan") {
                    const params = new URLSearchParams();
                    
                    if (monthlyType_mcb1 === 'specific') {
                        params.append('year', monthlyYear_mcb1);
                    } else if (monthlyType_mcb1 === 'range') {
                        params.append('startMonth', selectedMonthStart);
                        params.append('endMonth', selectedMonthEnd);
                    }
                    
                    url += `?${params.toString()}`;
                }
                
                console.log("Fetching URL:", url); // Debug log
                
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const json = await res.json();

                console.log("Received data:", json); // Debug log

                // Handle response berdasarkan struktur backend
                if (selected_mcb1 === "harian" && dailyFilter_mcb1 === "calendar") {
                // Untuk calendar filter, backend mengembalikan { data: [...], summary: {...} }
                if (json.data) {
                    const orderedData = [...json.data].sort(
                    (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
                    );
                    setDataMCB1(orderedData);
                    setSummaryData(json.summary);
                } else {
                    setDataMCB1([]);
                    setSummaryData(null);
                }
                } else {
                // Untuk mode default dan filter lainnya
                setDataMCB1(Array.isArray(json) ? json : []);
                setSummaryData(null);
                }
            } catch (err) {
                console.error("Gagal mengambil data grafik:", err);
                setDataMCB1([]);
                setSummaryData(null);
            } finally {
                setLoading(false);
            }
            };

            fetchData();

    }, [
        selected_mcb1, 
        // Dependencies untuk bulanan
        monthlyYear_mcb1, selectedMonthStart, selectedMonthEnd, monthlyType_mcb1,
        // Dependencies untuk harian dengan kalender
        dailyFilter_mcb1, startDate_mcb1, endDate_mcb1
    ]);


    useEffect(() => {
        if (selected_mcb1 === "harian") {
            setXKeyMCB1(dailyFilter_mcb1 === "calendar" ? "tanggal" : "hari_ke");
        } else if (selected_mcb1 === "bulanan") {
            setXKeyMCB1("bulan");
        }
    }, [selected_mcb1, dailyFilter_mcb1]);



    // NILAI HARI
    const days = [
        { value: 1, label: 'Senin' },
        { value: 2, label: 'Selasa' },
        { value: 3, label: 'Rabu' },
        { value: 4, label: 'Kamis' },
        { value: 5, label: 'Jumat' },
        { value: 6, label: 'Sabtu' },
        { value: 7, label: 'Minggu' }
    ];

    // NILAI BULAN
    const months = [
            { value: 1, label: 'Januari' },
            { value: 2, label: 'Februari' },
            { value: 3, label: 'Maret' },
            { value: 4, label: 'April' },
            { value: 5, label: 'Mei' },
            { value: 6, label: 'Juni' },
            { value: 7, label: 'Juli' },
            { value: 8, label: 'Agustus' },
            { value: 9, label: 'September' },
            { value: 10, label: 'Oktober' },
            { value: 11, label: 'November' },
            { value: 12, label: 'Desember' }
    ];
    


    // ===== KOMPONEN DailyFilters dengan Kalender =====
    const DailyFilters = () => {
        return (
        <div
            className="daily-filters"
            style={{
            marginBottom: "30px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            backgroundColor: darkMode ? "#2a2a2a" : "#f9f9f9",
            }}
        >
            <div
            style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
                flexWrap: "wrap",
            }}
            >
            {/* Filter Jenis Harian */}
            <div>
                <label
                style={{
                    marginRight: "5px",
                    fontWeight: "bold",
                    color: darkMode ? "#fff" : "#000",
                }}
                >
                Filter:
                </label>
                <select
                value={dailyFilter_mcb1}
                onChange={(e) => {
                    setDailyFilter_mcb1(e.target.value);
                    // Reset tanggal ketika berganti mode
                    if (e.target.value === "calendar") {
                    setStartDate_mcb1(getWeekAgoDate());
                    setEndDate_mcb1(getTodayDate());
                    } else {
                    setStartDate_mcb1("");
                    setEndDate_mcb1("");
                    }
                }}
                style={{
                    padding: "3px 3px",
                    borderRadius: "6px",
                    marginRight: "-5px",
                    border: "1px solid #ccc",
                    backgroundColor: darkMode ? "#3a3a3a" : "#fff",
                    color: darkMode ? "#fff" : "#000",
                }}
                >
                <option value="default">Harian Default</option>
                <option value="calendar">Filter Kalender</option>
                </select>
            </div>

            {/* Filter Kalender */}
            {dailyFilter_mcb1 === "calendar" && (
                <>
                {/* Tanggal Mulai */}
                <div>
                    <label
                    style={{
                        marginRight: "5px",
                        fontWeight: "bold",
                        color: darkMode ? "#fff" : "#000",
                    }}
                    >
                    Dari Tanggal:
                    </label>
                    <input
                    type="date"
                    value={startDate_mcb1}
                    onChange={(e) => setStartDate_mcb1(e.target.value)}
                    style={{
                        padding: "3px 3px",
                        borderRadius: "6px",
                        marginRight: "-5px",
                        border: "1px solid #ccc",
                        backgroundColor: darkMode ? "#3a3a3a" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                    }}
                    />
                </div>

                {/* Tanggal Akhir */}
                <div>
                    <label
                    style={{
                        marginRight: "8px",
                        fontWeight: "bold",
                        color: darkMode ? "#fff" : "#000",
                    }}
                    >
                    Sampai Tanggal:
                    </label>
                    <input
                    type="date"
                    value={endDate_mcb1}
                    onChange={(e) => setEndDate_mcb1(e.target.value)}
                    min={startDate_mcb1} // Tidak bisa pilih tanggal sebelum start date
                    style={{
                        padding: "3px 3px",
                        borderRadius: "6px",
                        marginRight: "15px",
                        border: "1px solid #ccc",
                        backgroundColor: darkMode ? "#3a3a3a" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                    }}
                    />
                </div>

                {/* Tombol Quick Select */}
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    <button
                    onClick={() => {
                        setStartDate_mcb1(getTodayDate());
                        setEndDate_mcb1(getTodayDate());
                    }}
                    style={{
                        padding: "3px 3px",
                        borderRadius: "6px",
                        border: "1px solid #28a745",
                        backgroundColor: "#28a745",
                        color: "white",
                        cursor: "pointer",
                        width: "fit-content",
                        marginTop: '0px',
                        fontSize: "11px",
                    }}
                    >
                    Hari Ini
                    </button>
                    <button
                    onClick={() => {
                        setStartDate_mcb1(getWeekAgoDate());
                        setEndDate_mcb1(getTodayDate());
                    }}
                    style={{
                        padding: "3px 3px",
                        borderRadius: "6px",
                        border: "1px solid #17a2b8",
                        backgroundColor: "#17a2b8",
                        color: "white",
                        cursor: "pointer",
                        width: "fit-content",
                        marginTop: '0px',
                        fontSize: "11px",
                    }}
                    >
                    7 Hari Terakhir
                    </button>
                    <button
                    onClick={() => {
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        setStartDate_mcb1(
                        thirtyDaysAgo.toISOString().split("T")[0]
                        );
                        setEndDate_mcb1(getTodayDate());
                    }}
                    style={{
                        padding: "3px 3px",
                        borderRadius: "6px",
                        border: "1px solid #6f42c1",
                        backgroundColor: "#6f42c1",
                        color: "white",
                        cursor: "pointer",
                        width: "fit-content",
                        marginTop: '0px',
                        marginRight: '15px',
                        fontSize: "11px",
                    }}
                    >
                    30 Hari Terakhir
                    </button>
                </div>
                </>
            )}

            {/* Tombol Reset */}
            <button
                onClick={() => {
                setDailyFilter_mcb1("default");
                setStartDate_mcb1("");
                setEndDate_mcb1("");
                }}
                style={{
                    padding: '5px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid #007bff',
                    backgroundColor: '#007bff',
                    color: 'white',
                    cursor: 'pointer',
                    marginTop: '0px',
                    fontSize: '12px',
                    width: 'fit-content'
                }}
            >
                Reset
            </button>
            </div>
        </div>
        );
    };

    // ===== KOMPONEN MonthlyFilters =====
    const MonthlyFilters = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear - 3; year <= currentYear + 1; year++) {
            years.push(year);
        }

        return (
            <div className="monthly-filters" style={{ 
                marginBottom: '15px', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '10px',
                backgroundColor: darkMode ? '#2a2a2a' : '#f9f9f9'
            }}>
                <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    alignItems: 'center', 
                    flexWrap: 'wrap' 
                }}>

                    {/* Filter Jenis Bulan */}
                    <div>
                        <label style={{ 
                            marginRight: '4px', 
                            fontWeight: 'bold',
                            color: darkMode ? '#fff' : '#000'
                        }}>
                            Filter:
                        </label>
                        <select 
                            value={monthlyType_mcb1} 
                            onChange={(e) => setMonthlyType_mcb1(e.target.value)}
                            style={{ 
                                padding: '3px 3px', 
                                borderRadius: '6px', 
                                marginRight: '-5px',
                                border: '1px solid #ccc',
                                backgroundColor: darkMode ? '#3a3a3a' : '#fff',
                                color: darkMode ? '#fff' : '#000'
                            }}
                        >
                            <option value="all">Semua Bulan</option>
                            <option value="range">Rentang Bulan</option>
                        </select>
                    </div>


                    {/* Filter Tahun */}
                    <div>
                        <label style={{ 
                            marginRight: '4px', 
                            fontWeight: 'bold',
                            color: darkMode ? '#fff' : '#000'
                        }}>
                            Tahun:
                        </label>
                        <select 
                            value={monthlyYear_mcb1} 
                            onChange={(e) => setMonthlyYear(parseInt(e.target.value))}
                            style={{ 
                                padding: '3px 3px', 
                                borderRadius: '6px', 
                                marginRight: '-5px',
                                border: '1px solid #ccc',
                                backgroundColor: darkMode ? '#3a3a3a' : '#fff',
                                color: darkMode ? '#fff' : '#000'
                            }}
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                

                    {/* Filter Rentang Bulan */}
                    {monthlyType_mcb1 === 'range' && (
                        <>
                            <div>
                                <label style={{ 
                                    marginRight: '4px', 
                                    fontWeight: 'bold',
                                    color: darkMode ? '#fff' : '#000'
                                }}>
                                    Dari:
                                </label>
                                <select 
                                    value={selectedMonthStart} 
                                    onChange={(e) => setSelectedMonthStart(parseInt(e.target.value))}
                                    style={{ 
                                        padding: '3px 3px', 
                                        borderRadius: '6px', 
                                        marginRight: '-5px',
                                        border: '1px solid #ccc',
                                        backgroundColor: darkMode ? '#3a3a3a' : '#fff',
                                        color: darkMode ? '#fff' : '#000'
                                    }}
                                >
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ 
                                    marginRight: '4px', 
                                    fontWeight: 'bold',
                                    color: darkMode ? '#fff' : '#000'
                                }}>
                                    Sampai:
                                </label>
                                <select 
                                    value={selectedMonthEnd} 
                                    onChange={(e) => setSelectedMonthEnd(parseInt(e.target.value))}
                                    style={{ 
                                        padding: '3px 3px', 
                                        borderRadius: '6px', 
                                        marginRight: '-5px',
                                        border: '1px solid #ccc',
                                        backgroundColor: darkMode ? '#3a3a3a' : '#fff',
                                        color: darkMode ? '#fff' : '#000'
                                    }}
                                >
                                    {months.filter(m => m.value >= selectedMonthStart).map(month => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* Tombol Reset */}
                    <button 
                        onClick={() => {
                            setMonthlyType_mcb1('all');
                            setMonthlyYear(new Date().getFullYear());
                            setSelectedMonthStart(1);
                            setSelectedMonthEnd(12);
                        }}
                        style={{ 
                            padding: '5px 12px', 
                            borderRadius: '8px', 
                            border: '1px solid #007bff',
                            backgroundColor: '#007bff',
                            color: 'white',
                            cursor: 'pointer',
                            marginTop: '0px',
                            fontSize: '12px',
                            width: 'fit-content'
                        }}
                    >
                        Reset
                    </button>
                </div>

                {/* Display Info Filter Aktif */}
                {monthlyType_mcb1 !== 'all' && (
                    <div style={{ 
                        marginTop: '10px', 
                        padding: '8px', 
                        backgroundColor: darkMode ? '#3a3a3a' : '#e9ecef', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: darkMode ? '#ccc' : '#666',
                        width: 'fit-content'
                    }}>
                        <strong>Filter Aktif:</strong> {monthlyYear_mcb1}
                        {monthlyType_mcb1 === 'range' && `, ${months.find(m => m.value === selectedMonthStart)?.label} - ${months.find(m => m.value === selectedMonthEnd)?.label}`}
                    </div>
                )}
            </div>
        );
    };
    

    // ===== UPDATE CUSTOM TOOLTIP =====
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border rounded shadow-lg">
            <p className="font-semibold">
                {selected_mcb1 === "harian" && dailyFilter_mcb1 === "calendar"
                ? new Date(label).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })
                : `${label}`}
            </p>
            {payload.map((entry, index) => (
                <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${entry.value} kWh`}
                </p>
            ))}
            </div>
        );
        }
        return null;
    };

    // Fungsi untuk format tanggal di X-axis
    const formatXAxisLabel = (value) => {
        if (selected_mcb1 === "harian" && dailyFilter_mcb1 === "calendar") {
        // Format tanggal untuk tampilan yang lebih singkat
        const date = new Date(value);
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
        });
        } 
        return value;
    };


    // ===== KOMPONEN SUMMARY DISPLAY =====
    const SummaryDisplay = ({ summary }) => {
        if (!summaryData) return null;

        return (
        <div
            style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            backgroundColor: darkMode ? "#2a2a2a" : "#f9f9f9",
            }}
        >
            <h4
            style={{
                margin: "0 0 15px 0",
                color: darkMode ? "#fff" : "#000",
                borderBottom: "1px solid #007bff",
                paddingBottom: "8px",
            }}
            >
            📊 Ringkasan Total Konsumsi
            </h4>
            
            <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
            }}
            >
            {/* Periode */}
            <div
                style={{
                padding: "10px",
                backgroundColor: darkMode ? "#3a3a3a" : "#e9ecef",
                borderRadius: "8px",
                }}
            >
                <div
                style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: darkMode ? "#ccc" : "#666",
                    marginBottom: "5px",
                }}
                >
                📅 PERIODE
                </div>
                <div style={{ color: darkMode ? "#fff" : "#000", fontSize: "13px" }}>
                {summaryData.tanggal_mulai && summaryData.tanggal_akhir ? (
                    <>
                    {new Date(summaryData.tanggal_mulai).toLocaleDateString("id-ID")} -{" "}
        //             {new Date(summaryData.tanggal_akhir).toLocaleDateString("id-ID")}
                    <br />
                    <small>({summaryData.jumlah_hari} hari)</small>
                    </>
                ) : (
                    "Tidak tersedia"
                )}
                </div>
            </div>

            {/* Kamar 1 */}
            <div
                style={{
                padding: "10px",
                backgroundColor: darkMode ? "#3a3a3a" : "#e9ecef",
                borderRadius: "8px",
                }}
            >
                <div
                style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "blue",
                    marginBottom: "5px",
                }}
                >
                🔵 KAMAR 1
                </div>
                <div style={{ color: darkMode ? "#fff" : "#000", fontSize: "16px", fontWeight: "bold" }}>
                {(summaryData.kamar1_total ?? 0).toFixed(2)} kWh
                  <br />
                    <span style={{ fontSize: '12px', color: '#888' }}>
                        Rp {(summaryData.tarif_kamar1 ?? 0).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Kamar 2 */}
            <div
                style={{
                padding: "10px",
                backgroundColor: darkMode ? "#3a3a3a" : "#e9ecef",
                borderRadius: "8px",
                }}
            >
                <div
                style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "red",
                    marginBottom: "5px",
                }}
                >
                🔴 KAMAR 2
                </div>
                <div style={{ color: darkMode ? "#fff" : "#000", fontSize: "16px", fontWeight: "bold" }}>
                {(summaryData.kamar2_total ?? 0).toFixed(2)} kWh
                  <br />
                    <span style={{ fontSize: '12px', color: '#888' }}>
                        Rp {(summaryData.tarif_kamar2 ?? 0).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Kamar 3 */}
            <div
                style={{
                padding: "10px",
                backgroundColor: darkMode ? "#3a3a3a" : "#e9ecef",
                borderRadius: "8px",
                }}
            >
                <div
                style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "green",
                    marginBottom: "5px",
                }}
                >
                🟢 KAMAR 3
                </div>
                <div style={{ color: darkMode ? "#fff" : "#000", fontSize: "16px", fontWeight: "bold" }}>
                {(summaryData.kamar3_total ?? 0).toFixed(2)} kWh
                  <br />
                    <span style={{ fontSize: '12px', color: '#888' }}>
                        Rp {(summaryData.tarif_kamar3 ?? 0).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Total Keseluruhan */}
            <div
                style={{
                padding: "10px",
                backgroundColor: "#007bff",
                borderRadius: "8px",
                color: "white",
                }}
            >
                <div
                style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                }}
                >
                ⚡ TOTAL KESELURUHAN
                </div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                {(summaryData.total_keseluruhan ?? 0).toFixed(2)} kWh
                  <br />
                    <span style={{ fontSize: '12px', fontWeight: "bold" }}>
                        Rp {(summaryData.tarif_total ?? 0).toLocaleString()}
                    </span>
                </div>
            </div>
            </div>
        </div>
        );
    };



    return (
        <div className="grafik-navbar-container">
            {/* Navbar */}
            <div className="grafik-navbar">
                {/* Navbar kiri */}
                <div className="grafik-navbar-left">
                    <button className="grafik-hamburger" onClick={toggleSidebar}>
                        <img src={hamburgerIcon} alt="Menu Sidebar" />
                    </button>
                    <img src={logo} alt="Logo" className="grafik-logo-web" />
                    <a>Senergy</a>
                </div>
                {/* Navbar kanan */}
                <div className="grafik-navbar-right">
                    {/* Ukuran HandPhone */}
                    <div className="grafik-navbar-other-dropdown">
                        <img
                            ref={otherIconThreeDots}
                            src={tripledotIcon}
                            alt="Menu"
                            className="grafik-other-icon"
                            onClick={() => setShowOtherMenuThreeDots(!showOtherMenuThreeDots)}
                        />
                        {showOtherMenuThreeDots && (
                            <div className="grafik-navbar-other-dropdown-menu" ref={otherMenuThreeDots}>
                                <Link to="/kontak">{t.berandaKontak}</Link>
                                <Link to="/beranda">{t.berandaBeranda}</Link>
                                <Link to="/akun">{t.berandaAkun}</Link>
                            </div>
                        )}
                    </div>
                    {/* Ukuran Desktop */}
                    <div className="grafik-navbar-right-desktop">
                        <Link to="/kontak">{t.berandaKontak}</Link>
                        <Link to="/beranda">{t.berandaBeranda}</Link>
                        <Link to="/akun">{t.berandaAkun}</Link>
                    </div>
                    {/* Garis tegak navbar */}
                    <div className="grafik-garis"></div>
                    {/* Notifikasi */}
                    <img src={notificationIcon} alt="Notifikasi" className="grafik-notifikasi-icon" />
                    {/* Ubah bahasa */}
                    <div className="grafik-language-switch">
                        <img
                            ref={globeLanguage}
                            src={globeIcon}
                            alt="Pilih Bahasa"
                            className="grafik-globe-icon"
                            onClick={() => setShowDropdownLanguage(!showDropdownLanguage)}
                        />
                        {showDropdownLanguage && (
                            <div className="grafik-dropdown-language" ref={dropdownLanguage}>
                                <div onClick={() => handleLanguageChange('id')}>Indonesian</div>
                                <div onClick={() => handleLanguageChange('en')}>English</div>
                            </div>
                        )}
                    </div>
                    {/* Darkmode dan Lightmode */}
                    <button 
                        className={"grafik-mode-toggle " + (darkMode ? "grafik-dark" : "grafik-light")}
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <img src={darkModeIcon} alt="Dark Mode" className="grafik-mode-icon" />
                        ) : (
                            <img src={lightModeIcon} alt="Light Mode" className="grafik-mode-icon" />
                        )}
                    </button>
                </div>
            </div>
            
            {/* Sidebar (Bar Kiri) */}
            <div className="grafik-sidebar" id="grafik-sidebar">
                <Link to="/kamar" onClick={closeSidebar}>{t.berandaKamar}</Link>
                {/* <Link to="/kontrol" onClick={closeSidebar}>{t.berandaKontrol}</Link> */}
                <Link to="/grafik" onClick={closeSidebar}>{t.berandaGrafik}</Link>
            </div>
            
            {/* Isi website */}
            <div className="grafik-main-content">
                <div className="grafik-feature-grid">
                    {/* ------Grafik dan Tabel MCB 1------ */}
                    <div className="grafik">
                        <h3>{t.hasilLaporan}</h3>
                        <div className="grafik-header">
                            <h1>MCB 1</h1>
                            {/* Filter grafik mcb 1 */}
                            <div className="grafik-filter-buttons">
                                <button
                                onClick={() => setSelectedMCB1("harian")}
                                style={{
                                    marginRight: "10px",
                                    backgroundColor:
                                    selected_mcb1 === "harian" ? "#007bff" : "",
                                    color: selected_mcb1 === "harian" ? "white" : "",
                                }}
                                >
                                Harian
                                </button>
                                <button
                                onClick={() => setSelectedMCB1("bulanan")}
                                style={{
                                    backgroundColor:
                                    selected_mcb1 === "bulanan" ? "#007bff" : "",
                                    color: selected_mcb1 === "bulanan" ? "white" : "",
                                }}
                                >
                                Bulanan
                                </button>
                            </div>
                        </div>

                        {selected_mcb1 === "harian" && <DailyFilters />} 

                        {/* Tampilkan summary jika ada */}
                        
                        {selected_mcb1 === "bulanan" && <MonthlyFilters />}

                        {/* Loading indicator */}
                        {loading && (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p>Memuat data grafik...</p>
                            </div>
                        )}
                        
                        {/* grafik mcb 1 */}
                        {!loading && data_mcb1.length > 0 && (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                            data={data_mcb1}
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: darkMode ? "20px" : "0px",
                                padding: darkMode ? "20px 0px 0px 0px" : "0",
                            }}
                            animationDuration={800}
                            animationEasing="ease-out"
                            key={selected_mcb1}
                            >
                            <CartesianGrid strokeDasharray="0" stroke="#BEBEBE" />
                            <XAxis
                                dataKey={xKey_mcb1}
                                tick={{
                                fontSize: "11px",
                                fontFamily: "Arial, sans-serif",
                                }}
                                tickFormatter={formatXAxisLabel}
                                animationDuration={600}
                                angle={
                                selected_mcb1 === "harian" &&
                                dailyFilter_mcb1 === "calendar"
                                    ? -45
                                    : 0
                                }
                                textAnchor={
                                selected_mcb1 === "harian" &&
                                dailyFilter_mcb1 === "calendar"
                                    ? "end"
                                    : "middle"
                                }
                                height={
                                selected_mcb1 === "harian" &&
                                dailyFilter_mcb1 === "calendar"
                                    ? 60
                                    : 30
                                }
                            />
                            <YAxis
                                domain={
                                selected_mcb1 === "harian"
                                    ? [0, 10] : [0, 100]
                                }
                                tickCount={
                                selected_mcb1 === "harian"
                                    ? 5 : 7
                                }
                                label={{
                                value: "kWh",
                                angle: -90,
                                position: "insideLeft",
                                style: {
                                    fontWeight: "bold",
                                    fill: "#000000",
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "15px",
                                },
                                }}
                                tick={{
                                fontSize: "13px",
                                fontFamily: "Arial, sans-serif",
                                }}
                                animationDuration={600}
                            />
                            <Tooltip content={<CustomTooltip />} />


                                    <Legend
                                        content={({ payload }) => (
                                        <div
                                            style={{ display: "flex", gap: 20, paddingLeft: 45 }}
                                        >
                                            {payload.map((entry) => (
                                            <span
                                                key={entry.dataKey}
                                                onClick={() => handleLegendClick(entry.dataKey)}
                                                style={{
                                                cursor: "pointer",
                                                color: selectedLines.includes(entry.dataKey)
                                                    ? entry.color
                                                    : "#ccc",
                                                fontWeight: selectedLines.includes(entry.dataKey)
                                                    ? "bold"
                                                    : "normal",
                                                }}
                                            >
                                                ● {entry.value}
                                            </span>
                                            ))}
                                        </div>
                                        )}
                                    />

                                    {/* Garis grafik */}
                                    {selectedLines.includes("kamar1") && ( 
                                    <Line 
                                        type="monotone" 
                                        dataKey="kamar1" 
                                        stroke="blue" 
                                        name={t.kamar1 || "Kamar 1"} 
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        // PENGATURAN ANIMASI GARIS - Untuk transisi mulus
                                        animationDuration={1000}
                                        animationEasing="ease-in-out"
                                        // connectNulls untuk menghubungkan titik meskipun ada nilai null
                                        connectNulls={true}
                                        // strokeOpacity={selectedLines.includes("kamar1") ? 1 : 0}
                                    />
                                    )}
                                    {selectedLines.includes("kamar2") && ( 
                                    <Line 
                                        type="monotone" 
                                        dataKey="kamar2" 
                                        stroke="red" 
                                        name={t.kamar2 || "Kamar 2"} 
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        // PENGATURAN ANIMASI GARIS
                                        animationDuration={1000}
                                        animationEasing="ease-in-out"
                                        connectNulls={true}
                                        // strokeOpacity={selectedLines.includes("kamar2") ? 1 : 0}
                                    />
                                    )}
                                    {selectedLines.includes("kamar3") && ( 
                                    <Line 
                                        type="monotone" 
                                        dataKey="kamar3" 
                                        stroke="green" 
                                        name={t.kamar3 || "Kamar 3"} 
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        // PENGATURAN ANIMASI GARIS
                                        animationDuration={1000}
                                        animationEasing="ease-in-out"
                                        connectNulls={true}
                                        // strokeOpacity={selectedLines.includes("kamar3") ? 1 : 0}
                                    />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        )}


                        


                        {/* No data message */}
                        {!loading && data_mcb1.length === 0 && (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                            <p>Tidak ada data untuk ditampilkan</p>
                        </div>
                        )}

                        {summaryData && <SummaryDisplay />}
                        
                    </div>
                </div>
            </div>
            
            <footer className="grafik-footer-edit">
                <img src={copyrightIcon} className="grafik-footer-icon" />
                <p>{t.berandaHakCipta}</p>
            </footer>
        </div>
    );

    
};

export default Grafik;