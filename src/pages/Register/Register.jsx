import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { API_URL } from '../../api/config';
import { useApp } from '../../context/AppContext';
import './Register.css';

const Register = () => {
    const { t } = useTranslation();
    const { login } = useApp();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());
        
        // Adăugăm și avatarul dacă există
        if (avatarPreview) {
            userData.avatar = avatarPreview;
        }

        try {
            const response = await fetch(`${API_URL}/api/v1/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();
            
            // Salvăm token-ul primit la înregistrare (dacă backend-ul îl trimite)
            if (data.jwtToken || data.token) {
                localStorage.setItem('token', data.jwtToken || data.token);
                login();
                navigate('/onboarding');
            } else {
                alert("Cont creat! Acum te poți autentifica.");
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                {/* Panel Stânga */}
                <motion.div 
                    className="left-panel"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="brand">SOCIALLY</div>
                    <div className="left-content">
                        <h1>{t('register.join')}</h1>
                        <p>Alătură-te comunității noastre și începe să explorezi evenimente unice.</p>
                        
                        <div className="social-sync">
                            <button className="social-btn">
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" alt="Google" width="20" />
                                {t('register.google')}
                            </button>
                            <div className="social-divider">SAU</div>
                        </div>
                    </div>
                    <div className="footer-copyright">
                        {t('footer.copyright')}
                    </div>
                </motion.div>

                {/* Panel Dreapta */}
                <motion.div 
                    className="right-panel"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="right-header">
                        <div>
                            <h2>{t('register.title')}</h2>
                            <p>{t('register.subtitle')}</p>
                        </div>
                    </div>

                    <motion.div 
                        className="form-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="profile-upload-section" onClick={handleAvatarClick}>
                            <div className="profile-avatar">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                )}
                                <div className="upload-icon">
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </div>
                            </div>
                            <p className="upload-text">{t('register.upload')}</p>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                style={{ display: 'none' }} 
                                accept="image/*"
                                name="avatar-file"
                            />
                        </div>

                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        {t('register.fullname')}
                                    </label>
                                    <input type="text" name="fullname" placeholder={t('register.fullname_ph')} required />
                                </div>
                                <div className="input-group">
                                    <label>
                                        <span className="at-symbol">@</span> {t('register.username')}
                                    </label>
                                    <input type="text" name="username" placeholder={t('register.username_ph')} required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    {t('register.email')}
                                </label>
                                <input type="email" name="email" placeholder={t('register.email_ph')} required />
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        {t('register.pass')}
                                    </label>
                                    <input type="password" name="password" placeholder={t('register.pass_ph')} required minLength="6" />
                                </div>
                                <div className="input-group">
                                    <label>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        {t('register.pass_conf')}
                                    </label>
                                    <input type="password" name="confirmPassword" placeholder={t('register.pass_conf_ph')} required minLength="6" />
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <input type="checkbox" id="terms" required />
                                <label htmlFor="terms">
                                    {t('register.terms')} <span className="terms-highlight">Termenii și Condițiile</span>
                                </label>
                            </div>

                            <button className="submit-btn" disabled={isLoading}>
                                {isLoading ? t('register.btn_loading') : t('register.btn')}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </div>


    );
};

export default Register;
