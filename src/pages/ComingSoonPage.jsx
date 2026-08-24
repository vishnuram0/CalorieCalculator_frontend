export function ComingSoonPage({ title }) {
  return (
    <div className="hb-card hb-coming-soon">
      <span className="hb-coming-icon">🚧</span>
      <h3>{title}</h3>
      <p>This feature isn't built yet — it's reserved space for a future update.</p>
    </div>
  );
}

export default ComingSoonPage;
