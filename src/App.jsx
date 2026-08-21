import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:8080";

function Logo({ dark }) {
  return (
    <div className="vb-logo">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={dark ? "#4ADE80" : "#0F6E56"} strokeWidth="1.8">
        <path d="M12 21c-4-2-7-5.5-7-10a7 7 0 0 1 14 0c0 4.5-3 8-7 10z" />
        <path d="M12 21V9" />
      </svg>
      <span className={dark ? "vb-logo-dark" : "vb-logo-light"}>
        VITAL <b>BALANCE</b>
      </span>
    </div>
  );
}

function App() {
  const [view, setView] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");

  useEffect(() => {
    if (token) setView("app");
  }, []);

  function handleLoginSuccess(newToken, email) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userEmail", email);
    setToken(newToken);
    setUserEmail(email);
    setView("app");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken("");
    setUserEmail("");
    setView("login");
  }

  return (
    <div>
      {view === "login" && (
        <LoginForm onSuccess={handleLoginSuccess} switchToSignup={() => setView("signup")} />
      )}
      {view === "signup" && (
        <SignupForm onSuccess={handleLoginSuccess} switchToLogin={() => setView("login")} />
      )}
      {view === "app" && (
        <Dashboard token={token} userEmail={userEmail} onLogout={handleLogout} />
      )}
    </div>
  );
}
// ---------------- LOGIN ----------------
function LoginForm({ onSuccess, switchToSignup }) {
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
        throw new Error(errBody.error || errBody.message || "Login failed");
      }
      const data = await res.json();
      onSuccess(data.token, data.email);
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
            <span>Forgot password?</span>
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
// ---------------- SIGNUP ----------------
function SignupForm({ onSuccess, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [activitylevel, setActivitylevel] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username, email, password, gender,
        age: Number(age), weight: Number(weight), height: Number(height),
        activitylevel, goal,
      };
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(Object.values(errBody).join(", ") || "Signup failed");
      }
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      onSuccess(loginData.token, loginData.email);
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
        <p className="auth-tagline">Your goals, your body, your numbers — one clean dashboard.</p>
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
        <div className="auth-card auth-card-wide">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">A few details to personalize your targets</p>

          <p className="auth-section-label">Account information</p>
          <div className="auth-grid-2">
            <div className="hb-field">
              <label>Username</label>
              <input className="hb-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" />
            </div>
            <div className="hb-field">
              <label>Email</label>
              <input className="hb-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="hb-field">
              <label>Password</label>
              <input className="hb-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="hb-field">
              <label>Confirm password</label>
              <input className="hb-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          <p className="auth-section-label">Health information</p>
          <div className="auth-grid-2">
            <div className="hb-field">
              <label>Gender</label>
              <div className="vb-seg-light">
                <button type="button" className={gender === "male" ? "active" : ""} onClick={() => setGender("male")}>Male</button>
                <button type="button" className={gender === "female" ? "active" : ""} onClick={() => setGender("female")}>Female</button>
              </div>
            </div>
            <div className="hb-field">
              <label>Age</label>
              <input className="hb-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div className="hb-field">
              <label>Height (cm)</label>
              <input className="hb-input" type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="hb-field">
              <label>Weight (kg)</label>
              <input className="hb-input" type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="hb-field">
              <label>Activity level</label>
              <select className="hb-input" value={activitylevel} onChange={(e) => setActivitylevel(e.target.value)}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very active</option>
              </select>
            </div>
            <div className="hb-field">
              <label>Goal</label>
              <div className="vb-seg-light vb-seg-three">
                <button type="button" className={goal === "lose" ? "active" : ""} onClick={() => setGoal("lose")}>Lose</button>
                <button type="button" className={goal === "maintain" ? "active" : ""} onClick={() => setGoal("maintain")}>Maintain</button>
                <button type="button" className={goal === "gain" ? "active" : ""} onClick={() => setGoal("gain")}>Gain</button>
              </div>
            </div>
          </div>

          <button className="hb-btn-primary auth-btn-full" onClick={handleSignup} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          {error && <p className="vb-error">{error}</p>}

          <p className="auth-switch">
            Already have an account? <span onClick={switchToLogin}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
// ---------------- DASHBOARD SHELL (hamburger + top bar) ----------------
function Dashboard({ token, userEmail, onLogout }) {
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

// ---------------- DASHBOARD HOME (landing page) ----------------
function DashboardHome({ profile, today }) {
const remaining = Math.round(Math.max(today.targetCalories - today.caloriesEatenToday, 0) * 10) / 10;
  const circumference = 2 * Math.PI * 70;
  const percent = Math.min(today.caloriesEatenToday / today.targetCalories, 1);
  const dashOffset = circumference * (1 - percent);
const macroRings = [
  {
    label: "Protein",
    consumed: today.proteinToday,
    target: profile.proteinGrams,
    color: "#2563EB",
    message: "Try to take it from whole food",
  },
  {
    label: "Carbs",
    consumed: today.carbsToday,
    target: profile.carbsGrams,
    color: "#F59E0B",
    message: "Carbs are the fuel for our energy",
  },
  {
    label: "Fat",
    consumed: today.fatToday,
    target: profile.fatGrams,
    color: "#EF4444",
    message: "Take it from good fat",
  },
  {
    label: "Fiber",
    consumed: today.fiberToday,
    target: profile.fiberGrams,
    color: "#10B981",
    message: "Fiber keeps digestion steady — add it gradually",
  },
];
  return (
    <div>
      <div className="hb-stat-grid">
        <div className="hb-stat-card">
          <span className="hb-stat-label">BMI</span>
          <span className="hb-stat-value">{profile.bmi}</span>
          <span className="hb-stat-sub">{profile.bmiCategory}</span>
        </div>
        <div className="hb-stat-card">
          <span className="hb-stat-label">Target calories</span>
          <span className="hb-stat-value">{today.targetCalories}</span>
          <span className="hb-stat-sub">kcal / day</span>
        </div>
        <div className="hb-stat-card">
          <span className="hb-stat-label">Consumed</span>
          <span className="hb-stat-value">{today.caloriesEatenToday}</span>
          <span className="hb-stat-sub">kcal today</span>
        </div>
        <div className="hb-stat-card hb-stat-highlight">
          <span className="hb-stat-label">Remaining</span>
          <span className="hb-stat-value">{remaining}</span>
          <span className="hb-stat-sub">kcal left</span>
        </div>
      </div>
<div className="hb-progress-card">
        <div className="hb-ring-wrap">
          <svg viewBox="0 0 170 170" width="200" height="200">
            <circle cx="85" cy="85" r="70" fill="none" stroke="#EEF0F6" strokeWidth="14" />
            <circle
              cx="85" cy="85" r="70" fill="none" stroke="#2563EB" strokeWidth="14"
              strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
              transform="rotate(-90 85 85)"
            />
          </svg>
          <div className="hb-ring-text">
            <span className="hb-ring-num">{today.caloriesEatenToday} / {today.targetCalories}</span>
            <span className="hb-ring-unit">kcal</span>
          </div>
        </div>
        <p className="hb-progress-caption">You're {Math.round(percent * 100)}% toward today's goal</p>
      </div>

      <div className="hb-macro-ring-grid">
        {macroRings.map((macro) => {
          const circumference = 2 * Math.PI * 40;
          const percent = macro.target > 0 ? Math.min(macro.consumed / macro.target, 1) : 0;
          const dashOffset = circumference * (1 - percent);

          return (
           <div key={macro.label} className="hb-macro-ring-card">
  <div className="hb-macro-ring-wrap">
    <svg viewBox="0 0 100 100" width="100" height="100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#EEF0F6" strokeWidth="8" />
      <circle
        cx="50" cy="50" r="40" fill="none" stroke={macro.color} strokeWidth="8"
        strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="hb-macro-ring-value-inside">
      <span>{macro.consumed}g</span>
      <small>/ {macro.target}g</small>
    </div>
  </div>
  <div className="hb-macro-ring-label">{macro.label}</div>
  <div className="hb-macro-ring-message">{macro.message}</div>
</div>
          );
        })}
      </div>
    </div>
  );
}
     
// ---------------- TODAY'S FOOD LIST PAGE ----------------
function FoodListPage({ token, today, refreshToday }) {
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState("");
  const [unit, setUnit] = useState("g");

  const [mealPreview, setMealPreview] = useState(null);
  const [parsingMeal, setParsingMeal] = useState(false);
  const [confirmingMeal, setConfirmingMeal] = useState(false);

  const [overrideCalories, setOverrideCalories] = useState("");
  const [overrideProtein, setOverrideProtein] = useState("");
  const [overrideCarbs, setOverrideCarbs] = useState("");
  const [overrideFat, setOverrideFat] = useState("");
  const [overrideFiber, setOverrideFiber] = useState("");
  const [customFoodName, setCustomFoodName] = useState("");
const [customCalories, setCustomCalories] = useState("");
const [customProtein, setCustomProtein] = useState("");
const [customCarbs, setCustomCarbs] = useState("");
const [customFat, setCustomFat] = useState("");
const [customFiber, setCustomFiber] = useState("");
const [customGrams, setCustomGrams] = useState("100");
const [submittingCustom, setSubmittingCustom] = useState(false);
const [searchedOnce, setSearchedOnce] = useState(false);

useEffect(() => {
  if (searchedOnce && searchResults.length === 0 && !selectedFood && !mealPreview) {
    setCustomFoodName(searchQuery);
  }
}, [searchedOnce, searchResults, searchQuery]);
  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSelectedFood(null);
    setMealPreview(null);
    setSearchedOnce(true);
    try {
      const res = await fetch(`${API_BASE}/api/food/search-usda?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setSearchResults(data.filter((f) => f.status === "VERIFIED"));
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }
  async function handleSubmitCustomFood() {
    console.log("handleSubmitCustomFood called", { customFoodName, customCalories, customGrams });
  if (!customFoodName || !customCalories || !customGrams) return;
  setSubmittingCustom(true);
  try {
    const res = await fetch(`${API_BASE}/api/food/custom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        foodName: customFoodName,
        caloriesPer100g: Number(customCalories),
        proteinPer100g: Number(customProtein || 0),
        carbsPer100g: Number(customCarbs || 0),
        fatPer100g: Number(customFat || 0),
        fiberPer100g: Number(customFiber || 0),
        grams: Number(customGrams),
      }),
    });
    if (!res.ok) {
      const errBody = await res.json();
      throw new Error(Object.values(errBody).join(", ") || "Could not save custom food");
    }
    setCustomFoodName("");
    setCustomCalories("");
    setCustomProtein("");
    setCustomCarbs("");
    setCustomFat("");
    setCustomFiber("");
    setCustomGrams("100");
    setSearchQuery("");
    setSearchResults([]);
    setSearchedOnce(false);
    await refreshToday();
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmittingCustom(false);
  }
}

  function selectFoodAndPrefill(food) {
    setSelectedFood(food);
    setGrams("100");
    fillFromGrams(food, "100");
  }

  function fillFromGrams(food, gramsValue) {
    const ratio = Number(gramsValue) / 100;
    if (!gramsValue || isNaN(ratio)) return;
    setOverrideCalories((food.caloriesPer100g * ratio).toFixed(1));
    setOverrideProtein((food.proteinPer100g * ratio).toFixed(1));
    setOverrideCarbs((food.carbsPer100g * ratio).toFixed(1));
    setOverrideFat((food.fatPer100g * ratio).toFixed(1));
    setOverrideFiber((food.fiberPer100g * ratio).toFixed(1));
  }

  function handleGramsChange(value) {
    setGrams(value);
    if (selectedFood) fillFromGrams(selectedFood, value);
  }

  async function handleParseDescription() {
    if (!searchQuery.trim()) return;
    setParsingMeal(true);
    setMealPreview(null);
    setSelectedFood(null);
    setSearchResults([]);
    try {
      const res = await fetch(`${API_BASE}/api/meal/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: searchQuery }),
      });
      if (!res.ok) throw new Error("Could not parse meal description");
      const data = await res.json();
      setMealPreview(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setParsingMeal(false);
    }
  }

  async function handleConfirmMeal() {
    if (!mealPreview) return;
    setConfirmingMeal(true);
    try {
      const res = await fetch(`${API_BASE}/api/meal/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: searchQuery, mealResult: mealPreview }),
      });
      if (!res.ok) throw new Error("Could not save meal");
      setSearchQuery("");
      setMealPreview(null);
      await refreshToday();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmingMeal(false);
    }
  }

  async function handleLogSelectedFood() {
    if (!selectedFood || !grams || Number(grams) <= 0) return;
    setAdding(true);
    try {
      const payload = {
        foodItemId: selectedFood.id,
        grams: Number(grams),
        overrideCalories: Number(overrideCalories),
        overrideProtein: Number(overrideProtein),
        overrideCarbs: Number(overrideCarbs),
        overrideFat: Number(overrideFat),
        overrideFiber: Number(overrideFiber),
      };
      const res = await fetch(`${API_BASE}/api/log/add-from-food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Could not log food");
      setSelectedFood(null);
      setGrams("");
      setUnit("g");
      setSearchQuery("");
      setSearchResults([]);
      setOverrideCalories("");
      setOverrideProtein("");
      setOverrideCarbs("");
      setOverrideFat("");
      setOverrideFiber("");
      await refreshToday();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/api/log/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not delete entry");
      await refreshToday();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="hb-card">
      <div className="hb-add-row">
        <input
          className="hb-input"
          placeholder="Search a food, or describe a meal (e.g. 2 idli and sambar 1 cup)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="hb-btn-primary" onClick={handleSearch} disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
        <button className="hb-btn-primary" style={{ background: "#7C3AED" }} onClick={handleParseDescription} disabled={parsingMeal}>
          {parsingMeal ? "Analyzing..." : "✨ Analyze"}
        </button>
      </div>

      {mealPreview && (
        <div style={{ marginTop: 16, padding: 14, background: "#F5F6FA", borderRadius: 10 }}>
          {mealPreview.ingredients.map((ing, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #E5E3DC",
                fontSize: 13,
              }}
            >
              <span>
                {ing.matched ? ing.matchedFoodName : `${ing.parsedName} (not found)`}
                <span style={{ color: "#8B8FA3", marginLeft: 6 }}>
                  {ing.quantity}{ing.unit}
                </span>
              </span>
              <span style={{ color: ing.matched ? "#1A1A2E" : "#B23A3A", fontWeight: 700 }}>
                {ing.matched ? `${ing.calories} kcal` : "unmatched"}
              </span>
            </div>
          ))}

          {mealPreview.unmatchedCount > 0 && (
            <p style={{ fontSize: 12, color: "#B23A3A", marginTop: 8 }}>
              ⚠ {mealPreview.unmatchedCount} ingredient(s) not found — totals may be incomplete
            </p>
          )}

          <div className="hb-form-grid" style={{ marginTop: 12 }}>
  <div className="hb-field">
    <label>Calories</label>
    <input className="hb-input" type="number" value={mealPreview.totalCalories}
      onChange={(e) => setMealPreview({ ...mealPreview, totalCalories: Number(e.target.value) })} />
  </div>
  <div className="hb-field">
    <label>Protein (g)</label>
    <input className="hb-input" type="number" value={mealPreview.totalProtein}
      onChange={(e) => setMealPreview({ ...mealPreview, totalProtein: Number(e.target.value) })} />
  </div>
  <div className="hb-field">
    <label>Carbs (g)</label>
    <input className="hb-input" type="number" value={mealPreview.totalCarbs}
      onChange={(e) => setMealPreview({ ...mealPreview, totalCarbs: Number(e.target.value) })} />
  </div>
  <div className="hb-field">
    <label>Fat (g)</label>
    <input className="hb-input" type="number" value={mealPreview.totalFat}
      onChange={(e) => setMealPreview({ ...mealPreview, totalFat: Number(e.target.value) })} />
  </div>
  <div className="hb-field">
    <label>Fiber (g)</label>
    <input className="hb-input" type="number" value={mealPreview.totalFiber}
      onChange={(e) => setMealPreview({ ...mealPreview, totalFiber: Number(e.target.value) })} />
  </div>
</div>


          <button
            className="hb-btn-primary"
            style={{ marginTop: 12 }}
            onClick={handleConfirmMeal}
            disabled={confirmingMeal}
          >
            {confirmingMeal ? "Saving..." : "✓ Confirm & log this meal"}
          </button>
        </div>
      )}

      {searchResults.length > 0 && !selectedFood && (
        <div style={{ marginTop: 14 }}>
          {searchResults.map((food) => (
            <div
              key={food.id}
              onClick={() => selectFoodAndPrefill(food)}
              style={{
                padding: "10px 12px",
                border: "1px solid #E5E3DC",
                borderRadius: 8,
                marginBottom: 6,
                cursor: "pointer",
                fontSize: 13.5,
              }}
            >
              <b>{food.foodName}</b>
              <span style={{ color: "#8B8FA3", marginLeft: 8 }}>
                {food.caloriesPer100g} kcal / 100g
              </span>
            </div>
          ))}
        </div>
      )}
      {searchedOnce && searchResults.length === 0 && !selectedFood && !mealPreview && (
  <div style={{ marginTop: 14, padding: 14, background: "#FFF7ED", borderRadius: 10, border: "1px solid #FDBA74" }}>
    <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
      "{searchQuery}" not found in our database — enter nutrition values manually
    </p>

    <div className="hb-field">
      <label>Food name</label>
      <input className="hb-input" value={customFoodName } onChange={(e) => setCustomFoodName(e.target.value)} placeholder="e.g. Oreo Dairy Milk" />
    </div>

    <div className="hb-form-grid" style={{ marginTop: 10 }}>
      <div className="hb-field">
        <label>Calories / 100g</label>
        <input className="hb-input" type="number" min="0" value={customCalories} onChange={(e) => setCustomCalories(e.target.value)} placeholder="e.g. 245" />
      </div>
      <div className="hb-field">
        <label>Protein / 100g</label>
        <input className="hb-input" type="number" min="0" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)} placeholder="optional" />
      </div>
      <div className="hb-field">
        <label>Carbs / 100g</label>
        <input className="hb-input" type="number" min="0" value={customCarbs} onChange={(e) => setCustomCarbs(e.target.value)} placeholder="optional" />
      </div>
      <div className="hb-field">
        <label>Fat / 100g</label>
        <input className="hb-input" type="number" min="0" value={customFat} onChange={(e) => setCustomFat(e.target.value)} placeholder="optional" />
      </div>
      <div className="hb-field">
        <label>Fiber / 100g</label>
        <input className="hb-input" type="number" min="0" value={customFiber} onChange={(e) => setCustomFiber(e.target.value)} placeholder="optional" />
      </div>
      <div className="hb-field">
        <label>Grams eaten</label>
        <input className="hb-input" type="number" min="1" value={customGrams} onChange={(e) => setCustomGrams(e.target.value)} />
      </div>
    </div>

    <button className="hb-btn-primary" style={{ marginTop: 12 }} onClick={handleSubmitCustomFood} disabled={submittingCustom}>
      {submittingCustom ? "Saving..." : "Save & Add to Meal"}
    </button>
    <p style={{ fontSize: 11, color: "#8B8FA3", marginTop: 8 }}>
      This will be logged now and submitted for admin review.
    </p>
  </div>
)}


      {selectedFood && (
        <div style={{ marginTop: 14, padding: 14, background: "#F5F6FA", borderRadius: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{selectedFood.foodName}</div>

          <div className="hb-add-row">
            <input
              className="hb-input"
              type="number"
              placeholder="Grams"
              value={grams}
              onChange={(e) => handleGramsChange(e.target.value)}
            />
            <select
              className="hb-input"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{ flex: "0 0 90px" }}
            >
              <option value="g">grams</option>
              <option value="ml">ml</option>
            </select>
          </div>

          <div className="hb-form-grid" style={{ marginTop: 12 }}>
            <div className="hb-field">
              <label>Calories</label>
              <input className="hb-input" type="number" value={overrideCalories} onChange={(e) => setOverrideCalories(e.target.value)} />
            </div>
            <div className="hb-field">
              <label>Protein (g)</label>
              <input className="hb-input" type="number" value={overrideProtein} onChange={(e) => setOverrideProtein(e.target.value)} />
            </div>
            <div className="hb-field">
              <label>Carbs (g)</label>
              <input className="hb-input" type="number" value={overrideCarbs} onChange={(e) => setOverrideCarbs(e.target.value)} />
            </div>
            <div className="hb-field">
              <label>Fat (g)</label>
              <input className="hb-input" type="number" value={overrideFat} onChange={(e) => setOverrideFat(e.target.value)} />
            </div>
            <div className="hb-field">
              <label>Fiber (g)</label>
              <input className="hb-input" type="number" value={overrideFiber} onChange={(e) => setOverrideFiber(e.target.value)} />
            </div>
          </div>

          <div className="hb-add-row" style={{ marginTop: 12 }}>
            <button className="hb-btn-primary" onClick={handleLogSelectedFood} disabled={adding}>
              {adding ? "Logging..." : "Log this"}
            </button>
            <button className="hb-nav-logout" style={{ marginTop: 0 }} onClick={() => setSelectedFood(null)}>Cancel</button>
          </div>
        </div>
      )}

      {error && <p className="vb-error">{error}</p>}

      <table className="hb-table" style={{ marginTop: 16 }}>
        <thead>
          <tr><th>Food</th><th>Calories</th><th></th></tr>
        </thead>
        <tbody>
          {today.entries.length === 0 && (
            <tr><td colSpan="3" className="hb-table-empty">No entries logged today yet</td></tr>
          )}
          {today.entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.foodName}</td>
              <td>{entry.calories} kcal</td>
              <td className="hb-table-actions">
                <button className="hb-icon-btn hb-icon-delete" onClick={() => handleDelete(entry.id)} title="Delete">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ---------------- PROFILE UPDATE PAGE ----------------
function ProfilePage({ token, profile, setProfile, refreshToday }) {
  const [form, setForm] = useState({
    gender: profile.gender,
    age: profile.age,
    weight: profile.weight,
    height: profile.height,
    activitylevel: profile.activitylevel,
    goal: profile.goal,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          weight: Number(form.weight),
          height: Number(form.height),
        }),
      });
      if (!res.ok) throw new Error("Could not update profile");
      const updated = await res.json();
      setProfile(updated);
      await refreshToday();
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="hb-card hb-form-card">
      <div className="hb-form-grid">
        <div className="hb-field">
          <label>Gender</label>
          <div className="vb-seg-light">
            <button type="button" className={form.gender === "male" ? "active" : ""} onClick={() => setForm({ ...form, gender: "male" })}>Male</button>
            <button type="button" className={form.gender === "female" ? "active" : ""} onClick={() => setForm({ ...form, gender: "female" })}>Female</button>
          </div>
        </div>

        <div className="hb-field">
          <label>Age</label>
          <input className="hb-input" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        </div>

        <div className="hb-field">
          <label>Weight (kg)</label>
          <input className="hb-input" type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
        </div>

        <div className="hb-field">
          <label>Height (cm)</label>
          <input className="hb-input" type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
        </div>

        <div className="hb-field">
          <label>Activity level</label>
          <select className="hb-input" value={form.activitylevel} onChange={(e) => setForm({ ...form, activitylevel: e.target.value })}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very active</option>
          </select>
        </div>

        <div className="hb-field">
          <label>Goal</label>
          <div className="vb-seg-light vb-seg-three">
            <button type="button" className={form.goal === "lose" ? "active" : ""} onClick={() => setForm({ ...form, goal: "lose" })}>Lose</button>
            <button type="button" className={form.goal === "maintain" ? "active" : ""} onClick={() => setForm({ ...form, goal: "maintain" })}>Maintain</button>
            <button type="button" className={form.goal === "gain" ? "active" : ""} onClick={() => setForm({ ...form, goal: "gain" })}>Gain</button>
          </div>
        </div>
      </div>

      <div className="hb-form-footer">
        <button className="hb-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
        {saved && <span className="hb-saved-tag">✓ Saved</span>}
        {error && <p className="vb-error">{error}</p>}
      </div>

      <div className="hb-macro-preview">
        <div className="hb-macro-item"><span>{profile.proteinGrams}g</span><small>Protein</small></div>
        <div className="hb-macro-item"><span>{profile.carbsGrams}g</span><small>Carbs</small></div>
        <div className="hb-macro-item"><span>{profile.fatGrams}g</span><small>Fat</small></div>
        <div className="hb-macro-item"><span>{profile.fiberGrams}g</span><small>Fiber</small></div>
      </div>
    </div>
  );
}
// ---------------- ADMIN: VERIFY FOODS PAGE ----------------
function AdminVerifyPage({ token }) {
  const [pendingFoods, setPendingFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  async function fetchPending() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/pending-foods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not load pending foods");
      const data = await res.json();
      setPendingFoods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  function startEdit(food) {
    setEditingId(food.id);
    setEditForm({ ...food });
  }

  async function handleVerify() {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/foods/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Could not verify food");
      setEditingId(null);
      setEditForm(null);
      await fetchPending();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="hb-card"><p>Loading pending foods...</p></div>;

  return (
    <div>
      <div className="hb-card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "#8B8FA3" }}>
          {pendingFoods.length} food{pendingFoods.length !== 1 ? "s" : ""} awaiting verification
        </p>
      </div>

      {error && <p className="vb-error">{error}</p>}

      {pendingFoods.map((food) => (
        <div key={food.id} className="hb-card" style={{ marginBottom: 12 }}>
          {editingId === food.id ? (
            <div>
              <div className="hb-field">
                <label>Food name</label>
                <input className="hb-input" value={editForm.foodName}
                  onChange={(e) => setEditForm({ ...editForm, foodName: e.target.value })} />
              </div>
              <div className="hb-form-grid" style={{ marginTop: 12 }}>
                <div className="hb-field">
                  <label>Calories / 100g</label>
                  <input className="hb-input" type="number" value={editForm.caloriesPer100g}
                    onChange={(e) => setEditForm({ ...editForm, caloriesPer100g: Number(e.target.value) })} />
                </div>
                <div className="hb-field">
                  <label>Protein / 100g</label>
                  <input className="hb-input" type="number" value={editForm.proteinPer100g}
                    onChange={(e) => setEditForm({ ...editForm, proteinPer100g: Number(e.target.value) })} />
                </div>
                <div className="hb-field">
                  <label>Carbs / 100g</label>
                  <input className="hb-input" type="number" value={editForm.carbsPer100g}
                    onChange={(e) => setEditForm({ ...editForm, carbsPer100g: Number(e.target.value) })} />
                </div>
                <div className="hb-field">
                  <label>Fat / 100g</label>
                  <input className="hb-input" type="number" value={editForm.fatPer100g}
                    onChange={(e) => setEditForm({ ...editForm, fatPer100g: Number(e.target.value) })} />
                </div>
                <div className="hb-field">
                  <label>Fiber / 100g</label>
                  <input className="hb-input" type="number" value={editForm.fiberPer100g}
                    onChange={(e) => setEditForm({ ...editForm, fiberPer100g: Number(e.target.value) })} />
                </div>
              </div>
              <div className="hb-form-footer">
                <button className="hb-btn-primary" onClick={handleVerify} disabled={saving}>
                  {saving ? "Saving..." : "✓ Verify & Save"}
                </button>
                <button className="hb-nav-logout" style={{ marginTop: 0 }} onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{food.foodName}</div>
                <div style={{ fontSize: 12, color: "#8B8FA3", marginTop: 4 }}>
                  {food.caloriesPer100g} kcal &middot; P {food.proteinPer100g}g &middot; C {food.carbsPer100g}g &middot; F {food.fatPer100g}g &middot; Fiber {food.fiberPer100g}g
                  <span style={{ marginLeft: 8, color: "#B5B1A6" }}>({food.source})</span>
                </div>
              </div>
              <button className="hb-btn-primary" onClick={() => startEdit(food)}>Review</button>
            </div>
          )}
        </div>
      ))}

      {pendingFoods.length === 0 && (
        <div className="hb-card hb-coming-soon">
          <span className="hb-coming-icon">✅</span>
          <h3>All caught up</h3>
          <p>No foods awaiting verification right now.</p>
        </div>
      )}
    </div>
  );
}
// ---------------- CHANGE USERNAME PAGE ----------------
function ChangeUsernamePage({ token, profile, setProfile }) {
  const [username, setUsername] = useState(profile.username || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });
      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(Object.values(errBody).join(", ") || "Could not update username");
      }
      const updated = await res.json();
      setProfile(updated);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="hb-card hb-form-card">
      <div className="hb-field">
        <label>Username</label>
        <input
          className="hb-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter a new username"
        />
      </div>

      <div className="hb-form-footer">
        <button className="hb-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save username"}
        </button>
        {saved && <span className="hb-saved-tag">✓ Saved</span>}
        {error && <p className="vb-error">{error}</p>}
      </div>
    </div>
  );
}

// ---------------- CHANGE PASSWORD PAGE ----------------
function ChangePasswordPage({ token }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(Object.values(errBody).join(", ") || "Could not update password");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="hb-card hb-form-card">
      <div className="hb-field">
        <label>Current password</label>
        <input
          className="hb-input"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <div className="hb-field">
        <label>New password</label>
        <input
          className="hb-input"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>

      <div className="hb-field">
        <label>Confirm new password</label>
        <input
          className="hb-input"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="••••••••"
           autoComplete="new-password"
        />
      </div>

      <div className="hb-form-footer">
        <button className="hb-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Update password"}
        </button>
        {saved && <span className="hb-saved-tag">✓ Password updated</span>}
        {error && <p className="vb-error">{error}</p>}
      </div>
    </div>
  );
}

// ---------------- SCAFFOLDED PLACEHOLDER PAGES ----------------
function ComingSoonPage({ title }) {
  return (
    <div className="hb-card hb-coming-soon">
      <span className="hb-coming-icon">🚧</span>
      <h3>{title}</h3>
      <p>This feature isn't built yet — it's reserved space for a future update.</p>
    </div>
  );
}

export default App;
