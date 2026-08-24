import { useState } from "react";
import { API_BASE } from "../api";

export function ChangePasswordPage({ token }) {
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
