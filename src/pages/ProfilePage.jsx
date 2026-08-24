import { useState } from "react";
import { API_BASE } from "../api";

export function ProfilePage({ token, profile, setProfile, refreshToday }) {
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
