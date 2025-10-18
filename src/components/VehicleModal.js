import React from "react";
import "../styles/VehicleModal.css";
import {
  Truck,
  Gauge,
  User,
  Phone,
  MapPin,
  Battery,
  Fuel,
  Clock,
  MousePointer2,
} from "lucide-react";

function VehicleModal({ vehicle = {}, onClose }) {
  const battery = vehicle.battery_level ?? 20;
  const fuel = vehicle.fuel_level ?? 44;

  // Normalize status key used in class names (en_route, idle, delivered, maintenance)
  const statusKey = (vehicle.status || "unknown").toString().toLowerCase().replace(/-/g, "_");

  // Human friendly display text (no emoji in header)
  const displayStatus =
    statusKey === "en_route"
      ? "EN-ROUTE"
      : (vehicle.status || "N/A").toString().toUpperCase();

  // Emoji mapping for status pill
  const emojiMap = {
    delivered: "✅",
    idle: "💤",
    maintenance: "🔧",
    en_route: "🚚",
  };

  const emojiForStatus = emojiMap[statusKey];

  // Format timestamp (ms) or ISO string into "DD/MM/YYYY, HH:MM:SS"
  const formatLastUpdated = () => {
    // prefer numeric timestamp if available
    const ts = vehicle.last_updated_at ?? (vehicle.last_updated ? Date.parse(vehicle.last_updated) : NaN);

    if (!ts || Number.isNaN(Number(ts))) return "N/A";

    const d = new Date(Number(ts));
    if (Number.isNaN(d.getTime())) return "N/A";

    const pad2 = (n) => String(n).padStart(2, "0");

    const day = pad2(d.getDate());
    const month = pad2(d.getMonth() + 1);
    const year = d.getFullYear();

    const hours = pad2(d.getHours());
    const minutes = pad2(d.getMinutes());
    const seconds = pad2(d.getSeconds());

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  const lastUpdatedFormatted = formatLastUpdated();

  return (
    <div className="vm-overlay" onClick={onClose}>
      <div className="vm-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vm-header">
          <div className="vm-title-left">
            <div className="vm-truck-wrap">
              <Truck size={22} strokeWidth={1.6} />
            </div>
            <div>
              <h2 className="vm-h2">{vehicle.id || "—"}</h2>
              <p className="vm-subtitle">
                {vehicle.driver_name || "Unknown"} •{" "}
                {/* Plain text status in header — no emoji, no extra coloring */}
                <span className="vm-status-inline-header">
                  {displayStatus}
                </span>
              </p>
            </div>
          </div>

          <button className="vm-close" onClick={onClose} aria-label="Close modal">
            <span className="vm-close-x">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="vm-body">
          <div className="vm-grid">
            {/* STATUS */}
            <div className="vm-card">
              <div className="card-inner">
                <div className="card-header">
                  <MousePointer2
                    size={16}
                    strokeWidth={1.8}
                    className="card-header-icon"
                    style={{ transform: "rotate(90deg)" }}
                  />
                  <span>STATUS</span>
                </div>
                <div className="card-content">
                  <span className={`status-pill ${statusKey}`}>
                    {/* Emoji inside pill (if available for this status) */}
                    {emojiForStatus && (
                      <span className="status-emoji-pill" aria-hidden>
                        {emojiForStatus}
                      </span>
                    )}
                    <strong className="status-text">{displayStatus}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* SPEED */}
            <div className="vm-card">
              <div className="card-inner">
                <div className="card-header">
                  <Gauge size={16} strokeWidth={1.8} className="card-header-icon" />
                  <span>CURRENT SPEED</span>
                </div>
                <div className="card-content">
                  <div className="metric-big">
                    {vehicle.speed ?? 0}
                    <span className="metric-unit"> mph</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DRIVER */}
            <div className="vm-card">
              <div className="card-inner">
                <div className="card-header">
                  <User size={16} strokeWidth={1.8} className="card-header-icon" />
                  <span>DRIVER</span>
                </div>
                <div className="card-content">
                  <div className="metric-medium">{vehicle.driver_name || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* PHONE */}
            <div className="vm-card">
              <div className="card-inner">
                <div className="card-header">
                  <Phone size={16} strokeWidth={1.8} className="card-header-icon" />
                  <span>PHONE</span>
                </div>
                <div className="card-content">
                  <div className="metric-medium">{vehicle.driver_phone || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* DESTINATION */}
            <div className="vm-card">
              <div className="card-inner">
                <div className="card-header">
                  <MapPin size={16} strokeWidth={1.8} className="card-header-icon" />
                  <span>DESTINATION</span>
                </div>
                <div className="card-content">
                  <div className="metric-medium">{vehicle.destination || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* LOCATION */}
            <div className="vm-card">
              <div className="card-inner">
                <div className="card-header">
                  <MousePointer2
                    size={16}
                    strokeWidth={1.8}
                    className="card-header-icon"
                    style={{ transform: "rotate(90deg)" }}
                  />
                  <span>LOCATION</span>
                </div>
                <div className="card-content">
                  <div className="metric-small">{vehicle.current_location || "N/A"}</div>
                </div>
              </div>
            </div>

            {/* BATTERY LEVEL */}
            <div className="vm-card battery-card">
              <div className="card-inner">
                <div className="card-header">
                  <Battery size={16} strokeWidth={1.8} className="card-header-icon" />
                  <span>BATTERY LEVEL</span>
                </div>
                <div className="card-content">
                  <div className="progress-wrap">
                    <div className="progress-bar">
                      <div
                        className="progress-fill battery-fill"
                        style={{ width: `${battery}%` }}
                      />
                    </div>
                  </div>
                  <div className="metric-big percent">{battery}%</div>
                </div>
              </div>
            </div>

            {/* FUEL LEVEL */}
            <div className="vm-card fuel-card">
              <div className="card-inner">
                <div className="card-header">
                  <Fuel size={16} strokeWidth={1.8} className="card-header-icon" />
                  <span>FUEL LEVEL</span>
                </div>
                <div className="card-content">
                  <div className="progress-wrap">
                    <div className="progress-bar">
                      <div
                        className="progress-fill fuel-fill"
                        style={{ width: `${fuel}%` }}
                      />
                    </div>
                  </div>
                  <div className="metric-big percent">{fuel}%</div>
                </div>
              </div>
            </div>

            {/* LAST UPDATED */}
            <div className="vm-card vm-card-full">
              <div className="card-inner">
                <div className="card-header">
                  <Clock size={16} strokeWidth={1.8} className="card-header-icon" />
                  <span>LAST UPDATED</span>
                </div>
                <div className="card-content">
                  <div className="metric-medium">{lastUpdatedFormatted}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleModal;
