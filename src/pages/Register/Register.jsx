import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
                <div className="register-card">
                    <div className="register-left">
                        <div className="register-left-content">
                            <h2>{t('register.join')}</h2>
                            <button className="google-auth-btn">
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" alt="Google" />
                                {t('register.google')}
                            </button>
                        </div>
                    </div>

                    <div className="register-right">
                        <div className="register-header">
                            <h1>{t('register.title')}</h1>
                            <p>{t('register.subtitle')}</p>
                        </div>

                        <div className="avatar-upload-section" onClick={handleAvatarClick}>
                            <div className="avatar-preview">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar Preview" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    </div>
                                )}
                            </div>
                            <p>{t('register.upload')}</p>
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
                                <label className="custom-checkbox">
                                    <input type="checkbox" required />
                                    <span className="checkmark"></span>
                                    {t('register.terms')}
                                </label>
                            </div>

                            <button className="register-submit-btn" disabled={isLoading}>
                                {isLoading ? t('register.btn_loading') : t('register.btn')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
