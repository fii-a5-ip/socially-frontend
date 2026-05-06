import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../hooks/useTranslation";
import { API_URL } from "../../api/config";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const { login } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          username: email,
          password: password,
        }),

      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      
      // Salvăm token-ul (folosim localStorage pentru consistență)
      localStorage.setItem("token", data.jwtToken || data.token);
      
      login(); // Actualizăm starea globală
      navigate('/mode'); // Mergem la selecția modului
    } catch (err) {
      console.error(err);
      alert(t('login.error_message') || "Email sau parolă greșită");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="login-page">
      <div className="login-wrapper">
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

              <button className="login-forgot">
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
                    alert("Eroare la login cu Google");
                  }
                }}
                onError={() => {
                  alert("Google login failed");
                }}
              />
            </div>
          </form>

          <p className="login-footer">
            {t('login.register_prompt')} <Link to="/register">{t('login.register_link')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;