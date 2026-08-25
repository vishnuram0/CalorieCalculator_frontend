import { NutritionNudge } from "./NutritionNudge";
export function StreakCard({ today }) {
  if (!today) return null;
  const current = today.currentStreak || 0;
  const longest = today.longestStreak || 0;
  const completed = today.goalCompletedToday;
  const percent = Math.min(Math.round(today.completionPercent || 0), 999);

  return (
    <div className={`hb-streak-card ${completed ? "hb-streak-card-active" : ""}`}>
      <div className="hb-streak-flame">
        <svg width="30" height="30" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="hbFlameGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={completed ? "#EF4444" : "#D1D5DB"} />
              <stop offset="100%" stopColor={completed ? "#F59E0B" : "#9CA3AF"} />
            </linearGradient>
          </defs>
          <path
            fill="url(#hbFlameGrad)"
            d="M12.5 1.2c.6 2.8-.3 4.6-2 6.4-2.3 2.4-3.7 4.6-3.7 7.3 0 3.9 3.2 7.1 7.1 6.9 4.1-.2 6.8-3.4 6.6-7.3-.1-2.6-1.6-4.2-3.2-5.7-.4-.4-.9.1-.7.6.6 1.6.4 3-.7 4-.7.6-1.6-.1-1.4-1 .5-2-.1-4-1.4-5.6-1-1.2-1.1-2.9-.6-5.6.1-.5-.5-.9-1-.4-3 2.7-4.8 5.6-4.8 8.9 0 1.4.4 2.7 1 3.8.3.5-.3 1-.8.7-1.6-1-2.6-2.8-2.6-4.9 0-3.7 2.5-6.9 5.9-8.3.4-.2.9.1.8.5-.2 1-.3 1.9-.1 2.7z"
          />
        </svg>
      </div>
      <div className="hb-streak-info">
        <div className="hb-streak-numbers">
          <span className="hb-streak-current">{current}</span>
          <span className="hb-streak-unit">day{current === 1 ? "" : "s"} streak</span>
        </div>
        <div className="hb-streak-sub">
          Longest: {longest} day{longest === 1 ? "" : "s"}
        </div>
        <div className="hb-streak-progress-track">
          <div className="hb-streak-progress-fill" style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
        <div className="hb-streak-percent">{percent}% of today's goal</div>
      </div>
      {completed && <span className="hb-streak-badge">Complete</span>}
      <NutritionNudge />
    </div>
  );
}
