import { useState, useEffect } from 'react';
import './Masuk_Daftar_Lupa.css';
import logo from '../assets/LogoWeb.png';
import translations from '../components/Bahasa.js';
import globeIcon from '../assets/language.svg';
import showIcon from '../assets/unhide.svg';
import hideIcon from '../assets/hide.svg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Daftar = () => {
    // ========= LANGUAGE =========
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');
    const [showDropdown, setShowDropdown] = useState(false);
    const t = translations[language];
    const navigate = useNavigate();
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setShowDropdown(false);
        localStorage.setItem('language', lang);
    };
    // ================================

    // ========= PASSWORD =========
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    // ============================

    // ========== PHONE NUMBER VALIDATION ==========
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [phoneErrorType, setPhoneErrorType] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const validatePhoneNumber = (phoneValue) => {
        if (!phoneValue) {
            setPhoneError('');
            setPhoneErrorType('');
            setIsPhoneValid(false);
        } else if (!/^\d+$/.test(phoneValue)) {
            setPhoneError(t.nomorTeleponAngka);
            setPhoneErrorType('nomorTeleponAngka');
            setIsPhoneValid(false);
        } else if (phoneValue.length < 9 || phoneValue.length > 13) {
            setPhoneError(t.nomorTeleponPanjang);
            setPhoneErrorType('nomorTeleponPanjang');
            setIsPhoneValid(false);
        } else if (!phoneValue.startsWith('8')) {
            setPhoneError(t.nomorTeleponFormat);
            setPhoneErrorType('nomorTeleponFormat');
            setIsPhoneValid(false);
        } else {
            setPhoneError('');
            setPhoneErrorType('');
            setIsPhoneValid(true);
        }
    };
    const handlePhoneChange = (e) => {
        const phoneValue = e.target.value;
        setPhoneNumber(phoneValue);
        validatePhoneNumber(phoneValue);
    };
    // ======================================

    // ========== EMAIL VALIDATION ==========
    const commonEmailDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
        'yahoo.co.id', 'ymail.com', 'live.com', 'icloud.com'
    ];
    const checkEmailTypo = (email) => {
        if (!email.includes('@')) return false;
        const [, domain] = email.split('@');
        const lowerDomain = domain.toLowerCase();
        const isValidDomain = commonEmailDomains.includes(lowerDomain);
        if (!isValidDomain) {
            return {
                hasTypo: true,
                message: t.formatTidakValidEmail
            };
        }
        return false;
    };
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [errorType, setErrorType] = useState('');
    const validateEmail = (emailValue) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidFormat = emailRegex.test(emailValue);
        if (!emailValue) {
            setEmailError('');
            setIsEmailValid(false);
            setErrorType('');
        } else if (!isValidFormat) {
            if (!emailValue.includes('@')) {
                setEmailError(t.simbolEmail);
                setErrorType('simbolEmail');
            } else if (emailValue.split('@').length > 2) {
                setEmailError(t.satuSimbolEmail);
                setErrorType('satuSimbolEmail');
            } else if (!emailValue.includes('.') || emailValue.split('@')[1]?.split('.').length < 2) {
                setEmailError(t.domainTitikEmail);
                setErrorType('domainTitikEmail');
            } else if (emailValue.startsWith('@') || emailValue.endsWith('@')) {
                setEmailError(t.awalAkhirEmail);
                setErrorType('awalAkhirEmail');
            } else if (emailValue.includes('..')) {
                setEmailError(t.titikGandaEmail);
                setErrorType('titikGandaEmail');
            } else if (emailValue.includes('  ')) {
                setEmailError(t.tidakSpasiEmail);
                setErrorType('tidakSpasiEmail');
            } else {
                setEmailError(t.formatTidakValidEmail);
                setErrorType('formatTidakValidEmail');
            }
            setIsEmailValid(false);
        } else {
            const typoInfo = checkEmailTypo(emailValue);
            if (typoInfo && typoInfo.hasTypo) {
                setEmailError(typoInfo.message);
                setErrorType('formatTidakValidEmail');
                setIsEmailValid(false);
            } else {
                setEmailError('');
                setErrorType('');
                setIsEmailValid(true);
            }
        }
    };
    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);
        validateEmail(emailValue);
    };
    // =========================================

    // ========== PASSWORD VALIDATION ===========
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [passwordErrorType, setPasswordErrorType] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false,
        notCommon: false,
        noSpaces: false
    });
    const commonPasswords = [
        'password', 'password123', 'qwerty', 'qwerty123', '123456', '123456789',
        'admin', 'admin123', 'abc123', 'password1', 'welcome', 'welcome123',
        'letmein', 'monkey', 'dragon', 'sunshine', 'master', 'hello', 'freedom',
        'whatever', 'qazwsx', 'trustno1', 'jordan', 'harley', 'robert', 'matthew',
        'jordan23', 'daniel', 'andrew', 'joshua', 'hunter', 'target123', 'baseball',
        'soccer', 'charlie', 'jordan1', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'
    ];
    const validatePassword = (passwordValue) => {
        const requirements = {
            length: passwordValue.length >= 8,
            uppercase: /[A-Z]/.test(passwordValue),
            lowercase: /[a-z]/.test(passwordValue),
            number: /[0-9]/.test(passwordValue),
            symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(passwordValue),
            notCommon: !commonPasswords.includes(passwordValue.toLowerCase()),
            noSpaces: !passwordValue.startsWith('  ') && !passwordValue.endsWith('  ')
        };
        setPasswordRequirements(requirements);
        if (!passwordValue) {
            setPasswordError('');
            setPasswordErrorType('');
            setIsPasswordValid(false);
            return;
        }
        if (!requirements.length) {
            setPasswordError(t.passwordMinimal8);
            setPasswordErrorType('length');
            setIsPasswordValid(false);
            return;
        }
        if (!requirements.noSpaces) {
            setPasswordError(t.passwordTidakSpasi);
            setPasswordErrorType('noSpaces');
            setIsPasswordValid(false);
            return;
        }
        if (!requirements.notCommon) {
            setPasswordError(t.passwordTidakUmum);
            setPasswordErrorType('notCommon');
            setIsPasswordValid(false);
            return;
        }
        const characterTypes = [
            requirements.uppercase,
            requirements.lowercase,
            requirements.number,
            requirements.symbol
        ];
        const validTypes = characterTypes.filter(Boolean).length;
        if (validTypes < 3) {
            setPasswordError(t.passwordKombinasi);
            setPasswordErrorType('combination');
            setIsPasswordValid(false);
            return;
        }
        if (email && passwordValue.toLowerCase() === email.toLowerCase()) {
            setPasswordError(t.passwordSamaEmail);
            setPasswordErrorType('sameAsEmail');
            setIsPasswordValid(false);
            return;
        }
        setPasswordError('');
        setPasswordErrorType('');
        setIsPasswordValid(true);
    };
    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
        validatePassword(passwordValue);
    };
    const getPasswordStrength = () => {
        const score = Object.values(passwordRequirements).filter(Boolean).length;
        if (score < 4) return { text: t.passwordLemah };
        if (score < 5) return { text: t.passwordSedang };
        if (score < 7) return { text: t.passwordKuat };
        return { text: t.passwordSangatKuat };
    };
    // =====================================

    // ========= Tampil Validasi form nomor telepon, email, dan password ========
    useEffect(() => {
        if (phoneErrorType) {
            switch (phoneErrorType) {
                case 'nomorTeleponAngka':
                    setPhoneError(t.nomorTeleponAngka);
                    break;
                case 'nomorTeleponPanjang':
                    setPhoneError(t.nomorTeleponPanjang);
                    break;
                case 'nomorTeleponFormat':
                    setPhoneError(t.nomorTeleponFormat);
                    break;
                default:
                    break;
            }
        }
        if (errorType) {
            switch (errorType) {
                case 'simbolEmail':
                    setEmailError(t.simbolEmail);
                    break;
                case 'satuSimbolEmail':
                    setEmailError(t.satuSimbolEmail);
                    break;
                case 'domainTitikEmail':
                    setEmailError(t.domainTitikEmail);
                    break;
                case 'awalAkhirEmail':
                    setEmailError(t.awalAkhirEmail);
                    break;
                case 'titikGandaEmail':
                    setEmailError(t.titikGandaEmail);
                    break;
                case 'tidakSpasiEmail':
                    setEmailError(t.tidakSpasiEmail);
                    break;
                case 'formatTidakValidEmail':
                    setEmailError(t.formatTidakValidEmail);
                    break;
                default:
                    break;
            }
        }
        if (passwordErrorType) {
            switch (passwordErrorType) {
                case 'length':
                    setPasswordError(t.passwordMinimal8);
                    break;
                case 'noSpaces':
                    setPasswordError(t.passwordTidakSpasi);
                    break;
                case 'notCommon':
                    setPasswordError(t.passwordTidakUmum);
                    break;
                case 'combination':
                    setPasswordError(t.passwordKombinasi);
                    break;
                case 'sameAsEmail':
                    setPasswordError(t.passwordSamaEmail);
                    break;
                default:
                    break;
            }
        }
    }, [language, t, phoneErrorType, errorType, passwordErrorType]); 
    // ======================================================

    // ========= Handle Firebase =========
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!isPhoneValid || !isEmailValid || !isPasswordValid) {
            toast.error(t.mohonLengkapiForm, {
                position: 'top-right',
                autoClose: 2000,
                closeButton: false,
                pauseOnHover: false
            });
            return;
        }
        try {
            const formattedPhone = phoneNumber.startsWith('8') ? '0' + phoneNumber : phoneNumber;

            // Cek apakah nomor telepon sudah digunakan
            const phoneQuery = query(
                collection(db, 'users'),
                where('phone_number', '==', formattedPhone)
            );
            const phoneSnapshot = await getDocs(phoneQuery);
            if (!phoneSnapshot.empty) {
                toast.error(t.nomorTelahDigunakan, {
                    position: 'top-right',
                    autoClose: 2000,
                    closeButton: false,
                    pauseOnHover: false
                });
                return;
            }

            // Daftar akun email
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Simpan data tambahan
            await setDoc(doc(db, 'users', user.uid), {
                id: user.uid,
                phone_number: formattedPhone,
                email: email
            });
            toast.success(t.daftarBerhasil, {
                position: 'top-right',
                autoClose: 1000,
                closeButton: false,
                pauseOnHover: false
            });
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Register error:', error);
            const code = error.code;
            if (code === 'auth/email-already-in-use') {
                toast.error(t.emailTelahDigunakan, {
                    position: 'top-right',
                    autoClose: 2000,
                    closeButton: false,
                    pauseOnHover: false
                });
            } else if (code === 'auth/network-request-failed') {
                toast.error(t.masalahJaringan, {
                    position: 'top-right',
                    autoClose: 2000,
                    closeButton: false,
                    pauseOnHover: false
                });
            } else {
                toast.error(t.daftarTerjadiKesalahan, {
                    position: 'top-right',
                    autoClose: 2000,
                    closeButton: false,
                    pauseOnHover: false
                });
            }
        }
    };
    // ==========================================

    return (
        <div className="login-flex-container">
            <ToastContainer />
            <div className="login-left-column">
                <div className="login-logo-wrapper">
                    <img src={logo} alt="Logo Senergy" className="login-logo-img" />
                    <h1>Senergy</h1>
                </div>
                <p className="login-description">{t.selamatDatang}</p>
            </div>
            <div className="login-right-column">
                <div className="login-header-controls">
                    <div className="login-language-switch">
                        <img 
                            src={globeIcon} 
                            alt="Pilih Bahasa" 
                            className="login-globe-icon" 
                            onClick={() => setShowDropdown(!showDropdown)} 
                        />
                        {showDropdown && (
                            <div className="login-dropdown-language">
                                <div onClick={() => handleLanguageChange('id')}>Indonesian</div>
                                <div onClick={() => handleLanguageChange('en')}>English</div>
                            </div>
                        )}
                    </div>
                </div>
                <h2>{t.daftar}</h2>
                <form onSubmit={handleSignup}>
                    <label htmlFor="full_name">{t.namaLengkap}</label>
                    <div className="login-email-wrapper">
                        <input 
                            type="text"
                            id="full_name"
                            placeholder={t.placeholderNamalengkap}
                            required
                        />
                    </div>
                    <label htmlFor="phone_number">{t.nomorTelepon}</label>
                    <div className="login-email-wrapper">
                        <div className="login-phone-input-container">
                            <span className="login-phone-prefix">+62</span>
                            <input 
                                type="tel"
                                id="phone_number"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder={t.placeholderNomorTelepon}
                                className={phoneError ? 'error login-phone-input' : isPhoneValid ? 'valid login-phone-input' : 'login-phone-input'}
                                required
                            />
                        </div>
                        {phoneError && (
                            <span className="login-telepon-error-message">{phoneError}</span>
                        )}
                        {isPhoneValid && (
                            <span className="login-telepon-valid-message">
                                {t.nomorTeleponValid}
                            </span>
                        )}
                    </div>
                    <label htmlFor="email">{t.email}</label>
                    <div className="login-email-wrapper">
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder={t.placeholderEmail}
                            className={emailError ? 'error' : isEmailValid ? 'valid' : ''}
                            required 
                        />
                        {emailError && (
                            <span className="login-email-error-message">{emailError}</span>
                        )}
                        {isEmailValid && (
                            <span className="login-email-valid-message">
                                {t.formatValidEmail}
                            </span>
                        )}
                    </div>
                    <label htmlFor="password">{t.kataSandi}</label>
                    <div className="login-password-wrapper">
                        <div className="login-password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder={t.placeholderKataSandi}
                                className={passwordError ? 'error' : isPasswordValid ? 'valid' : ''}
                                required
                            />
                            <img
                                src={showPassword ? showIcon : hideIcon}
                                alt={showPassword ? "Show Password" : "Hide Password"}
                                className="login-icon"
                                onClick={togglePassword}
                            />
                            {password && (
                                <div className="password-strength-indicator">
                                    <span>
                                        {getPasswordStrength().text}
                                    </span>
                                </div>
                            )}
                        </div>
                        {passwordError && (
                            <span className="login-password-error-message">
                                {passwordError}
                            </span>
                        )}
                        {isPasswordValid && (
                            <span className="login-password-valid-message">
                                {t.passwordValid}
                            </span>
                        )}
                    </div>

                    <button 
                        type="submit"
                        disabled={!isPhoneValid || !isEmailValid || !isPasswordValid}
                    >
                        {t.daftar}
                    </button>
                    <p className="login-register">
                        {t.sudahPunyaAkun} <Link to="/">{t.masukDisini}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Daftar;