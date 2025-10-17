"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const API_BASE_URL = "https://case-study-26cf.onrender.com"
const WS_URL = "wss://case-study-26cf.onrender.com"

// ------------------------------
// Helper: Normalize API vehicle
// ------------------------------
function normalizeVehicle(v = {}) {
  const lat = v.currentLocation?.lat ?? v.latitude ?? null
  const lng = v.currentLocation?.lng ?? v.longitude ?? null

  const locationString =
    lat != null && lng != null ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "N/A"

  // Convert status values to match UI color mappings
  let status = v.status
  if (status === "en_route") status = "moving"

  return {
    id: v.vehicleNumber || v.id,
    driver_name: v.driverName || "N/A",
    driver_phone: v.driverPhone || "N/A",
    status,
    destination: v.destination || "N/A",
    current_location: locationString,
    latitude: lat,
    longitude: lng,
    speed: v.speed || 0,
    last_updated: v.lastUpdated || "N/A",
    eta: v.estimatedArrival || "-",
    battery_level: v.batteryLevel ?? 0,
    fuel_level: v.fuelLevel ?? 0,
  }
}

export function useVehicleData() {
  const [vehicles, setVehicles] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  // ------------------------------
  // 1️⃣ Fetch ALL vehicles
  // ------------------------------
  const fetchAllVehicles = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles`)
      if (!response.ok) throw new Error("Failed to fetch vehicles")
      const data = await response.json()
      const vehiclesArray = Array.isArray(data)
        ? data
        : data.data || data.vehicles || []
      setVehicles(vehiclesArray.map(normalizeVehicle))
      setError(null)
    } catch (err) {
      console.error("Error fetching all vehicles:", err)
      setError(err.message)
      setVehicles([])
    }
  }, [])

  // ------------------------------
  // 2️⃣ Fetch SINGLE vehicle by ID
  // ------------------------------
  const fetchVehicleById = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`)
      if (!response.ok) throw new Error("Vehicle not found")
      const data = await response.json()
      const vehicleObj =
        !Array.isArray(data) && (data.data || data.vehicle || data)
      const normalized = normalizeVehicle(vehicleObj)
      setSelectedVehicle(normalized)
      return normalized
    } catch (err) {
      console.error(`Error fetching vehicle ${id}:`, err)
      setError(err.message)
      return null
    }
  }, [])

  // ------------------------------
  // 3️⃣ Fetch vehicles by STATUS
  // ------------------------------
  const fetchVehiclesByStatus = useCallback(async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/status/${status}`)
      if (!response.ok) throw new Error("Failed to fetch vehicles by status")
      const data = await response.json()
      const vehiclesArray = Array.isArray(data)
        ? data
        : data.data || data.vehicles || []
      setVehicles(vehiclesArray.map(normalizeVehicle))
      setError(null)
    } catch (err) {
      console.error(`Error fetching vehicles by status ${status}:`, err)
      setError(err.message)
      setVehicles([])
    }
  }, [])

  // ------------------------------
  // 4️⃣ Fetch fleet statistics
  // ------------------------------
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/statistics`)
      if (!response.ok) throw new Error("Failed to fetch statistics")
      const data = await response.json()
      setStatistics(data)
    } catch (err) {
      console.error("Error fetching statistics:", err)
    }
  }, [])

  // ------------------------------
  // 5️⃣ Setup WebSocket
  // ------------------------------
  const connectWebSocket = useCallback(() => {
    try {
      wsRef.current = new WebSocket(WS_URL)

      wsRef.current.onopen = () => {
        console.log("WebSocket connected")
        setError(null)
      }

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("WebSocket message received:", data)

          if (data.vehicles) {
            const vehiclesArray = Array.isArray(data.vehicles)
              ? data.vehicles
              : data.vehicles.data || data.vehicles.vehicles || []
            setVehicles(vehiclesArray.map(normalizeVehicle))
          }

          if (data.statistics) setStatistics(data.statistics)
        } catch (err) {
          console.error("Error parsing WebSocket message:", err)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error)
        setError("WebSocket connection error")
      }

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected")
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000)
      }
    } catch (err) {
      console.error("Error connecting to WebSocket:", err)
      setError("Failed to connect to WebSocket")
    }
  }, [])

  // ------------------------------
  // 6️⃣ Initial load + cleanup
  // ------------------------------
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      await Promise.all([fetchAllVehicles(), fetchStatistics()])
      setLoading(false)
      connectWebSocket()
    }

    initializeData()

    return () => {
      if (wsRef.current) wsRef.current.close()
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
    }
  }, [fetchAllVehicles, fetchStatistics, connectWebSocket])

  return {
    vehicles,
    statistics,
    loading,
    error,
    selectedVehicle,
    setSelectedVehicle,
    fetchAllVehicles,
    fetchVehicleById,
    fetchVehiclesByStatus,
  }
}
