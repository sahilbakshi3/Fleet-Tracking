"use client"
import "../styles/VehicleModal.css"

function VehicleModal({ vehicle, onClose }) {
  const getStatusColor = (status) => {
    const statusMap = {
      moving: "#10b981",
      idle: "#f59e0b",
      delivered: "#8b5cf6",
      maintenance: "#ef4444",
    }
    return statusMap[status?.toLowerCase()] || "#6b7280"
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vehicle Details</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Vehicle ID</label>
                <p>{vehicle.id}</p>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <p>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(vehicle.status) }}>
                    {vehicle.status}
                  </span>
                </p>
              </div>
              <div className="detail-item">
                <label>Driver Name</label>
                <p>{vehicle.driver_name || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Driver Phone</label>
                <p>{vehicle.driver_phone || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Location & Movement</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Current Location</label>
                <p>{vehicle.current_location || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Latitude</label>
                <p>{vehicle.latitude || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Longitude</label>
                <p>{vehicle.longitude || "N/A"}</p>
              </div>
              <div className="detail-item">
                <label>Speed</label>
                <p>{vehicle.speed || 0} km/h</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Vehicle Status</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Fuel Level</label>
                <div className="fuel-bar">
                  <div className="fuel-fill" style={{ width: `${vehicle.fuel_level || 0}%` }}></div>
                </div>
                <p>{vehicle.fuel_level || 0}%</p>
              </div>
              <div className="detail-item">
                <label>Temperature</label>
                <p>{vehicle.temperature || "N/A"}°C</p>
              </div>
              <div className="detail-item">
                <label>Odometer</label>
                <p>{vehicle.odometer || "N/A"} km</p>
              </div>
              <div className="detail-item">
                <label>Last Updated</label>
                <p>{new Date(vehicle.updated_at).toLocaleString() || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Delivery Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Deliveries Completed</label>
                <p>{vehicle.deliveries_completed || 0}</p>
              </div>
              <div className="detail-item">
                <label>Deliveries Pending</label>
                <p>{vehicle.deliveries_pending || 0}</p>
              </div>
              <div className="detail-item">
                <label>Total Capacity</label>
                <p>{vehicle.capacity || "N/A"} units</p>
              </div>
              <div className="detail-item">
                <label>Current Load</label>
                <p>{vehicle.current_load || 0} units</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleModal
