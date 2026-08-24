export function Logo({ dark }) {
  return (
    <div className="vb-logo">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={dark ? "#4ADE80" : "#0F6E56"} strokeWidth="1.8">
        <path d="M12 21c-4-2-7-5.5-7-10a7 7 0 0 1 14 0c0 4.5-3 8-7 10z" />
        <path d="M12 21V9" />
      </svg>
      <span className={dark ? "vb-logo-dark" : "vb-logo-light"}>
        VITAL <b>BALANCE</b>
      </span>
    </div>
  );
}
