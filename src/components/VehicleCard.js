"use client"
import "../styles/VehicleCard.css"

function VehicleCard({ vehicle, onClick }) {
  const getStatusColor = (status) => {
    const statusMap = {
      moving: "#10b981",
      idle: "#f59e0b",
      delivered: "#8b5cf6",
      maintenance: "#ef4444",
    }
    return statusMap[status?.toLowerCase()] || "#6b7280"
  }

  const getStatusIcon = (status) => {
    const iconMap = {
      moving: "🚚",
      idle: "⏸️",
      delivered: "✓",
      maintenance: "🔧",
    }
    return iconMap[status?.toLowerCase()] || "📍"
  }

  return (
    <div className="vehicle-card" onClick={onClick}>
      <div className="vehicle-card-header">
        <div className="vehicle-id">{vehicle.id}</div>
        <div className="vehicle-status" style={{ backgroundColor: getStatusColor(vehicle.status) }}>
          <span className="status-icon">{getStatusIcon(vehicle.status)}</span>
          <span className="status-text">{vehicle.status}</span>
        </div>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-info-row">
          <span className="info-label">Driver:</span>
          <span className="info-value">{vehicle.driver_name || "N/A"}</span>
        </div>
        <div className="vehicle-info-row">
          <span className="info-label">Location:</span>
          <span className="info-value">{vehicle.current_location || "N/A"}</span>
        </div>
        <div className="vehicle-info-row">
          <span className="info-label">Speed:</span>
          <span className="info-value">{vehicle.speed || 0} km/h</span>
        </div>
        <div className="vehicle-info-row">
          <span className="info-label">Fuel:</span>
          <span className="info-value">{vehicle.fuel_level || 0}%</span>
        </div>
      </div>

      <div className="vehicle-card-footer">
        <small>Click for more details</small>
      </div>
    </div>
  )
}

export default VehicleCard
