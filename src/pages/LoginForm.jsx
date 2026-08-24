import { useState } from "react";
import { API_BASE } from "../api";

export function LoginForm({ onSuccess, switchToSignup,onNeedsVerification,switchToForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errBody = await res.json();
        const message=errBody.error || errBody.message || "Login failed";
        if (message.toLowerCase().includes("verify")) {
          onNeedsVerification(email);
          return;
        }
        throw new Error(message);
      }
      const data = await res.json();
      onSuccess(data.token, data.email,data.refreshToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-brand">CALORIE TRACKER <b>PRO</b></div>
        <p className="auth-tagline">Track smarter. Eat with purpose. See real progress, every day.</p>
        <svg viewBox="0 0 260 220" className="auth-illustration">
          <circle cx="130" cy="110" r="90" fill="rgba(255,255,255,0.08)" />
          <circle cx="130" cy="110" r="58" fill="none" stroke="#fff" strokeWidth="4" opacity="0.9" />
          <path d="M130 75 L130 110 L155 128" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="130" cy="110" r="6" fill="#fff" />
          <circle cx="65" cy="55" r="14" fill="#fff" opacity="0.7" />
          <circle cx="205" cy="60" r="16" fill="#fff" opacity="0.5" />
          <circle cx="195" cy="175" r="12" fill="#fff" opacity="0.6" />
        </svg>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">Welcome back — let's see today's progress</p>

          <div className="hb-field">
            <label>Email</label>
            <input className="hb-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div className="hb-field">
            <label>Password</label>
            <div className="auth-pw-wrap">
              <input
                className="hb-input"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <span className="auth-eye" onClick={() => setShowPw(!showPw)}>{showPw ? "🙈" : "👁"}</span>
            </div>
          </div>

                    <div className="auth-forgot">
            <span onClick={switchToForgotPassword}>Forgot password?</span>
          </div>

          <button className="hb-btn-primary auth-btn-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {error && <p className="vb-error">{error}</p>}

          <p className="auth-switch">
            Don't have an account? <span onClick={switchToSignup}>Create one</span>
          </p>
        </div>
      </div>
    </div>
  );
}
