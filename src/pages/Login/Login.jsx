import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useTranslation } from "../../hooks/useTranslation";
import "./Login.css";

function Login() {
  const { login } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login();
      navigate('/mode');

    }, 1500);
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

            <button className="login-google">
              Conectare cu Google
            </button>
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