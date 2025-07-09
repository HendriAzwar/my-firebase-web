import { useState, useEffect, useRef } from "react";
import "./Grafik.css";
import logo from "../assets/LogoWeb.png";
import notificationIcon from "../assets/notification.svg";
import globeIcon from "../assets/language.svg";
import copyrightIcon from "../assets/copyright.svg";
import lightModeIcon from "../assets/lightmode.svg";
import darkModeIcon from "../assets/darkmode.svg";
import hamburgerIcon from "../assets/hamburger.svg";
import tripledotIcon from "../assets/other.svg";
import translations from "../components/Bahasa.js";
import { Link } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";


const Grafik = () => {
    // ===== State untuk MCB yang tersedia =====
    const [availableMCBs, setAvailableMCBs] = useState([]);
    const [selectedMCB, setSelectedMCB] = useState("mcb1");
    const [mcbConfig, setMcbConfig] = useState(null);

    // ===== State untuk data grafik =====
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===== State untuk line selection (dinamis berdasarkan MCB) =====
    const [selectedLines, setSelectedLines] = useState([]);

    // ===== State untuk penjumlahan data =====
    const [summaryData, setSummaryData] = useState(null);

    // ===== State untuk filter kalender =====
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // ===== State untuk translate kamar =====
    const translateRoomName = (name) => {
        const key = name.toLowerCase().replace(/\s/g, "");
        return t[key] || name;
    };

    // ===== Function untuk format tanggal =====
    const formatDateForAPI = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    };

    // ===== Function untuk mendapatkan tanggal hari ini =====
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    // ===== Helper function untuk mendapatkan tanggal seminggu lalu =====
    const getWeekAgoDate = () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo.toISOString().split("T")[0];
    };

    // ===== Helper function untuk mendapatkan tanggal seminggu kedepan =====
    const getWeekNextDate = () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() + 7);
        return weekAgo.toISOString().split("T")[0];
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

    // ===== Menu Navbar Lainnya: Kontak, Akun, dan Beranda (Three Dots) =====
    const otherMenuThreeDots = useRef(null);
    const otherIconThreeDots = useRef(null);
    const [showOtherMenuThreeDots, setShowOtherMenuThreeDots] = useState(false);

    // ===== Bahasa =====
    const globeLanguage = useRef(null);
    const dropdownLanguage = useRef(null);
    const [showDropdownLanguage, setShowDropdownLanguage] = useState(false);
    const [language, setLanguage] = useState(
        localStorage.getItem("language") || "id"
    );
    const t = translations[language];

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
        setShowDropdownLanguage(false);
    };

    // ===== Darkmode dan LightMode =====
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode === "true";
    });

    useEffect(() => {
        document.body.className = darkMode
            ? "grafik-dark-mode"
            : "grafik-light-mode";
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // ===== Fitur ubah bahasa dan menu lainnya: kontak, beranda, dan akun (Three Dots) =====
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

        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDropdown);
        };
    }, []);

    const API_BASE_URL = "https://my-backend-api.onrender.com/api/grafik";

    useEffect(() => {
            const findAvailableMCBs = async () => {
                try {
                  const res = await fetch(`${API_BASE_URL}/mcb-config`);
                  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                  const mcbList = await res.json();

                  setAvailableMCBs(mcbList);

                  if (mcbList.length > 0) {
                    const defaultMCB = mcbList[0];
                    setSelectedMCB(defaultMCB.id);
                    setMcbConfig(defaultMCB);

                    const defaultLines = defaultMCB.roomNames.map((_, idx) => `room${idx + 1}`);
                    setSelectedLines(defaultLines);
                  }
                } catch (error) {
                  console.error("Error fetching MCB config:", error);
                }
            };

            findAvailableMCBs();
        }, []);



    // ===== Set default range data yang mau ditampilkan =====
    useEffect(() => {
        if (selectedMCB) {
            setStartDate(getWeekAgoDate());
            setEndDate(getTodayDate());
        }
    }, [selectedMCB]);

    // ===== Update MCB konfigurasi ketika mengganti pilihan MCB =====
    useEffect(() => {
        const currentMCB = availableMCBs.find((mcb) => mcb.id === selectedMCB);
        if (currentMCB) {
            setMcbConfig(currentMCB);

            // Reset selected lines untuk MCB baru
            const defaultLines = currentMCB.roomNames.map(
                (_, idx) => `room${idx + 1}`
            );
            setSelectedLines(defaultLines);
        }
    }, [selectedMCB, availableMCBs]);

    // ===== Fetch utama untuk kalender =====
    useEffect(() => {
        if (!selectedMCB || !startDate || !endDate) return;

        const fetchData = async () => {
            setLoading(true);
            try {
              const params = new URLSearchParams({
                startDate: formatDateForAPI(startDate),
                endDate: formatDateForAPI(endDate),
              });

              const res = await fetch(`${API_BASE_URL}/harian/${selectedMCB}?${params.toString()}`);
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              const json = await res.json();

              if (json.data) {
                const orderedData = [...json.data].sort(
                  (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
                );
                setData(orderedData);
                setSummaryData(json.summary);
              } else {
                setData([]);
                setSummaryData(null);
              }
            } catch (err) {
              console.error("Gagal mengambil data grafik:", err);
              setData([]);
              setSummaryData(null);
            } finally {
              setLoading(false);
            }
        };

        fetchData();
      }, [selectedMCB, startDate, endDate]);

    // ===== Tombol pengatur visibility garis tertentu pada grafik =====
    const handleLegendClick = (dataKey) => {
        if (!mcbConfig) return;
        const allRooms = mcbConfig.roomNames.map((_, idx) => `room${idx + 1}`);
        setSelectedLines(
            (prev) =>
                prev.length === 1 && prev[0] === dataKey
                    ? allRooms // Show all if only one was selected
                    : [dataKey] // Show only clicked one
        );
    };

    // ===== Komponen untuk memfilter MCB =====
    const MCBSelector = () => {
        if (availableMCBs.length <= 1) return null;
        return (
            <div className="grafik-mcb">
              <div className="grafik-pilih-mcb">
                <label>
                  {t.pilihanMcb}
                </label>
                <select
                    value={selectedMCB}
                    onChange={(e) => setSelectedMCB(e.target.value)}
                >
                    {availableMCBs.map((mcb) => (
                        <option key={mcb.id} value={mcb.id}>
                           {mcb.name}
                        </option>
                    ))}
                </select>
              </div>
                {mcbConfig && (
                    <div className="grafik-keterangan-mcb">                
                        <strong>{t.keterangan}: </strong>{" "}
                        {mcbConfig.roomNames.map((r) => translateRoomName(r)).join(", ")}
                    </div>
                )}
            </div>
        );
    };

  // ===== Komponen untuk memfilter tanggal =====
  const DateFilters = () => {
    return (
      <div className="grafik-date-filters">
          <div className="grafik-filter-tanggal">
            <label>
              {t.filterHarianDariTanggal}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label>
              {t.filterHarianSampaiTanggal}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
            <button
              onClick={() => {
                setStartDate(getTodayDate());
                setEndDate(getTodayDate());
              }}
            >
              {t.tombolHariIni}
            </button>
            <button
              onClick={() => {
                setStartDate(getWeekAgoDate());
                setEndDate(getTodayDate());
              }}
            >
              {t.tombol7Hari}
            </button>
            <button
              onClick={() => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
                setEndDate(getTodayDate());
              }}
            >
              {t.tombol30Hari}
            </button>
            <button
              className="grafik-tombol-reset"
              onClick={() => {
                setStartDate(getWeekAgoDate());
                setEndDate(getTodayDate());
              }}
            >
              Reset
            </button>
          </div>
      </div>
    );
  };

  // ===== Komponen keterangan informasi ketika kursor diarahkan ke grafik =====
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">
            {new Date(label).toLocaleDateString(
              language === "en" ? "en-US" : "id-ID",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${parseFloat(entry.value).toFixed(2)} kWh`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format X-axis label
  const formatXAxisLabel = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // ===== Komponen tampilan total/penjumlahan =====
  const SummaryDisplay = () => {
    if (!summaryData || !mcbConfig) return null;
    return (
      <div className="grafik-ringkasan-grafik">
        <h4>{t.totalKonsumsi} {mcbConfig.name}</h4>
        {/* Periode */}
        <div className="grafik-periode">
          <p>{t.periodePenggunaan}</p>
          <div className="grafik-periode-isi">
            {summaryData.tanggal_mulai && summaryData.tanggal_akhir ? (
              <>
                {new Date(summaryData.tanggal_mulai).toLocaleDateString(
                  "id-ID"
                )}{" "}
                -{" "}
                {new Date(summaryData.tanggal_akhir).toLocaleDateString(
                  "id-ID"
                )}
                <small>
                  {summaryData.jumlah_hari} {t.day}
                </small>
              </>
            ) : (
              "Tidak tersedia"
            )}
          </div>
        </div>

        {/* Room Cards */}
        {summaryData.rooms && summaryData.rooms.length > 0 && (
          <div className="grafik-ringkasan-kamar-container">
            {summaryData.rooms.map((room, index) => {
              const colors = [
                "blue", "red", "green", "orange", "purple", "brown", "pink", "gray", "cyan", "magenta", "lime"
              ];
              const color = colors[index] || "gray";

              return (
                <div className="grafik-ringkasan-kamar" key={index}>
                  <div className="grafik-judul-kamar">
                    {translateRoomName(room.name)}
                    <div className="grafik-garis-kamar"></div>
                  </div>
                  <div className="grafik-kwh-kamar">
                    {room.total.toFixed(2)} kWh
                    <span>
                      Rp{room.tarif.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total Keseluruhan */}
        <div className="grafik-total-keseluruhan">
          <div className="grafik-judul-total">
            {t.jumlahPenggunaanPerMcb}
          </div>
          <div className="grafik-isi-total">
            {summaryData.total_keseluruhan.toFixed(2)} kWh
            <span>
              Rp{summaryData.tarif_total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ===== Generate line colors =====
  const getLineColor = (index) => {
    const colors = [
      "#0066CC",
      "#FF4444",
      "#00AA00",
      "#FF8800",
      "#8800FF",
      "#AA5500",
      "#FF4499",
      "#666666",
      "#00CCCC",
      "#CC00CC",
      "#AAFF00",
    ];
    return colors[index] || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
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
              <div
                className="grafik-navbar-other-dropdown-menu"
                ref={otherMenuThreeDots}
              >
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
          <img
            src={notificationIcon}
            alt="Notifikasi"
            className="grafik-notifikasi-icon"
          />
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
                <div onClick={() => handleLanguageChange("id")}>Indonesian</div>
                <div onClick={() => handleLanguageChange("en")}>English</div>
              </div>
            )}
          </div>
          {/* Darkmode dan Lightmode */}
          <button
            className={
              "grafik-mode-toggle " +
              (darkMode ? "grafik-dark" : "grafik-light")
            }
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Theme"
          >
            {darkMode ? (
              <img
                src={darkModeIcon}
                alt="Dark Mode"
                className="grafik-mode-icon"
              />
            ) : (
              <img
                src={lightModeIcon}
                alt="Light Mode"
                className="grafik-mode-icon"
              />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar (Bar Kiri) */}
      <div className="grafik-sidebar" id="grafik-sidebar">
        <Link to="/kamar" onClick={closeSidebar}>
          {t.berandaKamar}
        </Link>
        {/* <Link to="/kontrol" onClick={closeSidebar}>
          {t.berandaKontrol}
        </Link> */}
        <Link to="/grafik" onClick={closeSidebar}>
          {t.berandaGrafik}
        </Link>
      </div>

      {/* Isi website */}
      <div className="grafik-main-content">
        <div className="grafik-feature-grid">
          <div className="grafik">
            <h3>{t.hasilLaporan}</h3>

            {/* MCB Selector */}
            <MCBSelector />

            {/* Date Filters */}
            <DateFilters />

            <div className="grafik-header">
              <h1>{mcbConfig ? mcbConfig.name : "Loading..."}</h1>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p>Memuat data grafik...</p>
              </div>
            )}

            {/* Grafik Chart */}
            {!loading && data.length > 0 && mcbConfig && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: darkMode ? "20px" : "0px",
                    padding: "10px",
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxisLabel}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    label={{ value: "kWh", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    onClick={(e) => handleLegendClick(e.dataKey)}
                    wrapperStyle={{ cursor: "pointer" }}
                  />

                  {/* Generate lines dynamically based on MCB configuration */}
                  {mcbConfig.roomNames.map((roomName, index) => {
                    const roomKey = `room${index + 1}`;
                    const isVisible = selectedLines.includes(roomKey);

                    return (
                      <Line
                        key={roomKey}
                        type="monotone"
                        dataKey={roomKey}
                        name={translateRoomName(roomName)}
                        stroke={getLineColor(index)}
                        strokeWidth={isVisible ? 2 : 0}
                        dot={isVisible}
                        connectNulls={false}
                        hide={!isVisible}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            )}

            {/* No data message */}
            {!loading && data.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: darkMode ? "#ccc" : "#666",
                }}
              >
                <p>📊 Tidak ada data untuk ditampilkan</p>
                <p style={{ fontSize: "14px", marginTop: "10px" }}>
                  Coba ubah filter tanggal atau pilih MCB yang berbeda
                </p>
              </div>
            )}

            {/* Summary Display */}
            <SummaryDisplay />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="grafik-footer-edit">
        <img src={copyrightIcon} className="grafik-footer-icon" />
        <p>{t.berandaHakCipta}</p>
      </footer>
    </div>
  );
};

export default Grafik;
