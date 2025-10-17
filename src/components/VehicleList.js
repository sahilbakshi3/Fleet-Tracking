"use client"

import "../styles/VehicleList.css"

function VehicleList({ vehicles, loading, onVehicleClick }) {
  // Debug: Log the first vehicle to see the data structure
  if (vehicles && vehicles.length > 0) {
    console.log("Sample vehicle data:", vehicles[0])
    console.log("All vehicle keys:", Object.keys(vehicles[0]))
  }

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
      moving: "EN ROUTE",
      idle: "IDLE",
      delivered: "DELIVERED",
      maintenance: "MAINTENANCE",
    }
    return statusMap[status?.toLowerCase()] || status?.toUpperCase()
  }

  return (
    <div className="vehicle-list-wrapper">
      <div className="vehicle-list-header">
        <h2>Vehicles ({vehicles.length})</h2>
        <span className="live-badge">Live</span>
      </div>
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
                    {vehicle.id || vehicle.vehicle_id || "N/A"}
                  </a>
                </td>
                <td>{vehicle.driver_name || vehicle.driver || "N/A"}</td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(vehicle.status) }}>
                    {getStatusBadge(vehicle.status)}
                  </span>
                </td>
                <td>{vehicle.speed || vehicle.current_speed || 0} mph</td>
                <td>{vehicle.destination || vehicle.destination_location || "N/A"}</td>
                <td>{vehicle.eta || vehicle.estimated_arrival || "-"}</td>
                <td>{vehicle.last_updated || vehicle.updated_at || vehicle.timestamp || "N/A"}</td>
                <td className="location-cell">
                  {vehicle.current_location || 
                   (vehicle.latitude && vehicle.longitude ? `${vehicle.latitude}, ${vehicle.longitude}` : "N/A")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VehicleList