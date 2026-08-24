import { useState, useEffect } from "react";
import { API_BASE } from "../api";

export function WeeklyReportPage({ token }) {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  async function fetchReport() {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/reports/weekly`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not load weekly report");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchReport();
  }, []);

  async function handleGetAiInsights() {
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reports/weekly/ai-analysis`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAiInsights(data);
    } catch {
      setAiInsights({ available: false, summary: null });
    } finally {
      setAiLoading(false);
    }
  }

  if (error) return <p className="vb-error">{error}</p>;
  if (!report) return <p className="vb-subtitle-light">Loading your weekly report...</p>;

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div>
      <h2 className="hb-page-title">Weekly Nutrition Report</h2>
      <p className="vb-subtitle-light" style={{ marginBottom: 16 }}>
        {report.weekStart} to {report.weekEnd} · {report.daysLogged} of 7 days logged
      </p>

      <div className="hb-stat-grid">
        <div className="hb-stat-card">
          <span className="hb-stat-label">Avg calories</span>
          <span className="hb-stat-value">{report.averageCalories}</span>
          <span className="hb-stat-sub">target {report.targetCalories}</span>
        </div>
        <div className="hb-stat-card">
          <span className="hb-stat-label">Calorie target hit</span>
          <span className="hb-stat-value">{report.calorieTargetSuccessRate}%</span>
          <span className="hb-stat-sub">of the week</span>
        </div>
        <div className="hb-stat-card">
          <span className="hb-stat-label">Avg protein</span>
          <span className="hb-stat-value">{report.averageProtein}g</span>
          <span className="hb-stat-sub">target {report.targetProtein}g</span>
        </div>
        <div className="hb-stat-card hb-stat-highlight">
          <span className="hb-stat-label">Protein target hit</span>
          <span className="hb-stat-value">{report.proteinTargetSuccessRate}%</span>
          <span className="hb-stat-sub">of the week</span>
        </div>
      </div>

      <div className="hb-preview-card" style={{ marginTop: 20 }}>
        <p className="hb-preview-heading">7-day summary</p>
        <table className="hb-table">
          <thead>
            <tr>
              <th>Day</th><th>Calories</th><th>Target</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Fiber</th>
            </tr>
          </thead>
          <tbody>
            {report.days.map((d) => (
              <tr key={d.date}>
                <td>{dayLabels[new Date(d.date).getDay()]} {d.date.slice(5)}</td>
                <td>{d.logged ? d.calories : "—"}</td>
                <td>{d.targetCalories}</td>
                <td>{d.logged ? `${d.protein}g` : "—"}</td>
                <td>{d.logged ? `${d.carbs}g` : "—"}</td>
                <td>{d.logged ? `${d.fat}g` : "—"}</td>
                <td>{d.logged ? `${d.fiber}g` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {report.progressNotes && report.progressNotes.length > 0 && (
        <div className="hb-preview-card" style={{ marginTop: 20 }}>
          <p className="hb-preview-heading">Progress analysis</p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.7 }}>
            {report.progressNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="hb-preview-card" style={{ marginTop: 20 }}>
        <p className="hb-preview-heading">AI insights</p>
        {!aiInsights && (
          <>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
              Get a personalized summary of your week based only on your logged data.
            </p>
            <button className="hb-btn-primary" onClick={handleGetAiInsights} disabled={aiLoading}>
              {aiLoading ? "Analyzing..." : "Generate AI insights"}
            </button>
          </>
        )}
        {aiInsights && aiInsights.available && (
          <p style={{ fontSize: 13.5, lineHeight: 1.7 }}>{aiInsights.summary}</p>
        )}
        {aiInsights && !aiInsights.available && (
          <p className="vb-subtitle-light">
            AI insights are temporarily unavailable. Your nutrition statistics above are still accurate.
          </p>
        )}
      </div>
    </div>
  );
}