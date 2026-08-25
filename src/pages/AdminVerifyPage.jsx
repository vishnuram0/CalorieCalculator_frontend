import { useState, useEffect } from "react";
import { API_BASE } from "../api";

export function AdminVerifyPage({ token }) {
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
    async function handleDelete(id, foodName) {
    if (!window.confirm(`Delete "${foodName}"? This can't be undone.`)) return;
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/foods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not delete food");
      if (editingId === id) {
        setEditingId(null);
        setEditForm(null);
      }
      await fetchPending();
    } catch (err) {
      setError(err.message);
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
                <button className="hb-nav-logout" style={{ marginTop: 0 }} onClick={() => handleDelete(editingId, editForm.foodName)}>🗑 Remove</button>
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
                            <div style={{ display: "flex", gap: 8 }}>
                <button className="hb-btn-primary" onClick={() => startEdit(food)}>Review</button>
                <button className="hb-nav-logout" style={{ marginTop: 0 }} onClick={() => handleDelete(food.id, food.foodName)}>🗑 Remove</button>
              </div>
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
