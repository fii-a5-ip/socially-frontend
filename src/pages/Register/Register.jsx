import React, { useState, useRef } from 'react';
import './Register.css';

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e) => {
        
        const file = e.target.files[0];
        if (file) {
            console.log("Avatar selectat:", file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        
          /*
        // De decomentat și folosit când va fi gata endpoint-ul de backend
        
        // 1. Extragem datele introduse în inputs
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());
        
        // Dacă aveți și upload de avatar și vreți să trimiteți ca form-data (nu JSON):
        // if (fileInputRef.current?.files[0]) {
        //   formData.append('avatar', fileInputRef.current.files[0]);
        //   // Atenție: dacă fol formData direkt în body, scoate header-ul 'Content-Type'
        // }

        // 2. Facem cererea către server
        fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Se lasă dacă trimiți json curat
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) throw new Error('A apărut o problemă la înregistrare!');
            return response.json();
        })
        .then(data => {
            setIsLoading(false);
            // Aici adaugi redirect-ul! De ex: navigate('/home') 
        })
        .catch(error => {
            console.error(error);
            setIsLoading(false);
            
        });
       
        */
        setTimeout(() => {
            setIsLoading(false);
            
            window.location.href = '/';
        }, 2000);
    };

    return (
        <div className="register-page">
            <div className="register-container">

                <div className="left-panel">
                    <div className="left-content">
                        <h1>Join thousands of users</h1>
                       

                        <div className="social-sync">
                            <span className="social-divider"></span>
                            <button className="social-btn" type="button">
                                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google or other socials
                            </button>
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="right-header">
                        <div>
                            <h2>Create Your Account</h2>
                            <p>Let's get you set up</p>
                        </div>
                    </div>

                    <div className="form-card">
                        <div className="profile-upload-section">
                            <div className="profile-avatar" onClick={handleAvatarClick}>
                                <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                <div className="upload-icon">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                </div>
                            </div>
                            <p className="upload-text">Upload a profile picture (max 5MB)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>

                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="input-group">
                                    <label>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        Full Name *
                                    </label>
                                    <input type="text" placeholder="Enter your full name" required />
                                </div>
                                <div className="input-group">
                                    <label>
                                        <span className="at-symbol">@</span> Username *
                                    </label>
                                    <input type="text" placeholder="Enter your username" required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    Email Address *
                                </label>
                                <input type="email" placeholder="your.email@example.com" required />
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        Password *
                                    </label>
                                    <input type="password" placeholder="Enter your password" required minLength="6" />
                                </div>
                                <div className="input-group">
                                    <label>
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        Confirm Password *
                                    </label>
                                    <input type="password" placeholder="Confirm your password" required minLength="6" />
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <input type="checkbox" id="terms" required />
                                <label htmlFor="terms">Accept <span className="terms-highlight">termenii și condițiile</span></label>
                            </div>

                            <button
                                type="submit"
                                className={`submit-btn ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;