import { useState, useEffect } from "react";
import { API_BASE } from "../api";

export function ForgotPasswordForm({ switchToLogin }) {
  const [step, setStep] = useState("request"); // "request" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleRequestCode() {
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        let message = "Could not send reset code";
        try {
          const errBody = await res.json();
          message = errBody.error || errBody.message || message;
        } catch {}
        throw new Error(message);
      }
      setStep("reset");
      setCooldown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        let message = "Could not resend code";
        try {
          const errBody = await res.json();
          message = errBody.error || errBody.message || message;
        } catch {}
        throw new Error(message);
      }
      setInfo("A new code has been sent to your email.");
      setCooldown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setError("");
    setInfo("");
    if (!otp.trim()) {
      setError("Enter the code from your email");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword }),
      });
      if (!res.ok) {
        let message = "Could not reset password";
        try {
          const errBody = await res.json();
          message = errBody.error || errBody.message || message;
        } catch {}
        throw new Error(message);
      }
      setInfo("Password reset! You can now sign in with your new password.");
      setTimeout(() => switchToLogin(), 1500);
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
        <p className="auth-tagline">Forgot your password? We'll help you back in.</p>
        <svg viewBox="0 0 260 220" className="auth-illustration">
          <circle cx="130" cy="110" r="90" fill="rgba(255,255,255,0.08)" />
          <circle cx="130" cy="110" r="58" fill="none" stroke="#fff" strokeWidth="4" opacity="0.9" />
          <path d="M110 100 v-15 a20 20 0 0 1 40 0 v15" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
          <rect x="100" y="100" width="60" height="42" rx="8" fill="#fff" opacity="0.9" />
          <circle cx="65" cy="55" r="14" fill="#fff" opacity="0.7" />
          <circle cx="205" cy="60" r="16" fill="#fff" opacity="0.5" />
        </svg>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          {step === "request" ? (
            <>
              <h1 className="auth-title">Reset your password</h1>
              <p className="auth-subtitle">Enter your account email and we'll send you a reset code</p>

              <div className="hb-field">
                <label>Email</label>
                <input
                  className="hb-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              {error && <p className="vb-error">{error}</p>}

              <button className="hb-btn-primary auth-btn-full" onClick={handleRequestCode} disabled={loading}>
                {loading ? "Sending..." : "Send reset code"}
              </button>
            </>
          ) : (
            <>
              <h1 className="auth-title">Enter new password</h1>
              <p className="auth-subtitle">We sent a code to <b>{email}</b></p>

              <div className="hb-field">
                <label>Reset code</label>
                <input
                  className="hb-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  inputMode="numeric"
                  style={{ letterSpacing: "6px", fontSize: "18px", fontWeight: 700, textAlign: "center" }}
                />
              </div>

              <div className="hb-field">
                <label>New password</label>
                <input
                  className="hb-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="hb-field">
                <label>Confirm new password</label>
                <input
                  className="hb-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>

              {error && <p className="vb-error">{error}</p>}
              {info && <p className="vb-subtitle-light">{info}</p>}

              <button className="hb-btn-primary auth-btn-full" onClick={handleResetPassword} disabled={loading}>
                {loading ? "Resetting..." : "Reset password"}
              </button>

              <button
                type="button"
                className="auth-link-btn"
                onClick={handleResend}
                disabled={loading || cooldown > 0}
                style={{ marginTop: 12 }}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
            </>
          )}

          <p className="auth-switch">
            Remembered it? <span onClick={switchToLogin}>Back to sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
