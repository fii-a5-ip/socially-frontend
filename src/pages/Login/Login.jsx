import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();

    console.log(data); // vezi ce vine de la backend

    document.cookie = `token=${data.jwtToken}; path=/; max-age=86400`;

    alert("Login reușit!");
  } catch (err) {
    alert("Email sau parolă greșită");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="login-title">Bun venit</h1>
          <p className="login-subtitle">Conectează-te la contul tău</p>
        </div>

        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-group">
              <label className="login-label">Email</label>
              <div className="login-input-box">
                <Mail size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-group">
              <label className="login-label">Parolă</label>
              <div className="login-input-box">
                <Lock size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                Ține-mă minte
              </label>

              <button className="login-forgot">
                Am uitat parola
              </button>
            </div>

            <button className="login-button" disabled={isLoading}>
              {isLoading ? "Se încarcă..." : "Conectare"}
            </button>

            <div className="login-divider">sau</div>

            <GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/google", {
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

      console.log(data);

      localStorage.setItem("token", data.token);

      alert("Login cu Google reușit!");
    } catch (err) {
      alert("Eroare la login cu Google");
    }
  }}
  onError={() => {
    alert("Google login failed");
  }}
/>
          </form>

          <p className="login-footer">
            Nu ai cont? <Link to="/register">Înregistrează-te</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;