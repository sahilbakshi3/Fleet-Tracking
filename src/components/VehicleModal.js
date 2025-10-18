import React from "react";
import "../styles/VehicleModal.css";
import {
  Truck,
  Check,
  Zap,
  User,
  Phone,
  MapPin,
  Map,
  Battery,
  Droplet,
  Clock,
} from "lucide-react";

function Icon({ name, className }) {
  const props = { size: 16, strokeWidth: 1.6, className: className || "" };
  switch (name) {
    case "truck":
      return <Truck {...props} />;
    case "check":
      return <Check {...props} />;
    case "zap":
      return <Zap {...props} />;
    case "user":
      return <User {...props} />;
    case "phone":
      return <Phone {...props} />;
    case "pin":
      return <MapPin {...props} />;
    case "map":
      return <Map {...props} />;
    case "battery":
      return <Battery {...props} />;
    case "fuel":
      return <Droplet {...props} />;
    case "clock":
      return <Clock {...props} />;
    default:
      return null;
  }
}

function VehicleModal({ vehicle = {}, onClose }) {
  const getStatusColor = (status) => {
    const statusMap = {
      moving: "#10b981",
      idle: "#f59e0b",
      delivered: "#06b6d4",
      maintenance: "#ef4444",
    };
    return statusMap[status?.toLowerCase()] || "#6b7280";
  };

  const getBatteryColor = (level) => {
    if (level <= 20) return "#ef4444";
    if (level <= 50) return "#f59e0b";
    return "#10b981";
  };

  const getFuelColor = (level) => {
    if (level <= 25) return "#ef4444";
    if (level <= 50) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="vm-overlay" onClick={onClose}>
      <div className="vm-content" onClick={(e) => e.stopPropagation()}>
        <div className="vm-header">
          <div className="vm-title-left">
            <div className="vm-truck-wrap">
              <Truck size={22} strokeWidth={1.6} />
            </div>
            <div>
              <h2 className="vm-h2">{vehicle.id || "—"}</h2>
              <p className="vm-subtitle">
                {vehicle.driver_name || "Unknown"} •{" "}
                <span className="vm-status-inline">
                  {(vehicle.status || "N/A").toString().toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          <button className="vm-close" onClick={onClose} aria-label="Close modal">
            <span className="vm-close-x">×</span>
          </button>
        </div>

        <div className="vm-body">
          <div className="vm-grid">
            {/* STATUS */}
            <div className="vm-card">
              <div className="card-header">
                <Icon name="check" className="card-header-icon" />
                <span>STATUS</span>
              </div>
              <div className="card-content">
                <span
                  className="status-pill"
                  style={{
                    backgroundColor: getStatusColor(vehicle.status),
                    color: "#ffffff",
                  }}
                >
                  <Check size={14} strokeWidth={2} />
                  <strong className="status-text">{(vehicle.status || "N/A").toUpperCase()}</strong>
                </span>
              </div>
            </div>

            {/* SPEED */}
            <div className="vm-card">
              <div className="card-header">
                <Icon name="zap" className="card-header-icon" />
                <span>CURRENT SPEED</span>
              </div>
              <div className="card-content">
                <div className="metric-big">
                  {vehicle.speed ?? 0}
                  <span className="metric-unit"> mph</span>
                </div>
              </div>
            </div>

            {/* DRIVER */}
            <div className="vm-card">
              <div className="card-header">
                <Icon name="user" className="card-header-icon" />
                <span>DRIVER</span>
              </div>
              <div className="card-content">
                <div className="metric-medium">{vehicle.driver_name || "N/A"}</div>
              </div>
            </div>

            {/* PHONE */}
            <div className="vm-card">
              <div className="card-header">
                <Icon name="phone" className="card-header-icon" />
                <span>PHONE</span>
              </div>
              <div className="card-content">
                <div className="metric-medium">{vehicle.driver_phone || "N/A"}</div>
              </div>
            </div>

            {/* DESTINATION */}
            <div className="vm-card">
              <div className="card-header">
                <Icon name="pin" className="card-header-icon" />
                <span>DESTINATION</span>
              </div>
              <div className="card-content">
                <div className="metric-medium">{vehicle.destination || "N/A"}</div>
              </div>
            </div>

            {/* LOCATION */}
            <div className="vm-card">
              <div className="card-header">
                <Icon name="map" className="card-header-icon" />
                <span>LOCATION</span>
              </div>
              <div className="card-content">
                <div className="metric-small">{vehicle.current_location || "N/A"}</div>
              </div>
            </div>

            {/* BATTERY */}
            <div className="vm-card">
              <div className="card-header">
                <Icon name="battery" className="card-header-icon" />
                <span>BATTERY LEVEL</span>
              </div>
              <div className="card-content">
                <div className="progress-wrap">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${vehicle.battery_level ?? 20}%`,
                        backgroundColor: getBatteryColor(vehicle.battery_level ?? 20),
                      }}
                    />
                  </div>
                </div>
                <div className="metric-big percent">{vehicle.battery_level ?? 20}%</div>
              </div>
            </div>

            {/* FUEL */}
            <div className="vm-card">
              <div className="card-header">
                <Icon name="fuel" className="card-header-icon" />
                <span>FUEL LEVEL</span>
              </div>
              <div className="card-content">
                <div className="progress-wrap">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${vehicle.fuel_level ?? 44}%`,
                        backgroundColor: getFuelColor(vehicle.fuel_level ?? 44),
                      }}
                    />
                  </div>
                </div>
                <div className="metric-big percent">{vehicle.fuel_level ?? 44}%</div>
              </div>
            </div>

            {/* LAST UPDATED */}
            <div className="vm-card vm-card-full">
              <div className="card-header">
                <Icon name="clock" className="card-header-icon" />
                <span>LAST UPDATED</span>
              </div>
              <div className="card-content">
                <div className="metric-medium">{vehicle.last_updated || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleModal;
