export function NutritionNudge({ today }) {
  if (!today) return null;
  const { proteinLow, fiberLow } = today;
  if (!proteinLow && !fiberLow) return null;

  let message = "";
  if (proteinLow && fiberLow) message = "Try to take protein and fibre";
  else if (proteinLow) message = "Try to take protein";
  else if (fiberLow) message = "Try to take fibre";

    return (
    <div className="hb-nudge">
      <span className="hb-nudge-title">Nutrition tip</span>
      <div className="hb-nudge-row">
        <span className="hb-nudge-dot" />
        {message}
      </div>
    </div>
  );
}
