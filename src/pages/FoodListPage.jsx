import { useState,useEffect } from "react";
import { API_BASE } from "../api";

export function FoodListPage({ token, today, refreshToday }) {
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
      setSearchedOnce(false);
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
      setSearchedOnce(false);
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
