import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
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

	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

	const handleAvatarClick = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const saveAuthData = (data, jwtToken) => {
		document.cookie = `jwt_token=${jwtToken}; path=/; max-age=86400; SameSite=Strict`;
		localStorage.setItem('token', jwtToken);

		if (data.username) {
			localStorage.setItem("current_username", data.username);
		}

		if (data.id) {
			localStorage.setItem("current_userid", data.id);
		}
	};

	const parseErrorResponse = async (response, fallbackMessage) => {
		const errorText = await response.text();

		try {
			const errorJson = JSON.parse(errorText);

			if (errorJson.fields) {
				return Object.entries(errorJson.fields)
					.map(([field, message]) => `${field}: ${message}`)
					.join("\n");
			}

			return errorJson.message || errorJson.error || errorText || fallbackMessage;
		} catch {
			return errorText || fallbackMessage;
		}
	};

	const handleGoogleRegister = async (credentialResponse) => {
		const googleToken = credentialResponse.credential;

		if (!googleToken) {
			alert("Google nu a returnat token.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${API_URL}/api/v1/auth/google`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					token: googleToken
				})
			});

			const textResponse = await response.text();
			let data = {};

			try {
				data = textResponse ? JSON.parse(textResponse) : {};
			} catch {
				data = { token: textResponse };
			}

			if (!response.ok) {
				const errorMessage = data.message || data.error || textResponse || "Eroare la autentificarea cu Google!";
				throw new Error(errorMessage);
			}

			const jwtToken = data.jwtToken || data.token;

			if (!jwtToken) {
				throw new Error("Backend-ul nu a returnat JWT.");
			}

			saveAuthData(data, jwtToken);

			login();
			navigate('/onboarding');
		} catch (error) {
			alert("Backend: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const formData = new FormData(e.target);

		if (formData.get("password") !== formData.get("confirmPassword")) {
			alert("Parolele nu coincid!");
			setIsLoading(false);
			return;
		}

		const payload = {
			username: formData.get("username"),
			password: formData.get("password"),
			fullname: formData.get("fullname"),
			email: formData.get("email")
		};

		fetch(`${API_URL}/api/v1/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then(async response => {
				if (!response.ok) {
					const errorMessage = await parseErrorResponse(
						response,
						"Eroare la înregistrare!"
					);

					throw new Error(errorMessage);
				}

				const textResponse = await response.text();

				try {
					return textResponse ? JSON.parse(textResponse) : {};
				} catch {
					return { token: textResponse };
				}
			})
			.then(data => {
				setIsLoading(false);

				const jwtToken = data.jwtToken || data.token;

				if (jwtToken) {
					saveAuthData(data, jwtToken);
				}

				const avatarFile = fileInputRef.current?.files[0];

				if (jwtToken && avatarFile) {
					const avatarData = new FormData();
					avatarData.append('avatar', avatarFile);

					fetch(`${API_URL}/api/v1/users/avatar`, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${jwtToken}`
						},
						body: avatarData
					})
						.then(() => {
							login();
							navigate('/onboarding');
						})
						.catch(() => {
							login();
							navigate('/onboarding');
						});
				} else {
					if (jwtToken) {
						login();
						navigate('/onboarding');
					} else {
						alert("Cont creat! Acum te poți autentifica.");
						navigate('/login');
					}
				}
			})
			.catch(error => {
				alert("Backend: " + error.message);
				setIsLoading(false);
			});
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
							{googleClientId ? (
								<GoogleOAuthProvider clientId={googleClientId}>
									<GoogleLogin
										onSuccess={handleGoogleRegister}
										onError={() => {
											alert("Autentificarea cu Google a eșuat.");
										}}
										text="signup_with"
										shape="pill"
										useOneTap={false}
									/>
								</GoogleOAuthProvider>
							) : (
								<button
									className="social-btn"
									type="button"
									onClick={() => alert("Lipsește VITE_GOOGLE_CLIENT_ID din .env")}
								>
									<svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
										<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
										<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
										<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
										<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
									</svg>
									{t('register.google')}
								</button>
							)}
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
									<img
										src={avatarPreview}
										alt="Avatar Preview"
										style={{
											width: '100%',
											height: '100%',
											borderRadius: '50%',
											objectFit: 'cover'
										}}
									/>
								) : (
									<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
										<circle cx="12" cy="7" r="4"></circle>
									</svg>
								)}

								<div className="upload-icon">
									<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
										<line x1="12" y1="5" x2="12" y2="19"></line>
										<line x1="5" y1="12" x2="19" y2="12"></line>
									</svg>
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
										<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
											<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
											<circle cx="12" cy="7" r="4"></circle>
										</svg>
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
									<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
										<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
										<polyline points="22,6 12,13 2,6"></polyline>
									</svg>
									{t('register.email')}
								</label>
								<input type="email" name="email" placeholder={t('register.email_ph')} required />
							</div>

							<div className="form-row">
								<div className="input-group">
									<label>
										<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
											<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
											<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
										</svg>
										{t('register.pass')}
									</label>
									<input type="password" name="password" placeholder={t('register.pass_ph')} required minLength="8" />
								</div>

								<div className="input-group">
									<label>
										<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
											<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
											<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
										</svg>
										{t('register.pass_conf')}
									</label>
									<input type="password" name="confirmPassword" placeholder={t('register.pass_conf_ph')} required minLength="8" />
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