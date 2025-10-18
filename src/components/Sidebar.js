import React from "react"
import { Wifi, Filter, Clock, Users, Gauge, TrendingUp } from "lucide-react"
import "../styles/Sidebar.css"

function Sidebar({ statistics, lastUpdated, onFilterChange, activeFilter }) {
  const statusOptions = [
    { value: "all", label: "All", count: statistics?.total || 25 },
    { value: "idle", label: "Idle", count: statistics?.idle || 6 },
    { value: "moving", label: "En Route", count: statistics?.moving || 1 },
    { value: "delivered", label: "Delivered", count: statistics?.delivered || 18 },
  ]

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
            return (
              <button
                key={option.value}
                className={`filter-button ${activeFilter === option.value ? "active" : ""}`}
                onClick={() => onFilterChange(option.value)}
              >
                <div className="filter-content">
                  <span className="filter-label">{option.label}</span>
                  <span className="filter-count">( {option.count} )</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider Line */}
      <div className="sidebar-divider"></div>

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
                <div className="stat-value">{statistics.total || 25}</div>
                <div className="stat-label">
                  <Users size={14} className="stat-icon" />
                  TOTAL FLEET
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{statistics.averageSpeed?.toFixed(0) || 3}</div>
                <div className="stat-label">
                  <Gauge size={14} className="stat-icon" />
                  AVG SPEED
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{statistics.moving || 1}</div>
                <div className="stat-label">
                  <TrendingUp size={14} className="stat-icon" />
                  MOVING
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">14:40</div>
                <div className="stat-label">
                  <Clock size={14} className="stat-icon" />
                  LAST UPDATE
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="stats-loading">
            <div className="loading-spinner-small"></div>
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
  )
}

export default Sidebar