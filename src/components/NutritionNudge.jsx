export function NutritionNudge() {
  const tips = [
    "* Eat a balanced diet with protein, carbs, healthy fats, fruits, and vegetables.",
    "* Get enough protein throughout the day to support body function and muscle health.",
    "* Choose nutrient-rich carbs like whole grains, fruits, vegetables, and beans.",
    "* Prefer healthy fats from nuts, seeds, fish, and plant-based oils.",
    "* Watch overall calories and portions, as individual needs vary.",
    "* Stay hydrated and focus on overall diet quality rather than one specific macro ratio.",
  ];

  return (
    <div className="hb-nudge">
      <span className="hb-nudge-title">General nutrition tips</span>
      {tips.map((tip, i) => (
        <div className="hb-nudge-row" key={i}>
          <span className="hb-nudge-dot" />
          {tip}
        </div>
      ))}
    </div>
  );
}
