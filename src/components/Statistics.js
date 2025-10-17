import "../styles/Statistics.css"

function Statistics({ statistics, loading }) {
  if (loading || !statistics) {
    return (
      <div className="statistics">
        <div className="stat-card loading">Loading statistics...</div>
      </div>
    )
  }

  const stats = [
    { label: "Total Vehicles", value: statistics.total || 0, color: "#3b82f6" },
    { label: "Moving", value: statistics.moving || 0, color: "#10b981" },
    { label: "Idle", value: statistics.idle || 0, color: "#f59e0b" },
    { label: "Delivered", value: statistics.delivered || 0, color: "#8b5cf6" },
    { label: "Maintenance", value: statistics.maintenance || 0, color: "#ef4444" },
  ]

  return (
    <div className="statistics">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-color" style={{ backgroundColor: stat.color }}></div>
          <div className="stat-content">
            <p className="stat-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Statistics
