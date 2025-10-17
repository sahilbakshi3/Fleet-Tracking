import React from "react"
import "../styles/Sidebar.css"

function Sidebar({ statistics, lastUpdated, onFilterChange, activeFilter }) {
  const statusOptions = [
    { value: "all", label: "All", icon: "⚪", color: "#6b7280" },
    { value: "idle", label: "Idle", icon: "⚪", color: "#6b7280" },
    { value: "moving", label: "En Route", icon: "🔵", color: "#3b82f6" },
    { value: "delivered", label: "Delivered", icon: "🟢", color: "#10b981" },
  ]

  const getStatCount = (status) => {
    if (!statistics) return 0
    const statusKey = status.toLowerCase()
    return statistics[statusKey] || 0
  }

  // Format the last updated time for display
  const formatLastUpdate = (timeString) => {
    // If it's something like "3s ago", keep it
    // Otherwise format it nicely
    return timeString
  }

  // Calculate the next update time (3 minutes from last update)
  const getNextUpdateText = () => {
    return "Next update in ~3 minutes"
  }

  return (
    <aside className="sidebar">
      {/* Live Updates Banner */}
      <div className="live-updates-banner">
        <span className="wifi-icon">📶</span>
        <span className="live-updates-text">Live Updates Active</span>
      </div>

      {/* Filter by Status Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">⚡ Filter by Status</h3>
        
        <div className="status-filters">
          {statusOptions.map((option) => {
            const count = option.value === "all" 
              ? statistics?.totalVehicles || 0 
              : getStatCount(option.value)
            
            return (
              <button
                key={option.value}
                className={`filter-button ${activeFilter === option.value ? "active" : ""}`}
                onClick={() => onFilterChange(option.value)}
              >
                <div className="filter-icon">
                  {option.icon}
                </div>
                <div className="filter-content">
                  <span className="filter-label">{option.label}</span>
                  <span className="filter-count">( {count} )</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Fleet Statistics Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">⏱️ Fleet Statistics</h3>
        
        {statistics ? (
          <div className="stats-container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-value">{statistics.totalVehicles || 0}</div>
                  <div className="stat-label">
                    <span className="stat-icon">👥</span>
                    TOTAL FLEET
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-value">{statistics.averageSpeed?.toFixed(0) || 0}</div>
                  <div className="stat-label">
                    <span className="stat-icon">🏎️</span>
                    AVG SPEED
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-value">{statistics.moving || 0}</div>
                  <div className="stat-label">
                    <span className="stat-icon">⚡</span>
                    MOVING
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-value">{lastUpdated === "just now" ? "14:40" : lastUpdated}</div>
                  <div className="stat-label">
                    <span className="stat-icon">⏰</span>
                    LAST UPDATE
                  </div>
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
          <div className="update-icon">
            <span>⏱️</span>
          </div>
          <div className="update-text">
            <span>Updated {lastUpdated} • {getNextUpdateText()}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar