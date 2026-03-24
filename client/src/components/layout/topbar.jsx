import React from "react";

export default function Topbar({
  title,
  subtitle,
  onMenuClick,
  logoText = "Logo",
  showSponsor = false,
  sponsorText = "Sponsors / Partners",
  rightContent = null,
}) {
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
        {rightContent ? (
          rightContent
        ) : (
          <>
            <div className="brand-logo-box">{logoText}</div>
            {showSponsor && <div className="sponsor-box">{sponsorText}</div>}
          </>
        )}
      </div>
    </header>
  );
}