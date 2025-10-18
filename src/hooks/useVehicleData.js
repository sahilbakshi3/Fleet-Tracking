import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE_URL = "https://case-study-26cf.onrender.com";
const WS_URL = "wss://case-study-26cf.onrender.com";

function normalizeVehicle(v = {}) {
  const lat = v.currentLocation?.lat ?? v.latitude ?? null;
  const lng = v.currentLocation?.lng ?? v.longitude ?? null;

  const locationString =
    lat != null && lng != null ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "N/A";

  let status = (v.status || "").toString().toLowerCase();
  if (status === "moving" || status === "en-route") status = "en_route";

  let serverLastUpdatedAt = null;
  if (v.lastUpdated) {
    const parsed = Date.parse(v.lastUpdated);
    if (!isNaN(parsed)) serverLastUpdatedAt = parsed;
  }

  return {
    id: v.vehicleNumber || v.id,
    driver_name: v.driverName || "N/A",
    driver_phone: v.driverPhone || "N/A",
    status,
    destination: v.destination || "N/A",
    current_location: locationString,
    latitude: lat,
    longitude: lng,
    speed: v.speed ?? 0,
    last_updated: v.lastUpdated ?? null,
    last_updated_at: serverLastUpdatedAt,
    eta: v.estimatedArrival || "-",
    battery_level: v.batteryLevel ?? 0,
    fuel_level: v.fuelLevel ?? 0,
  };
}

function getRelativeTime(seconds) {
  if (seconds < 0) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function useVehicleData() {
  const [vehicles, setVehicles] = useState([]);
  const [statistics, setStatistics] = useState(null); // global statistics
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // numeric timestamp (ms) and human-friendly relative string
  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());
  const [lastUpdated, setLastUpdated] = useState("just now");

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const updateIntervalRef = useRef(null);

  const calculateStatistics = useCallback((vehiclesArray) => {
    if (!Array.isArray(vehiclesArray) || vehiclesArray.length === 0) {
      return {
        total: 0,
        idle: 0,
        moving: 0,
        delivered: 0,
        maintenance: 0,
        averageSpeed: 0,
      };
    }

    const stats = {
      total: vehiclesArray.length,
      idle: 0,
      moving: 0,
      delivered: 0,
      maintenance: 0,
      averageSpeed: 0,
    };

    let totalSpeed = 0;
    let speedCount = 0;

    vehiclesArray.forEach((vehicle) => {
      const status = (vehicle.status || "").toLowerCase();
      if (status === "idle") stats.idle++;
      else if (status === "moving" || status === "en_route") stats.moving++;
      else if (status === "delivered") stats.delivered++;
      else if (status === "maintenance") stats.maintenance++;

      const speed = parseFloat(vehicle.speed);
      if (!isNaN(speed) && speed > 0) {
        totalSpeed += speed;
        speedCount++;
      }
    });

    stats.averageSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;
    return stats;
  }, []);

  // update relative label every second based on numeric timestamp
  useEffect(() => {
    updateIntervalRef.current = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdatedAt) / 1000);
      setLastUpdated(getRelativeTime(secondsAgo));
    }, 1000);

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
    };
  }, [lastUpdatedAt]);

  // update both numeric timestamp and human label
  const updateLastUpdateTime = useCallback((preferredTimestampMs = null) => {
    const now = preferredTimestampMs ? Number(preferredTimestampMs) : Date.now();
    setLastUpdatedAt(now);
    setLastUpdated("just now");
  }, []);

  const fetchAllVehicles = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles`);
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();
      const vehiclesArray = Array.isArray(data)
        ? data
        : data.data || data.vehicles || [];

      const normalizedVehicles = vehiclesArray.map((v) => normalizeVehicle(v));
      setVehicles(normalizedVehicles);

      // calculate and set global statistics when fetching full fleet
      const calculatedStats = calculateStatistics(normalizedVehicles);
      // if we already have statistics (from API) merge the calculated averageSpeed only if missing
      setStatistics((prev) => {
        if (!prev) return calculatedStats;
        return { ...calculatedStats, ...prev, averageSpeed: prev.averageSpeed ?? calculatedStats.averageSpeed };
      });

      // prefer server timestamp if any vehicle contains one (latest)
      const timestamps = normalizedVehicles
        .map((v) => v.last_updated_at)
        .filter(Boolean)
        .map(Number);
      const latestServerTs = timestamps.length ? Math.max(...timestamps) : null;

      setError(null);
      updateLastUpdateTime(latestServerTs); // prefer server if available
    } catch (err) {
      console.error("Error fetching all vehicles:", err);
      setError(err.message);
      setVehicles([]);
      // keep statistics as global zeroed
      setStatistics({
        total: 0,
        idle: 0,
        moving: 0,
        delivered: 0,
        maintenance: 0,
        averageSpeed: 0,
      });
      updateLastUpdateTime(); // fallback to now
    }
  }, [calculateStatistics, updateLastUpdateTime]);

  const fetchVehicleById = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`);
      if (!response.ok) throw new Error("Vehicle not found");
      const data = await response.json();
      const vehicleObj =
        !Array.isArray(data) && (data.data || data.vehicle || data);
      const normalized = normalizeVehicle(vehicleObj);
      setSelectedVehicle(normalized);

      // if server provided timestamp, update lastUpdatedAt to that
      if (normalized.last_updated_at) updateLastUpdateTime(normalized.last_updated_at);
      else updateLastUpdateTime();

      return normalized;
    } catch (err) {
      console.error(`Error fetching vehicle ${id}:`, err);
      setError(err.message);
      return null;
    }
  }, [updateLastUpdateTime]);

  const fetchVehiclesByStatus = useCallback(async (status) => {
    try {
      const apiStatus = status === "en_route" ? "en_route" : status;
      const response = await fetch(`${API_BASE_URL}/api/vehicles/status/${apiStatus}`);
      if (!response.ok) throw new Error("Failed to fetch vehicles by status");
      const data = await response.json();
      const vehiclesArray = Array.isArray(data)
        ? data
        : data.data || data.vehicles || [];
      const normalizedVehicles = vehiclesArray.map((v) => normalizeVehicle(v));

      // IMPORTANT: do NOT overwrite global statistics when fetching a filtered subset.
      // Only update vehicles list (UI). Keep 'statistics' as the global fleet stats.
      setVehicles(normalizedVehicles);

      // Update last update timestamp based on server timestamps in subset if present
      const timestamps = normalizedVehicles
        .map((v) => v.last_updated_at)
        .filter(Boolean)
        .map(Number);
      const latestServerTs = timestamps.length ? Math.max(...timestamps) : null;

      setError(null);
      updateLastUpdateTime(latestServerTs);
    } catch (err) {
      console.error(`Error fetching vehicles by status ${status}:`, err);
      setError(err.message);
      setVehicles([]);
      // Do not reset global 'statistics' here; leave as-is or set to safe zeros
      setStatistics((prev) => prev || {
        total: 0,
        idle: 0,
        moving: 0,
        delivered: 0,
        maintenance: 0,
        averageSpeed: 0,
      });
      updateLastUpdateTime();
    }
  }, [updateLastUpdateTime]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/statistics`);
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();

      // API may return { success:true, data: { ... } } or direct object
      const payload = data?.data ?? data;

      if (payload && Object.keys(payload).length > 0) {
        // Prefer API-provided average_speed (snake_case) when present.
        const apiAverage = payload.average_speed ?? payload.averageSpeed ?? null;

        setStatistics((prev) => {
          // preserve previous counts if present, but prefer API values
          const base = prev && typeof prev === "object" ? { ...prev } : {};
          // copy fields we expect from API if present
          const merged = {
            ...base,
            total: payload.total ?? base.total,
            idle: payload.idle ?? base.idle,
            moving: payload.en_route ?? payload.moving ?? base.moving,
            delivered: payload.delivered ?? base.delivered,
            maintenance: payload.maintenance ?? base.maintenance,
            // use API average_speed if available, otherwise keep existing computed value
            averageSpeed: apiAverage != null ? Number(apiAverage) : (base.averageSpeed ?? 0),
          };
          return merged;
        });

        // If API returned a timestamp for statistics, prefer using it as lastUpdatedAt
        if (payload.timestamp) {
          const parsed = Date.parse(payload.timestamp);
          if (!isNaN(parsed)) updateLastUpdateTime(parsed);
        }
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
      // Don't overwrite calculated statistics on error
    }
  }, [updateLastUpdateTime]);

  const connectWebSocket = useCallback(() => {
    try {
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.vehicles) {
            const vehiclesArray = Array.isArray(data.vehicles)
              ? data.vehicles
              : data.vehicles.data || data.vehicles.vehicles || [];
            const normalizedVehicles = vehiclesArray.map((v) => normalizeVehicle(v));
            setVehicles(normalizedVehicles);

            if (data.statistics) {
              setStatistics((prev) => {
                if (!prev) return data.statistics;
                return { ...prev, ...data.statistics };
              });
            }

            const timestamps = normalizedVehicles
              .map((v) => v.last_updated_at)
              .filter(Boolean)
              .map(Number);
            const latestServerTs = timestamps.length ? Math.max(...timestamps) : null;

            updateLastUpdateTime(latestServerTs);
          }

          if (data.statistics) {
            // If websocket statistics includes average_speed (snake_case), map it
            const payload = data.statistics?.data ?? data.statistics;
            if (payload) {
              const apiAverage = payload.average_speed ?? payload.averageSpeed ?? null;
              setStatistics((prev) => {
                const base = prev && typeof prev === "object" ? { ...prev } : {};
                return {
                  ...base,
                  total: payload.total ?? base.total,
                  idle: payload.idle ?? base.idle,
                  moving: payload.en_route ?? payload.moving ?? base.moving,
                  delivered: payload.delivered ?? base.delivered,
                  averageSpeed: apiAverage != null ? Number(apiAverage) : (base.averageSpeed ?? 0),
                };
              });
              if (payload.timestamp) {
                const parsed = Date.parse(payload.timestamp);
                if (!isNaN(parsed)) updateLastUpdateTime(parsed);
              }
            }
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error");
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      };
    } catch (err) {
      console.error("Error connecting to WebSocket:", err);
      setError("Failed to connect to WebSocket");
    }
  }, [updateLastUpdateTime]);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchAllVehicles(), fetchStatistics()]);
      setLoading(false);
      connectWebSocket();
    };

    initializeData();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
    };
  }, [fetchAllVehicles, fetchStatistics, connectWebSocket]);

  return {
    vehicles,
    statistics,
    loading,
    error,
    selectedVehicle,
    lastUpdated,    // human-friendly string (used in footer)
    lastUpdatedAt,  // numeric ms (used by stats card to render HH:MM)
    setSelectedVehicle,
    fetchAllVehicles,
    fetchVehicleById,
    fetchVehiclesByStatus,
  };
}
