import React from "react"
import "../styles/Sidebar.css"

function Sidebar({ statistics, lastUpdated, onFilterChange, activeFilter }) {
  const statusOptions = [
    { value: "all", label: "All Vehicles", icon: "🚛", color: "#6b7280" },
    { value: "moving", label: "Moving", icon: "🟢", color: "#10b981" },
    { value: "idle", label: "Idle", icon: "🟡", color: "#f59e0b" },
    { value: "delivered", label: "Delivered", icon: "🟣", color: "#8b5cf6" },
    { value: "maintenance", label: "Maintenance", icon: "🔴", color: "#ef4444" },
  ]

  const getStatCount = (status) => {
    if (!statistics) return 0
    const statusKey = status.toLowerCase()
    return statistics[statusKey] || 0
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Live Status Updates</h3>
          <div className="pulse-indicator">
            <span className="pulse-dot"></span>
          </div>
        </div>
        
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
                style={{
                  ...(activeFilter === option.value && {
                    backgroundColor: option.color,
                    borderColor: option.color,
                  })
                }}
              >
                <span className="filter-icon">{option.icon}</span>
                <div className="filter-content">
                  <span className="filter-label">{option.label}</span>
                  <span className="filter-count">{count}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Fleet Stats</h3>
        
        {statistics ? (
          <div className="stats-container">
            <div className="stats-grid">
              <div className="stat-card stat-card-primary">
                <div className="stat-icon-wrapper" style={{ backgroundColor: "#dbeafe" }}>
                  <span className="stat-icon">🚛</span>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Total Vehicles</div>
                  <div className="stat-value">{statistics.totalVehicles || 0}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: "#d1fae5" }}>
                  <span className="stat-icon">🟢</span>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Moving</div>
                  <div className="stat-value stat-moving">{statistics.moving || 0}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: "#fef3c7" }}>
                  <span className="stat-icon">🟡</span>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Idle</div>
                  <div className="stat-value stat-idle">{statistics.idle || 0}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: "#e9d5ff" }}>
                  <span className="stat-icon">🟣</span>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Delivered</div>
                  <div className="stat-value stat-delivered">{statistics.delivered || 0}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: "#fee2e2" }}>
                  <span className="stat-icon">🔴</span>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Maintenance</div>
                  <div className="stat-value stat-maintenance">{statistics.maintenance || 0}</div>
                </div>
              </div>
              
              <div className="stat-card stat-card-highlight">
                <div className="stat-icon-wrapper" style={{ backgroundColor: "#ddd6fe" }}>
                  <span className="stat-icon">⚡</span>
                </div>
                <div className="stat-info">
                  <div className="stat-label">Avg Speed</div>
                  <div className="stat-value">{statistics.averageSpeed?.toFixed(1) || 0} <span className="stat-unit">mph</span></div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="stats-summary">
              <div className="summary-item">
                <span className="summary-label">Active Routes</span>
                <span className="summary-value">{(statistics.moving || 0) + (statistics.idle || 0)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item">
                <span className="summary-label">Completed</span>
                <span className="summary-value">{statistics.delivered || 0}</span>
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

      <div className="sidebar-footer">
        <div className="last-updated">
          <div className="update-icon">
            <span className="update-dot"></span>
          </div>
          <div className="update-text">
            <span className="update-label">Last Updated</span>
            <span className="update-time">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar