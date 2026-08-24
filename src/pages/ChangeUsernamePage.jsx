import { useState } from "react";
import { API_BASE } from "../api";

export function ChangeUsernamePage({ token, profile, setProfile }) {
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
