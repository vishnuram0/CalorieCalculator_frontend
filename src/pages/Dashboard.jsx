import { useState,useEffect } from "react";
import { API_BASE } from "../api";
import { Logo } from "../components/Logo";
import { DashboardHome } from "./DashboardHome";
import { FoodListPage } from "./FoodListPage";
import { ProfilePage } from "./ProfilePage";
import { AdminVerifyPage } from "./AdminVerifyPage";
import { ChangeUsernamePage } from "./ChangeUsernamePage";
import { ChangePasswordPage } from "./ChangePasswordPage";
import { ComingSoonPage } from "./ComingSoonPage";

export function Dashboard({ token, userEmail, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [today, setToday] = useState(null);
  const [error, setError] = useState("");

  async function fetchProfile() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Session expired, please log in again");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchToday() {
    try {
      const res = await fetch(`${API_BASE}/api/log/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not load today's log");
      const data = await res.json();
      setToday(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchToday();
  }, [token]);

  function goTo(pageId) {
    setPage(pageId);
    setSidebarOpen(false);
  }

  if (error) {
    return (
      <div className="hb-app">
        <div className="hb-center-msg">
          <p className="vb-error">{error}</p>
          <button className="vb-btn-solid" onClick={onLogout}>LOG OUT</button>
        </div>
      </div>
    );
  }

  if (!profile || !today) {
    return (
      <div className="hb-app">
        <div className="hb-center-msg">
          <p className="vb-subtitle-light">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hb-app">
      {sidebarOpen && <div className="hb-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`hb-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="hb-sidebar-header">
          <span className="hb-sidebar-title">MENU</span>
          <button className="hb-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="hb-nav">
          <button className={`hb-nav-item ${page === "dashboard" ? "active" : ""}`} onClick={() => goTo("dashboard")}>
            <span>📊</span> Dashboard
          </button>
          <button className={`hb-nav-item ${page === "food" ? "active" : ""}`} onClick={() => goTo("food")}>
            <span>🍽️</span> Today's food list
          </button>
          <button className={`hb-nav-item ${page === "profile" ? "active" : ""}`} onClick={() => goTo("profile")}>
            <span>👤</span> Profile update
          </button>
{profile.role === "ADMIN" && (
    <button className={`hb-nav-item ${page === "admin" ? "active" : ""}`} onClick={() => goTo("admin")}>
      <span>🛡️</span> Verify foods
    </button>
  )}
          <button className="hb-nav-item hb-nav-expandable" onClick={() => setAccountOpen(!accountOpen)}>
            <span>⚙️</span> Account &amp; security
            <span className="hb-chevron">{accountOpen ? "▲" : "▼"}</span>
          </button>
          {accountOpen && (
            <div className="hb-submenu">
              <button className={`hb-nav-subitem ${page === "password" ? "active" : ""}`} onClick={() => goTo("password")}>Change password</button>
              <button className={`hb-nav-subitem ${page === "username" ? "active" : ""}`} onClick={() => goTo("username")}>Change username</button>
              <button className={`hb-nav-subitem ${page === "emails" ? "active" : ""}`} onClick={() => goTo("emails")}>Manage email addresses</button>
            </div>
          )}
        </nav>

        <button className="hb-nav-logout" onClick={onLogout}>⏻ Log out</button>
      </aside>

      <div className="hb-body">
        <header className="hb-topbar">
          <button className="hb-hamburger" onClick={() => setSidebarOpen(true)}>
            <span></span><span></span><span></span>
          </button>
          <div className="hb-brand">CALORIE TRACKER <b>PRO</b></div>
          <div className="hb-user-greeting">
            <span className="hb-avatar-small">{profile.username.charAt(0).toUpperCase()}</span>
            Welcome,{profile.username}
         </div>
        </header>

        <main className="hb-main">
          {page === "dashboard" && <DashboardHome profile={profile} today={today} />}
          {page === "food" && <FoodListPage token={token} today={today} refreshToday={fetchToday} />}
          {page === "profile" && <ProfilePage token={token} profile={profile} setProfile={setProfile} refreshToday={fetchToday} />}
        {page === "admin" && profile.role === "ADMIN" && <AdminVerifyPage token={token} />}
        {page === "password" && <ChangePasswordPage token={token} />}
{page === "username" && <ChangeUsernamePage token={token} profile={profile} setProfile={setProfile} />}
          {page === "emails" && <ComingSoonPage title="Manage email addresses" />}
        </main>
      </div>
    </div>
  );
}
