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
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <div>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Masuk />} />
                <Route path="/daftar" element={<Daftar />} />
                <Route path="/lupa-password" element={<LupaPassword />} />

                {/* Private routes */}
                <Route path="/beranda" element={
                    <PrivateRoute><Beranda /></PrivateRoute>
                } />
                <Route path="/akun" element={
                    <PrivateRoute><Akun /></PrivateRoute>
                } />
                <Route path="/grafik" element={
                    <PrivateRoute><Grafik /></PrivateRoute>
                } />
                <Route path="/kamar" element={
                    <PrivateRoute><Kamar /></PrivateRoute>
                } />
                <Route path="/kontak" element={
                    <PrivateRoute><Kontak /></PrivateRoute>
                } />
            </Routes>
        </div>
    );
}

export default App
