import { StreakCard } from "../components/StreakCard";

export function DashboardHome({ profile, today }) {
const remaining = Math.round(Math.max(today.targetCalories - today.caloriesEatenToday, 0) * 10) / 10;
  const circumference = 2 * Math.PI * 70;
  const percent = Math.min(today.caloriesEatenToday / today.targetCalories, 1);
  const dashOffset = circumference * (1 - percent);



const macroRings = [
  {
    label: "Protein",
    consumed: today.proteinToday,
    target: profile.proteinGrams,
    color: "#2563EB",
    message: "Try to take it from whole food",
  },
  {
    label: "Carbs",
    consumed: today.carbsToday,
    target: profile.carbsGrams,
    color: "#F59E0B",
    message: "Carbs are the fuel for our energy",
  },
  {
    label: "Fat",
    consumed: today.fatToday,
    target: profile.fatGrams,
    color: "#EF4444",
    message: "Take it from good fat",
  },
  {
    label: "Fiber",
    consumed: today.fiberToday,
    target: profile.fiberGrams,
    color: "#10B981",
    message: "Fiber keeps digestion steady — add it gradually",
  },
];
      return (
    <div>
      <div className="hb-dashboard-grid">
      <div className="hb-dashboard-main">
      <div className="hb-stat-grid">
        <div className="hb-stat-card">
          <span className="hb-stat-label">BMI</span>
          <span className="hb-stat-value">{profile.bmi}</span>
          <span className="hb-stat-sub">{profile.bmiCategory}</span>
        </div>
        <div className="hb-stat-card">
          <span className="hb-stat-label">Target calories</span>
          <span className="hb-stat-value">{today.targetCalories}</span>
          <span className="hb-stat-sub">kcal / day</span>
        </div>
        <div className="hb-stat-card">
          <span className="hb-stat-label">Consumed</span>
          <span className="hb-stat-value">{today.caloriesEatenToday}</span>
          <span className="hb-stat-sub">kcal today</span>
        </div>
        <div className="hb-stat-card hb-stat-highlight">
          <span className="hb-stat-label">Remaining</span>
          <span className="hb-stat-value">{remaining}</span>
          <span className="hb-stat-sub">kcal left</span>
        </div>
      </div>

<div className="hb-progress-card">
        <div className="hb-ring-wrap">
          <svg viewBox="0 0 170 170" width="200" height="200">
            <circle cx="85" cy="85" r="70" fill="none" stroke="#EEF0F6" strokeWidth="14" />
            <circle
              cx="85" cy="85" r="70" fill="none" stroke="#2563EB" strokeWidth="14"
              strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
              transform="rotate(-90 85 85)"
            />
          </svg>
          <div className="hb-ring-text">
            <span className="hb-ring-num">{today.caloriesEatenToday} / {today.targetCalories}</span>
            <span className="hb-ring-unit">kcal</span>
          </div>
        </div>
                <p className="hb-progress-caption">You're {Math.round(percent * 100)}% toward today's goal</p>
      </div>

      <div className="hb-macro-ring-grid">
        {macroRings.map((macro) => {
          const circumference = 2 * Math.PI * 40;
          const percent = macro.target > 0 ? Math.min(macro.consumed / macro.target, 1) : 0;
          const dashOffset = circumference * (1 - percent);

          return (
           <div key={macro.label} className="hb-macro-ring-card">
  <div className="hb-macro-ring-wrap">
    <svg viewBox="0 0 100 100" width="100" height="100">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#EEF0F6" strokeWidth="8" />
      <circle
        cx="50" cy="50" r="40" fill="none" stroke={macro.color} strokeWidth="8"
        strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="hb-macro-ring-value-inside">
      <span>{macro.consumed}g</span>
      <small>/ {macro.target}g</small>
    </div>
  </div>
  <div className="hb-macro-ring-label">{macro.label}</div>
  <div className="hb-macro-ring-message">{macro.message}</div>
</div>
          );
        })}
      </div>
      </div>

      <div className="hb-dashboard-side">
        <StreakCard today={today} />
      </div>
      </div>
      
  

      

     
    </div>
  );
}
     
