import { useState, useEffect } from "react";
import { API_BASE } from "./api";
import { LoginForm } from "./pages/LoginForm";
import { SignupForm } from "./pages/SignupForm";
import { VerifyOtpForm } from "./pages/VerifyOtpForm";
import { ForgotPasswordForm } from "./pages/ForgotPasswordForm";
import { Dashboard } from "./pages/Dashboard";
import "./App.css";

function App() {
    const [view, setView] = useState(() => 
    localStorage.getItem("token") ? "app" : "login"
  );
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState("");
  const [pendingVerifyPassword, setPendingVerifyPassword] = useState("");

    useEffect(() => {
    if (!token) return;

    async function silentRefresh() {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) return;
      try {
        const res = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
        });
        if (!res.ok) throw new Error("refresh failed");
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        setToken(data.token);
      } catch {
        // refresh token expired or invalid — force back to login
        handleLogout();
      }
    }

    // access token lasts 15 min — refresh every 10 min so it never actually expires
    const interval = setInterval(silentRefresh, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  function handleLoginSuccess(newToken, email,refreshToken) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userEmail", email);
     if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    setToken(newToken);
    setUserEmail(email);
    setView("app");
  }

    function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("refreshToken");
    setToken("");
    setUserEmail("");
    setView("login");
  }

  function goToVerify(email, password) {
    setPendingVerifyEmail(email);
    setPendingVerifyPassword(password || "");
    setView("verify-otp");
  }

  return (
    <div>
      {view === "login" && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          switchToSignup={() => setView("signup")}
          onNeedsVerification={(email) => goToVerify(email, "")}
           switchToForgotPassword={() => setView("forgot-password")}
        />
      )}
      {view === "signup" && (
        <SignupForm
          switchToLogin={() => setView("login")}
          onNeedsVerification={goToVerify}
        />
      )}
      {view === "verify-otp" && (
        <VerifyOtpForm
          email={pendingVerifyEmail}
          password={pendingVerifyPassword}
          onVerified={(email) => {
            if (pendingVerifyPassword) {
              // came from signup with a known password — log straight in
              autoLoginAfterVerify(email, pendingVerifyPassword, handleLoginSuccess, () => setView("login"));
            } else {
              setView("login");
            }
          }}
          switchToLogin={() => setView("login")}
        />
      )}
      {view === "forgot-password" && (
        <ForgotPasswordForm switchToLogin={() => setView("login")} />
      )}
      {view === "app" && (
        <Dashboard token={token} userEmail={userEmail} onLogout={handleLogout} />
      )}
   </div>
  );
}
//-------autologinform---------------//
async function autoLoginAfterVerify(email, password, onSuccess, fallbackToLogin) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Auto-login failed");
    const data = await res.json();
    onSuccess(data.token, data.email,data.refreshToken);
  } catch {
    fallbackToLogin();
  }
}

export default App;
