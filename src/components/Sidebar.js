import React, { useEffect, useState } from "react";
import { Wifi, Filter, Clock, Users, Gauge, TrendingUp } from "lucide-react";
import "../styles/Sidebar.css";

function Sidebar({
  statistics,
  lastUpdated,    // human-friendly (e.g., "6s ago")
  lastUpdatedAt,  // numeric ms (used to format HH:MM and calculate next update)
  onFilterChange,
  activeFilter,   // fully controlled by parent
}) {
  // default update frequency (ms) — 3 minutes
  const UPDATE_FREQUENCY_MS = 3 * 60 * 1000;

  // Format numeric timestamp to HH:MM (24-hour).
  const formatTime = (timestamp) => {
    if (!timestamp) return "—";
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return "—";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Remaining time state for "next update in ..."
  const [nextRemainingMs, setNextRemainingMs] = useState(() => {
    if (!lastUpdatedAt) return null;
    const elapsed = Date.now() - Number(lastUpdatedAt);
    return Math.max(0, UPDATE_FREQUENCY_MS - elapsed);
  });

  // Keep remaining time updated every second
  useEffect(() => {
    if (!lastUpdatedAt) {
      setNextRemainingMs(null);
      return;
    }

    const tick = () => {
      const elapsed = Date.now() - Number(lastUpdatedAt);
      const remaining = Math.max(0, UPDATE_FREQUENCY_MS - elapsed);
      setNextRemainingMs(remaining);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastUpdatedAt]);

  const formatRemaining = (ms) => {
    if (ms == null) return "~3 minutes";
    if (ms <= 0) return "now";
    const totalSeconds = Math.ceil(ms / 1000);
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (seconds === 0) return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
  };

  const statusOptions = [
    { value: "all", label: "All", count: statistics?.total ?? 0 },
    { value: "idle", label: "Idle", count: statistics?.idle ?? 0 },
    { value: "en_route", label: "En-Route", count: statistics?.moving ?? 0 },
    { value: "delivered", label: "Delivered", count: statistics?.delivered ?? 0 },
  ];

  const handleClick = (value) => {
    if (typeof onFilterChange === "function") {
      onFilterChange(value);
    }
  };

  return (
    <aside className="sidebar">
      <div className="live-updates-banner">
        <Wifi size={18} className="wifi-icon" />
        <span className="live-updates-text">Live Updates Active</span>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <Filter size={16} />
          Filter by Status
        </h3>

        <div className="status-filters">
          {statusOptions.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                data-status={option.value}
                className={`filter-button ${isActive ? "active" : ""}`}
                onClick={() => handleClick(option.value)}
                aria-pressed={isActive}
              >
                <div className="filter-content">
                  <span className="filter-label">{option.label}</span>
                  <span className="filter-count">( {option.count} )</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <Clock size={16} />
          Fleet Statistics
        </h3>

        {statistics ? (
          <div className="stats-container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{statistics.total ?? 0}</div>
                <div className="stat-label">
                  <Users size={14} className="stat-icon" />
                  TOTAL FLEET
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-value">
                  {/* prefer API-provided averageSpeed (hook maps average_speed -> averageSpeed) */}
                  {typeof statistics.averageSpeed === "number"
                    ? Math.round(statistics.averageSpeed)
                    : 0}
                </div>
                <div className="stat-label">
                  <Gauge size={14} className="stat-icon" />
                  AVG SPEED
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-value">{statistics.moving ?? 0}</div>
                <div className="stat-label">
                  <TrendingUp size={14} className="stat-icon" />
                  EN-ROUTE
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-value">
                  {lastUpdatedAt
                    ? formatTime(lastUpdatedAt)
                    : typeof lastUpdated === "string"
                    ? lastUpdated
                    : "—"}
                </div>
                <div className="stat-label">
                  <Clock size={14} className="stat-icon" />
                  LAST UPDATE
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="stats-loading">
            <div className="loading-spinner-small" />
            <span>Loading stats...</span>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="last-updated">
          <Clock size={16} className="update-icon" />
          <div className="update-text">
            <span>
              Updated {lastUpdated} • Next update in {formatRemaining(nextRemainingMs)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
