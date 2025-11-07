import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <header className="page-header">
      {/* Optional emoji icon — remove the span if you don't want an icon */}
      <div className="page-header-left">
        {/* <span className="header-icon" aria-hidden="true">🚛</span> */}
        <div>
          <h1 className="header-title">🚛 Fleet Tracking Dashboard</h1>
          <p className="header-subtitle">Real-time vehicle monitoring</p>
        </div>
      </div>

      {/* Right side can host actions (e.g. Live Updates button) if needed */}
      <div className="page-header-right" aria-hidden="true">
        {/* keep empty or add buttons here */}
      </div>
    </header>
  );
}

export default Header;
