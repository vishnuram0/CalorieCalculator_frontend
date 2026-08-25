import { useState } from "react";
import { API_BASE } from "../api";

export function SignupForm({ switchToLogin, onNeedsVerification }) {
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
      onNeedsVerification(email,password);
      
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
