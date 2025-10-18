import React from "react";
import "../styles/VehicleTable.css";

function VehicleTable({ vehicles, onVehicleClick, onSort, sortConfig }) {
  // Normalize status values
  const normalizeStatusKey = (status) => {
    if (!status) return "idle";
    const s = String(status).toLowerCase();
    if (s === "moving" || s === "en-route") return "en_route";
    if (s === "en_route") return "en_route";
    return s;
  };

  // Status color styles
  const getStatusStyle = (status) => {
    const statusKey = normalizeStatusKey(status);

    const statusStyles = {
      delivered: { backgroundColor: "#d1fae5", color: "#059669" },
      idle: { backgroundColor: "#f3f4f6", color: "#4b5563" },
      en_route: { backgroundColor: "#dbeafe", color: "#2563eb" },
      maintenance: { backgroundColor: "#fee2e2", color: "#dc2626" },
    };

    return statusStyles[statusKey] || statusStyles.idle;
  };

  // Sorting indicator icon
  const getSortIcon = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <span className="sort-icon">⇅</span>;
    }
    return sortConfig.direction === "asc" ? (
      <span className="sort-icon active">↑</span>
    ) : (
      <span className="sort-icon active">↓</span>
    );
  };

  // ✅ Helper: Format timestamp into "DD/MM/YYYY, HH:MM:SS"
  const formatDateTime = (value) => {
    if (!value || value === "-" || value === "-") return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  // ✅ Helper: Format location (lat, lng) to 4 decimal places
  const formatLocation = (location) => {
    if (!location || location === "N/A") return "N/A";

    const parts = location.split(",");
    if (parts.length !== 2) return location;

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lng)) return location;

    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const columns = [
    { key: "id", label: "Vehicle", sortable: true },
    { key: "driver_name", label: "Driver", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "speed", label: "Speed", sortable: true },
    { key: "destination", label: "Destination", sortable: true },
    { key: "eta", label: "ETA", sortable: false },
    { key: "last_updated", label: "Last Update", sortable: false },
    { key: "current_location", label: "Location", sortable: false },
  ];

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
    );
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
              const rawStatus = vehicle.status ?? "";
              const statusKey = normalizeStatusKey(rawStatus);
              const displayStatus =
                statusKey === "en_route"
                  ? "EN-ROUTE"
                  : (rawStatus || "N/A").toUpperCase();

              const statusStyle = getStatusStyle(rawStatus);

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
                    <span className="status-badge" style={statusStyle}>
                      <span className="status-text">{displayStatus}</span>
                    </span>
                  </td>

                  <td className="speed-cell">
                    <div className="speed-content">
                      <span className="speed-value">{vehicle.speed}</span>
                      <span className="speed-unit">mph</span>
                    </div>
                  </td>

                  <td className="destination-cell">
                    <div
                      className="destination-content"
                      title={vehicle.destination}
                    >
                      <span className="destination-text">
                        {vehicle.destination}
                      </span>
                    </div>
                  </td>

                  {/* ETA formatted */}
                  <td className="eta-cell">
                    <div className="eta-content">
                      <span className="eta-text">
                        {formatDateTime(vehicle.eta)}
                      </span>
                    </div>
                  </td>

                  {/* Last Update formatted */}
                  <td className="last-update-cell">
                    <span className="last-update-text">
                      {formatDateTime(vehicle.last_updated)}
                    </span>
                  </td>

                  {/* Location formatted to 4 decimal places */}
                  <td className="location-cell">
                    <div
                      className="location-content"
                      title={formatLocation(vehicle.current_location)}
                    >
                      <span className="location-text">
                        {formatLocation(vehicle.current_location)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VehicleTable;
