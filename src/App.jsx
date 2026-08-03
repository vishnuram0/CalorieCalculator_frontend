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
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Session expired, please log in again");
        const text = await res.text();
        setProfile(text);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchMe();
  }, [token]);

  return (
    <div className="vb-page vb-light">
      <div className="vb-panel">
        <Logo />
        <h1 className="vb-title-light">WELCOME, {userEmail.toUpperCase()}</h1>
        <p className="vb-subtitle-light">{profile || error || "Loading..."}</p>
        <button className="vb-btn-solid" onClick={onLogout}>LOG OUT</button>
      </div>
    </div>
  );
}

export default App;
