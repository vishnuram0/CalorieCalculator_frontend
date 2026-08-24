import { useState, useEffect } from "react";
import { API_BASE } from "../api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  Flame,
  Target,
  Beef,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export function WeeklyReportPage({ token }) {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  async function fetchReport() {
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/reports/weekly`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAiInsights(data);
    } catch {
      setAiInsights({
        available: false,
        summary: null,
      });
    } finally {
      setAiLoading(false);
    }
  }

  if (error) return <p className="vb-error">{error}</p>;

  if (!report)
    return <p className="vb-subtitle-light">Loading your weekly report...</p>;

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const chartData = report.days.map((d) => ({
    day: dayLabels[new Date(d.date).getDay()],
    Actual: d.logged ? d.calories : null,
    Target: d.targetCalories,
  }));

  return (
    <div className="weekly-dashboard">
      {/* Header */}

      <div className="weekly-header">
        <div>
          <h2 className="hb-page-title">Weekly Nutrition Report</h2>

          <p className="vb-subtitle-light">
            {report.weekStart} – {report.weekEnd} · {report.daysLogged} of 7
            days logged
          </p>
        </div>
      </div>

      {/* KPI Cards */}

      <div className="weekly-kpi-grid">
        <KPICard
          icon={<Flame size={20} />}
          title="Average Calories"
          value={report.averageCalories}
          sub={`Target ${report.targetCalories}`}
          progress={Math.min(
            (report.averageCalories / report.targetCalories) * 100,
            100
          )}
        />

        <KPICard
          icon={<Target size={20} />}
          title="Target Hit"
          value={`${report.calorieTargetSuccessRate}%`}
          sub="Weekly consistency"
          progress={report.calorieTargetSuccessRate}
        />

        <KPICard
          icon={<Beef size={20} />}
          title="Average Protein"
          value={`${report.averageProtein}g`}
          sub={`Target ${report.targetProtein}g`}
          progress={Math.min(
            (report.averageProtein / report.targetProtein) * 100,
            100
          )}
        />

        <KPICard
          icon={<TrendingUp size={20} />}
          title="Protein Goal"
          value={`${report.proteinTargetSuccessRate}%`}
          sub="Weekly achievement"
          progress={report.proteinTargetSuccessRate}
          highlight
        />
      </div>

      {/* Chart + Insights */}

      <div className="weekly-main-grid">
        <div className="dashboard-card chart-card">
          <div className="card-head">
            <div>
              <h3>7-Day Calorie Trend</h3>

              <p>Actual vs Target</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="Target"
                stroke="#94A3B8"
                strokeDasharray="6 4"
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="Actual"
                stroke="#2563EB"
                strokeWidth={3}
                connectNulls={false}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card insight-card">
          <div className="card-head">
            <h3>Weekly Insights</h3>
          </div>

          {report.progressNotes?.length ? (
            report.progressNotes.map((note, i) => (
              <div className="insight-item" key={i}>
                <Sparkles size={16} />

                <span>{note}</span>
              </div>
            ))
          ) : (
            <p className="vb-subtitle-light">
              Log more days to unlock meaningful weekly insights.
            </p>
          )}
        </div>
      </div>

      {/* Table */}

      <div className="dashboard-card table-card">
        <div className="card-head">
          <h3>7-Day Breakdown</h3>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Actual</th>
                <th>Target</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
                <th>Fiber</th>
              </tr>
            </thead>

            <tbody>
              {report.days.map((d) => (
                <tr key={d.date}>
                  <td>
                    {dayLabels[new Date(d.date).getDay()]} {d.date.slice(5)}
                  </td>

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
      </div>

      {/* AI Insights */}

      <div className="dashboard-card ai-card">
        <div className="card-head">
          <h3>AI Nutrition Insights</h3>
        </div>

        {!aiInsights && (
          <>
            <p className="vb-subtitle-light">
              Generate a personalized weekly summary from your logged nutrition
              data.
            </p>

            <button
              className="hb-btn-primary"
              onClick={handleGetAiInsights}
              disabled={aiLoading}
            >
              {aiLoading ? "Analyzing..." : "Generate AI Insights"}
            </button>
          </>
        )}

        {aiInsights?.available && (
          <p style={{ lineHeight: 1.8 }}>{aiInsights.summary}</p>
        )}

        {aiInsights && !aiInsights.available && (
          <p className="vb-subtitle-light">
            AI insights are temporarily unavailable.
          </p>
        )}
      </div>
    </div>
  );
}

function KPICard({
  icon,
  title,
  value,
  sub,
  progress,
  highlight = false,
}) {
  return (
    <div className={`weekly-kpi-card ${highlight ? "highlight" : ""}`}>
      <div className="kpi-icon">{icon}</div>

      <div className="kpi-label">{title}</div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-sub">{sub}</div>

      <div className="kpi-progress">
        <div
          className="kpi-progress-fill"
          style={{ width: `${Math.min(progress || 0, 100)}%` }}
        />
      </div>
    </div>
  );
}