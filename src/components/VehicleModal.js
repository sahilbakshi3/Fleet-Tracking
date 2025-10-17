"use client"
import "../styles/VehicleModal.css"

function VehicleModal({ vehicle, onClose }) {
  // Debug: Log vehicle data structure
  console.log("Modal vehicle data:", vehicle)
  
  const getStatusColor = (status) => {
    const statusMap = {
      moving: "#10b981",
      idle: "#f59e0b",
      delivered: "#8b5cf6",
      maintenance: "#ef4444",
    }
    return statusMap[status?.toLowerCase()] || "#6b7280"
  }

  const getBatteryColor = (level) => {
    if (level <= 20) return "#ef4444"
    if (level <= 50) return "#f59e0b"
    return "#10b981"
  }

  const getFuelColor = (level) => {
    if (level <= 25) return "#ef4444"
    if (level <= 50) return "#f59e0b"
    return "#10b981"
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-compact" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-vehicle-icon">🚛</div>
            <div>
              <h2>{vehicle.id}</h2>
              <p className="modal-subtitle">{vehicle.driver_name} • {vehicle.status?.toUpperCase()}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div className="modal-card">
              <div className="card-header">
                <span className="card-icon">✓</span>
                STATUS
              </div>
              <div className="card-content">
                <span className="status-badge-large" style={{ backgroundColor: getStatusColor(vehicle.status) }}>
                  ✓ {vehicle.status?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="modal-card">
              <div className="card-header">
                <span className="card-icon">⚡</span>
                CURRENT SPEED
              </div>
              <div className="card-content">
                <span className="metric-large">{vehicle.speed || 0} mph</span>
              </div>
            </div>

            <div className="modal-card">
              <div className="card-header">
                <span className="card-icon">👤</span>
                DRIVER
              </div>
              <div className="card-content">
                <span className="metric-text">{vehicle.driver_name || "N/A"}</span>
              </div>
            </div>

            <div className="modal-card">
              <div className="card-header">
                <span className="card-icon">📞</span>
                PHONE
              </div>
              <div className="card-content">
                <span className="metric-text">{vehicle.driver_phone || "N/A"}</span>
              </div>
            </div>

            <div className="modal-card">
              <div className="card-header">
                <span className="card-icon">📍</span>
                DESTINATION
              </div>
              <div className="card-content">
                <span className="metric-text">{vehicle.destination || "N/A"}</span>
              </div>
            </div>

            <div className="modal-card">
              <div className="card-header">
                <span className="card-icon">🗺️</span>
                LOCATION
              </div>
              <div className="card-content">
                <span className="metric-text metric-small">{vehicle.current_location || "N/A"}</span>
              </div>
            </div>

            <div className="modal-card">
              <div className="card-header">
                <span className="card-icon">🔋</span>
                BATTERY LEVEL
              </div>
              <div className="card-content">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${vehicle.battery_level || 20}%`,
                      backgroundColor: getBatteryColor(vehicle.battery_level || 20)
                    }}
                  ></div>
                </div>
                <span className="metric-large">{vehicle.battery_level || 20}%</span>
              </div>
            </div>

            <div className="modal-card">
              <div className="card-header">
                <span className="card-icon">⛽</span>
                FUEL LEVEL
              </div>
              <div className="card-content">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${vehicle.fuel_level || 44}%`,
                      backgroundColor: getFuelColor(vehicle.fuel_level || 44)
                    }}
                  ></div>
                </div>
                <span className="metric-large">{vehicle.fuel_level || 44}%</span>
              </div>
            </div>

            <div className="modal-card modal-card-full">
              <div className="card-header">
                <span className="card-icon">🕐</span>
                LAST UPDATED
              </div>
              <div className="card-content">
                <span className="metric-text">{vehicle.last_updated || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleModal