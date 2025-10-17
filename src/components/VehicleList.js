"use client"

import "../styles/VehicleList.css"

function VehicleList({ vehicles, loading, onVehicleClick }) {
  if (loading) {
    return <div className="vehicle-list-loading">Loading vehicles...</div>
  }

  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return <div className="vehicle-list-empty">No vehicles found</div>
  }

  const getStatusColor = (status) => {
    const statusMap = {
      moving: "#10b981",
      idle: "#f59e0b",
      delivered: "#8b5cf6",
      maintenance: "#ef4444",
    }
    return statusMap[status?.toLowerCase()] || "#6b7280"
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      moving: "MOVING",
      idle: "IDLE",
      delivered: "DELIVERED",
      maintenance: "MAINTENANCE",
    }
    return statusMap[status?.toLowerCase()] || status
  }

  return (
    <div className="vehicle-list-container">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Status</th>
            <th>Speed</th>
            <th>Destination</th>
            <th>ETA</th>
            <th>Last Update</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="vehicle-row" onClick={() => onVehicleClick(vehicle)}>
              <td className="vehicle-id-cell">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onVehicleClick(vehicle)
                  }}
                >
                  {vehicle.id}
                </a>
              </td>
              <td>{vehicle.driver_name || "N/A"}</td>
              <td>
                <span className="status-badge" style={{ backgroundColor: getStatusColor(vehicle.status) }}>
                  {getStatusBadge(vehicle.status)}
                </span>
              </td>
              <td>{vehicle.speed || 0} mph</td>
              <td>{vehicle.destination || "N/A"}</td>
              <td>{vehicle.eta || "-"}</td>
              <td>{vehicle.last_updated || "N/A"}</td>
              <td className="location-cell">{vehicle.current_location || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VehicleList
