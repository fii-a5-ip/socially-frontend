import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// Polish: Importat toast și Toaster pentru notificări
import toast, { Toaster } from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";

import { useTranslation } from "../../hooks/useTranslation";
import { API_URL } from "../../api/config";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const { login, isLoggedIn } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Polish: Verificare mediu dev pentru bypass
  const isDev = import.meta.env.DEV;
  
  // Polish: Redirecționare automată dacă utilizatorul este deja logat
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/mode');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          rememberMe: rememberMe
        }),


      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      
      // Salvăm token-ul (folosim localStorage pentru consistență)
      localStorage.setItem("token", data.jwtToken || data.token);
      
      // Salvăm și datele utilizatorului deoarece backend-ul curent nu are un endpoint /api/users/me
      if (data.username) localStorage.setItem("current_username", data.username);
      if (data.id) localStorage.setItem("current_userid", data.id);
      if (data.email) localStorage.setItem("current_email", data.email);
      if (data.fullname) localStorage.setItem("current_fullname", data.fullname);
      
      login(); // Actualizăm starea globală
      navigate('/mode'); // Mergem la selecția modului
    } catch (err) {
      console.error(err);
      toast.error(t('login.error_message') || "Email sau parolă greșită");    } finally {
      setIsLoading(false);
    }
  };

  const handleDevLogin = () => {
    localStorage.setItem("token", "dev-token-bypass");
    login();
    navigate('/mode');
  };

  return (
    <div className="login-page">
      <motion.div 
        className="login-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <h1 className="login-title">{t('login.title')}</h1>
          <p className="login-subtitle">{t('login.subtitle')}</p>
        </div>

        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-group">
              <label className="login-label">{t('login.email')}</label>
              <div className="login-input-box">
                <Mail size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.email_placeholder')}
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-group">
              <label className="login-label">{t('login.password')}</label>
              <div className="login-input-box">
                <Lock size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.password_placeholder')}
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-eye"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {t('login.remember_me')}
              </label>

              <button 
                type="button"
                className="login-forgot"
                // Polish: Placeholder pentru Forgot Password (toast)
                onClick={() => toast.success(t('login.forgot_password_placeholder') || "Funcționalitatea va fi disponibilă curând!")}
              >
                {t('login.forgot_password')}
              </button>
            </div>

            <button className="login-button" disabled={isLoading}>
              {isLoading ? t('login.btn_loading') : t('login.btn')}
            </button>

            <div className="login-divider">sau</div>

            <div className="google-login-container">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const response = await fetch(`${API_URL}/api/v1/auth/google`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        token: credentialResponse.credential,
                      }),
                    });

                    if (!response.ok) {
                      throw new Error("Google login failed");
                    }

                    const data = await response.json();
                    localStorage.setItem("token", data.token || data.jwtToken);
                    
                    login();
                    navigate('/mode');
                  } catch (err) {
                    console.error(err);
                    toast.error("Eroare la login cu Google");
                  }
                }}
                onError={() => {
                  toast.error("Google login failed");
                }}
              />
            </div>

            {/* Polish: Afișare buton bypass doar în mediul de development */}
            {isDev && (
              <button type="button" onClick={handleDevLogin} className="dev-bypass-btn">
                🔓 Bypass Login (Dev)
              </button>
            )}
          </form>


          <p className="login-footer">
            {t('login.register_prompt')} <Link to="/register">{t('login.register_link')}</Link>
          </p>
        </div>
      </motion.div>
      {/* Polish: Container pentru notificările toast (localizat aici pentru a nu modifica alte fișiere) */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>

  );
}

export default Login;