import React from "react";
import { Wifi, Filter, Clock, Users, Gauge, TrendingUp } from "lucide-react";
import "../styles/Sidebar.css";

function Sidebar({ statistics, lastUpdated, onFilterChange, activeFilter }) {
  const statusOptions = [
    { value: "all", label: "All", count: statistics?.total ?? 0 },
    { value: "idle", label: "Idle", count: statistics?.idle ?? 0 },
    { value: "moving", label: "En Route", count: statistics?.moving ?? 0 },
    { value: "delivered", label: "Delivered", count: statistics?.delivered ?? 0 },
  ];

  return (
    <aside className="sidebar">
      {/* Live Updates Banner */}
      <div className="live-updates-banner">
        <Wifi size={18} className="wifi-icon" />
        <span className="live-updates-text">Live Updates Active</span>
      </div>

      {/* Filter by Status Section */}
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
                data-status={option.value}
                className={`filter-button ${isActive ? "active" : ""}`}
                onClick={() => onFilterChange(option.value)}
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

      {/* Divider Line */}
      <div className="sidebar-divider" />

      {/* Fleet Statistics Section */}
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
                <div className="stat-value">{statistics.averageSpeed?.toFixed(0) ?? 0}</div>
                <div className="stat-label">
                  <Gauge size={14} className="stat-icon" />
                  AVG SPEED
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-value">{statistics.moving ?? 0}</div>
                <div className="stat-label">
                  <TrendingUp size={14} className="stat-icon" />
                  MOVING
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-value">{lastUpdated}</div>
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

      {/* Footer with Update Info */}
      <div className="sidebar-footer">
        <div className="last-updated">
          <Clock size={16} className="update-icon" />
          <div className="update-text">
            <span>Updated {lastUpdated} • Next update in ~3 minutes</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;