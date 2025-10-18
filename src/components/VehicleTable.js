import React from "react"
import "../styles/VehicleTable.css"

function VehicleTable({ vehicles, onVehicleClick, onSort, sortConfig }) {
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase()
    
    // Map for status styles
    const statusStyles = {
      delivered: {
        backgroundColor: "#d1fae5",
        color: "#059669"
      },
      idle: {
        backgroundColor: "#f3f4f6",
        color: "#4b5563"
      },
      moving: {
        backgroundColor: "#d1fae5",
        color: "#059669"
      },
      maintenance: {
        backgroundColor: "#fee2e2",
        color: "#dc2626"
      }
    }
    
    return statusStyles[statusLower] || statusStyles.idle
  }

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="sort-icon">⇅</span>
    }
    return sortConfig.direction === "asc" ? (
      <span className="sort-icon active">↑</span>
    ) : (
      <span className="sort-icon active">↓</span>
    )
  }

  const columns = [
    { key: "id", label: "Vehicle", sortable: true },
    { key: "driver_name", label: "Driver", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "speed", label: "Speed", sortable: true },
    { key: "destination", label: "Destination", sortable: true },
    { key: "eta", label: "ETA", sortable: false },
    { key: "last_updated", label: "Last Update", sortable: false },
    { key: "current_location", label: "Location", sortable: false },
  ]

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-icon">🚛</div>
          <h3 className="empty-title">No vehicles found</h3>
          <p className="empty-description">
            Try adjusting your filters or search terms
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="vehicle-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && onSort(column.key)}
                  className={column.sortable ? "sortable" : ""}
                >
                  <div className="th-content">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => {
              const statusStyle = getStatusStyle(vehicle.status)
              
              return (
                <tr
                  key={vehicle.id || index}
                  onClick={() => onVehicleClick(vehicle)}
                  className="vehicle-row"
                >
                  <td className="vehicle-id-cell">
                    <div className="vehicle-id-content">
                      <span className="vehicle-id-text">{vehicle.id}</span>
                    </div>
                  </td>
                  
                  <td className="driver-cell">
                    <div className="driver-info">
                      <span className="driver-name">{vehicle.driver_name}</span>
                    </div>
                  </td>
                  
                  <td className="status-cell">
                    <span
                      className="status-badge"
                      style={statusStyle}
                    >
                      <span className="status-text">{vehicle.status?.toUpperCase()}</span>
                    </span>
                  </td>
                  
                  <td className="speed-cell">
                    <div className="speed-content">
                      <span className="speed-value">{vehicle.speed}</span>
                      <span className="speed-unit">mph</span>
                    </div>
                  </td>
                  
                  <td className="destination-cell">
                    <div className="destination-content" title={vehicle.destination}>
                      <span className="destination-text">{vehicle.destination}</span>
                    </div>
                  </td>
                  
                  <td className="eta-cell">
                    <div className="eta-content">
                      <span className="eta-text">{vehicle.eta}</span>
                    </div>
                  </td>
                  
                  <td className="last-update-cell">
                    <span className="last-update-text">{vehicle.last_updated}</span>
                  </td>
                  
                  <td className="location-cell">
                    <div className="location-content" title={vehicle.current_location}>
                      <span className="location-text">{vehicle.current_location}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VehicleTable