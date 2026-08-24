import { useState, useEffect } from "react";
import { API_BASE } from "../api";

export function VerifyOtpForm({ email, password, onVerified, switchToLogin }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleVerify() {
    setError("");
    setInfo("");
    if (!otp.trim()) {
      setError("Enter the 6-digit code from your email");
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });
      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.error || "Verification failed");
      }
      onVerified(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setError("");
    setInfo("");
    setResending(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.error || "Could not resend code");
      }
      setInfo("A new code has been sent to your email.");
      setCooldown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-brand">CALORIE TRACKER <b>PRO</b></div>
        <p className="auth-tagline">One last step — confirm it's really you.</p>
        <svg viewBox="0 0 260 220" className="auth-illustration">
          <circle cx="130" cy="110" r="90" fill="rgba(255,255,255,0.08)" />
          <circle cx="130" cy="110" r="58" fill="none" stroke="#fff" strokeWidth="4" opacity="0.9" />
          <path d="M105 110 l18 18 l35 -40" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="65" cy="55" r="14" fill="#fff" opacity="0.7" />
          <circle cx="205" cy="60" r="16" fill="#fff" opacity="0.5" />
          <circle cx="195" cy="175" r="12" fill="#fff" opacity="0.6" />
        </svg>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">Verify your email</h1>
          <p className="auth-subtitle">We sent a 6-digit code to <b>{email}</b></p>

          <div className="hb-field">
            <label>Verification code</label>
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

          {error && <p className="vb-error">{error}</p>}
          {info && <p className="vb-subtitle-light">{info}</p>}

          <button className="hb-btn-primary auth-btn-full" onClick={handleVerify} disabled={verifying}>
            {verifying ? "Verifying..." : "Verify email"}
          </button>

          <button
            type="button"
            className="auth-link-btn"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            style={{ marginTop: 12 }}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : resending ? "Sending..." : "Resend code"}
          </button>

          <p className="auth-switch">
            Wrong email? <span onClick={switchToLogin}>Back to sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
