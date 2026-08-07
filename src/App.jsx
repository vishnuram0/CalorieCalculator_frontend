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
    <div className="vb-page vb-dark">
      <div className="vb-panel">
        <Logo dark />

        <h1 className="vb-title-dark">WELCOME BACK</h1>

        <div className="vb-badge">
          <svg viewBox="0 0 140 140" width="130" height="130">
            <circle cx="70" cy="70" r="58" fill="none" stroke="#22303A" strokeWidth="10" />
            <circle
              cx="70" cy="70" r="58" fill="none" stroke="#4ADE80" strokeWidth="10"
              strokeDasharray="364" strokeDashoffset="90" strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="vb-badge-text">
            LOGIN TO<br />YOUR PLAN
          </div>
        </div>

        <div className="vb-field-dark">
          <label>Email</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="vb-field-dark">
          <label>Password</label>
          <div className="vb-pw-wrap">
            <input
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="vb-eye" onClick={() => setShowPw(!showPw)}>{showPw ? "🙈" : "👁"}</span>
          </div>
        </div>

        <button className="vb-btn-outline" onClick={handleLogin} disabled={loading}>
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>

        {error && <p className="vb-error">{error}</p>}

        <p className="vb-switch-dark">
          Don't have an account? <span onClick={switchToSignup}>SIGN UP</span>
        </p>
      </div>
    </div>
  );
}

// ---------------- SIGNUP ----------------
function SignupForm({ onSuccess, switchToLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    try {
      const payload = {
        email, password, gender,
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
    <div className="vb-page vb-light">
      <div className="vb-panel vb-panel-wide">
        <Logo />

        <h1 className="vb-title-light">START YOUR JOURNEY</h1>

        <div className="vb-step-cards">
          <div className={`vb-step-card ${step === 1 ? "active" : ""}`} onClick={() => setStep(1)}>
            <span className="vb-step-icon">🥑</span>
            <span className="vb-step-label">CHOOSE<br/>YOUR PLAN</span>
          </div>
          <div className={`vb-step-card ${step === 2 ? "active" : ""}`} onClick={() => setStep(2)}>
            <span className="vb-step-icon">⚖️</span>
            <span className="vb-step-label">SET YOUR<br/>GOALS</span>
          </div>
          <div className={`vb-step-card ${step === 3 ? "active" : ""}`} onClick={() => setStep(3)}>
            <span className="vb-step-icon">📊</span>
            <span className="vb-step-label">TRACK<br/>PROGRESS</span>
          </div>
        </div>

        <div className="vb-progress">
          <div className="vb-progress-bar" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        <p className="vb-step-count">STEP {step} OF 3</p>

        {step === 1 && (
  <>
    <div className="vb-field-light">
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div className="vb-field-light">
      <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    <button className="vb-btn-solid" onClick={() => setStep(2)}>NEXT</button>
  </>
)}

        {step === 2 && (
          <>
            <div className="vb-seg-light">
              <button type="button" className={gender === "male" ? "active" : ""} onClick={() => setGender("male")}>Male</button>
              <button type="button" className={gender === "female" ? "active" : ""} onClick={() => setGender("female")}>Female</button>
            </div>
            <div className="vb-row">
              <div className="vb-field-light"><input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} /></div>
              <div className="vb-field-light"><input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
              <div className="vb-field-light"><input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
            </div>
            <div className="vb-field-light">
              <select value={activitylevel} onChange={(e) => setActivitylevel(e.target.value)}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very active</option>
              </select>
            </div>
            <button className="vb-btn-solid" onClick={() => setStep(3)}>NEXT</button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="vb-seg-light vb-seg-three">
              <button type="button" className={goal === "lose" ? "active" : ""} onClick={() => setGoal("lose")}>Lose fat</button>
              <button type="button" className={goal === "maintain" ? "active" : ""} onClick={() => setGoal("maintain")}>Maintain</button>
              <button type="button" className={goal === "gain" ? "active" : ""} onClick={() => setGoal("gain")}>Gain muscle</button>
            </div>
            <button className="vb-btn-solid" onClick={handleSignup} disabled={loading}>
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </>
        )}

        {error && <p className="vb-error">{error}</p>}

        <p className="vb-switch-light">
          ALREADY HAVE AN ACCOUNT? <span onClick={switchToLogin}>LOGIN</span>
        </p>
      </div>
    </div>
  );
}

// ---------------- DASHBOARD ----------------
function Dashboard({ token, userEmail, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [today, setToday] = useState(null);
  const [error, setError] = useState("");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [adding, setAdding] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [editing, setEditing] = useState(false);
const [editForm, setEditForm] = useState(null);
const [savingProfile, setSavingProfile] = useState(false);

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

  async function handleAddFood() {
    if (!foodName || !calories || Number(calories)<=0) return;
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/api/log/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodName, calories: Number(calories) }),
      });
      if (!res.ok) throw new Error("Could not add entry");
      setFoodName("");
      setCalories("");
      await fetchToday(); // refresh the total after adding
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
    await fetchToday();
  } catch (err) {
    setError(err.message);
  }
}

  if (error) {
    return (
      <div className="vb-page vb-light">
        <div className="vb-panel">
          <Logo />
          <p className="vb-error">{error}</p>
          <button className="vb-btn-solid" onClick={onLogout}>LOG OUT</button>
        </div>
      </div>
    );
  }

  if (!profile || !today) {
    return (
      <div className="vb-page vb-light">
        <div className="vb-panel">
          <Logo />
          <p className="vb-subtitle-light">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  function startEdit() {
  setEditForm({
    gender: profile.gender,
    age: profile.age,
    weight: profile.weight,
    height: profile.height,
    activitylevel: profile.activitylevel,
    goal: profile.goal,
  });
  setEditing(true);
}

async function handleSaveProfile() {
  setSavingProfile(true);
  try {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...editForm,
        age: Number(editForm.age),
        weight: Number(editForm.weight),
        height: Number(editForm.height),
      }),
    });
    if (!res.ok) throw new Error("Could not update profile");
    const updated = await res.json();
    setProfile(updated);
    
    await fetchToday();
    setEditing(false);
  } catch (err) {
    setError(err.message);
  } finally {
    setSavingProfile(false);
  }
}

  const circumference = 2 * Math.PI * 58;
  const percent = Math.min(today.caloriesEatenToday / today.targetCalories, 1);
  const dashOffset = circumference * (1 - percent);
  const remaining = Math.max(today.targetCalories - today.caloriesEatenToday, 0);

  return (
    <div className="vb-page vb-light">
      <div className="vb-dash-layout">
        <div className="vb-panel vb-dash-main">
          <div className="vb-dash-header">
            <Logo />
            <button className="vb-logout-chip" onClick={onLogout}>LOG OUT</button>
          </div>

          <p className="vb-dash-greeting">Welcome back, {userEmail}</p>

          <div className="vb-dash-ring-wrap">
            <svg viewBox="0 0 140 140" width="220" height="220">
              <circle cx="70" cy="70" r="58" fill="none" stroke="#EDEDEA" strokeWidth="12" />
              <circle
                cx="70" cy="70" r="58" fill="none" stroke="#4ADE80" strokeWidth="12"
                strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{ filter: "drop-shadow(0 0 6px rgba(74,222,128,0.5))" }}
              />
            </svg>
            <div className="vb-dash-ring-text">
              <span className="vb-dash-ring-num">{today.caloriesEatenToday}</span>
              <span className="vb-dash-ring-unit">kcal eaten</span>
              <span className="vb-dash-ring-sub">{remaining} left of {today.targetCalories}</span>
            </div>
          </div>

          <div className="vb-dash-stats">
            <div className="vb-dash-stat">
              <span className="vb-dash-stat-val">{profile.bmi}</span>
              <span className="vb-dash-stat-label">BMI &middot; {profile.bmiCategory}</span>
            </div>
            <div className="vb-dash-stat">
              <span className="vb-dash-stat-val">{profile.bmr}</span>
              <span className="vb-dash-stat-label">BMR (kcal)</span>
            </div>
            <div className="vb-dash-stat">
              <span className="vb-dash-stat-val" style={{ textTransform: "capitalize" }}>{profile.goal}</span>
              <span className="vb-dash-stat-label">Current goal</span>
            </div>
          </div>

          <div className="vb-add-food">
            <input
              placeholder="Food name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
            />
            <input
  placeholder="Calories"
  type="number"
  min="0"
  value={calories}
  onChange={(e) => {
    const val = e.target.value;
    if (val === "" || Number(val) >= 0) {
      setCalories(val);
    }
  }}
/>
            <button onClick={handleAddFood} disabled={adding}>
              {adding ? "Adding..." : "Add"}
            </button>
            </div>
         <button className="vb-toggle-log" onClick={() => setShowLog(!showLog)}>
            {showLog ? "Hide today's log ▲" : "Show today's log ▼"}
          </button>

          {showLog && (
            <div className="vb-log-list">
              {today.entries.length === 0 && (
                <p className="vb-log-empty">No entries logged today yet</p>
              )}
              {today.entries.map((entry) => (
                <div key={entry.id} className="vb-log-row">
                  <span className="vb-log-name">{entry.foodName}</span>
                  <span className="vb-log-cal">{entry.calories} kcal</span>
                  <button className="vb-log-delete" onClick={() => handleDelete(entry.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="vb-panel vb-dash-side">
          <div className="vb-side-header">
            <h2 className="vb-dash-side-title">Your profile</h2>
            {!editing && (
              <button className="vb-edit-link" onClick={startEdit}>Edit</button>
            )}
          </div>

          {!editing ? (
            <>
              <div className="vb-profile-row"><span>Gender</span><b style={{ textTransform: "capitalize" }}>{profile.gender}</b></div>
              <div className="vb-profile-row"><span>Age</span><b>{profile.age} yrs</b></div>
              <div className="vb-profile-row"><span>Weight</span><b>{profile.weight} kg</b></div>
              <div className="vb-profile-row"><span>Height</span><b>{profile.height} cm</b></div>
              <div className="vb-profile-row"><span>Activity</span><b style={{ textTransform: "capitalize" }}>{profile.activitylevel.replace("_", " ")}</b></div>
              <div className="vb-profile-row"><span>Goal</span><b style={{ textTransform: "capitalize" }}>{profile.goal}</b></div>
            </>
          ) : (
            <div className="vb-edit-form">
              <div className="vb-seg-light">
                <button type="button" className={editForm.gender === "male" ? "active" : ""} onClick={() => setEditForm({ ...editForm, gender: "male" })}>Male</button>
                <button type="button" className={editForm.gender === "female" ? "active" : ""} onClick={() => setEditForm({ ...editForm, gender: "female" })}>Female</button>
              </div>

              <label className="vb-edit-label">Age</label>
              <input type="number" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} />

              <label className="vb-edit-label">Weight (kg)</label>
              <input type="number" value={editForm.weight} onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })} />

              <label className="vb-edit-label">Height (cm)</label>
              <input type="number" value={editForm.height} onChange={(e) => setEditForm({ ...editForm, height: e.target.value })} />

              <label className="vb-edit-label">Activity level</label>
              <select value={editForm.activitylevel} onChange={(e) => setEditForm({ ...editForm, activitylevel: e.target.value })}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very active</option>
              </select>

              <label className="vb-edit-label">Goal</label>
              <div className="vb-seg-light vb-seg-three">
                <button type="button" className={editForm.goal === "lose" ? "active" : ""} onClick={() => setEditForm({ ...editForm, goal: "lose" })}>Lose</button>
                <button type="button" className={editForm.goal === "maintain" ? "active" : ""} onClick={() => setEditForm({ ...editForm, goal: "maintain" })}>Maintain</button>
                <button type="button" className={editForm.goal === "gain" ? "active" : ""} onClick={() => setEditForm({ ...editForm, goal: "gain" })}>Gain</button>
              </div>

              <div className="vb-edit-actions">
                <button className="vb-btn-solid" onClick={handleSaveProfile} disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save"}
                </button>
                <button className="vb-btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
