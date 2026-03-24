interface TopbarProps {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
  showSponsor?: boolean;
}

export default function Topbar({
  title,
  subtitle,
  onMenuClick,
  showSponsor = false,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Open sidebar">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="brand-logo-box">Logo</div>
        {showSponsor && <div className="sponsor-box">Sponsors / Partners</div>}
      </div>
    </header>
  );
}