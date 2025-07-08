import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Masuk from './pages/Masuk';
import Daftar from './pages/Daftar';
import LupaPassword from './pages/LupaPassword';
import Beranda from './pages/Beranda';
import Akun from './pages/Akun'; 
import Grafik from './pages/Grafikcopy'; 
import Kamar from './pages/Kamarcopy'; 
import Kontak from './pages/Kontak'; 
import Kontrol from './pages/Kontrol';  

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Masuk />} />
                <Route path="/daftar" element={<Daftar />} />
                <Route path="/lupa-password" element={<LupaPassword />} />
                <Route path="/beranda" element={<Beranda />} />
                <Route path="/akun" element={<Akun />} />
                <Route path="/grafik" element={<Grafik />} />
                <Route path="/kamar" element={<Kamar />} />
                <Route path="/kontak" element={<Kontak />} />
                <Route path="/kontrol" element={<Kontrol />} />
            </Routes>
        </div>
    );
}

export default App
