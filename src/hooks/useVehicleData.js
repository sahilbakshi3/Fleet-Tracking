import { useState, useEffect, useRef, useCallback } from "react"

const API_BASE_URL = "https://case-study-26cf.onrender.com"
const WS_URL = "wss://case-study-26cf.onrender.com"

function normalizeVehicle(v = {}) {
  const lat = v.currentLocation?.lat ?? v.latitude ?? null
  const lng = v.currentLocation?.lng ?? v.longitude ?? null

  const locationString =
    lat != null && lng != null ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "N/A"

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

function getRelativeTime(seconds) {
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function useVehicleData() {
  const [vehicles, setVehicles] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [lastUpdated, setLastUpdated] = useState("just now")

  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const lastUpdateTimeRef = useRef(Date.now())
  const updateIntervalRef = useRef(null)

  // Calculate statistics from vehicles array
  const calculateStatistics = useCallback((vehiclesArray) => {
    if (!Array.isArray(vehiclesArray) || vehiclesArray.length === 0) {
      return {
        total: 0,
        idle: 0,
        moving: 0,
        delivered: 0,
        maintenance: 0,
        averageSpeed: 0
      }
    }

    const stats = {
      total: vehiclesArray.length,
      idle: 0,
      moving: 0,
      delivered: 0,
      maintenance: 0,
      averageSpeed: 0
    }

    let totalSpeed = 0
    let speedCount = 0

    vehiclesArray.forEach(vehicle => {
      const status = vehicle.status?.toLowerCase()
      
      // Count by status
      if (status === 'idle') {
        stats.idle++
      } else if (status === 'moving' || status === 'en_route') {
        stats.moving++
      } else if (status === 'delivered') {
        stats.delivered++
      } else if (status === 'maintenance') {
        stats.maintenance++
      }

      // Calculate average speed (only for moving vehicles or vehicles with speed > 0)
      const speed = parseFloat(vehicle.speed)
      if (!isNaN(speed) && speed > 0) {
        totalSpeed += speed
        speedCount++
      }
    })

    // Calculate average speed
    stats.averageSpeed = speedCount > 0 ? totalSpeed / speedCount : 0

    return stats
  }, [])

  // Update the relative time display every second
  useEffect(() => {
    updateIntervalRef.current = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdateTimeRef.current) / 1000)
      setLastUpdated(getRelativeTime(secondsAgo))
    }, 1000)

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [])

  const updateLastUpdateTime = useCallback(() => {
    lastUpdateTimeRef.current = Date.now()
    setLastUpdated("just now")
  }, [])

  const fetchAllVehicles = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles`)
      if (!response.ok) throw new Error("Failed to fetch vehicles")
      const data = await response.json()
      const vehiclesArray = Array.isArray(data)
        ? data
        : data.data || data.vehicles || []
      const normalizedVehicles = vehiclesArray.map(normalizeVehicle)
      setVehicles(normalizedVehicles)
      
      // Calculate statistics from the fetched vehicles
      const calculatedStats = calculateStatistics(normalizedVehicles)
      setStatistics(calculatedStats)
      
      setError(null)
      updateLastUpdateTime()
    } catch (err) {
      console.error("Error fetching all vehicles:", err)
      setError(err.message)
      setVehicles([])
      setStatistics({
        total: 0,
        idle: 0,
        moving: 0,
        delivered: 0,
        maintenance: 0,
        averageSpeed: 0
      })
    }
  }, [updateLastUpdateTime, calculateStatistics])

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

  const fetchVehiclesByStatus = useCallback(async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles/status/${status}`)
      if (!response.ok) throw new Error("Failed to fetch vehicles by status")
      const data = await response.json()
      const vehiclesArray = Array.isArray(data)
        ? data
        : data.data || data.vehicles || []
      const normalizedVehicles = vehiclesArray.map(normalizeVehicle)
      setVehicles(normalizedVehicles)
      
      // Calculate statistics from the filtered vehicles
      const calculatedStats = calculateStatistics(normalizedVehicles)
      setStatistics(calculatedStats)
      
      setError(null)
      updateLastUpdateTime()
    } catch (err) {
      console.error(`Error fetching vehicles by status ${status}:`, err)
      setError(err.message)
      setVehicles([])
      setStatistics({
        total: 0,
        idle: 0,
        moving: 0,
        delivered: 0,
        maintenance: 0,
        averageSpeed: 0
      })
    }
  }, [updateLastUpdateTime, calculateStatistics])

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/statistics`)
      if (!response.ok) throw new Error("Failed to fetch statistics")
      const data = await response.json()
      
      // Merge API statistics with calculated statistics
      // Prefer calculated statistics but allow API to override if available
      if (data && Object.keys(data).length > 0) {
        setStatistics(prev => {
          if (!prev) return data
          return {
            ...prev,
            ...data
          }
        })
      }
    } catch (err) {
      console.error("Error fetching statistics:", err)
      // Don't overwrite calculated statistics on error
      // The calculated statistics will remain as fallback
    }
  }, [])

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

          // Handle vehicle updates from WebSocket
          if (data.vehicles) {
            const vehiclesArray = Array.isArray(data.vehicles)
              ? data.vehicles
              : data.vehicles.data || data.vehicles.vehicles || []
            const normalizedVehicles = vehiclesArray.map(normalizeVehicle)
            setVehicles(normalizedVehicles)
            
            // Calculate statistics from WebSocket vehicle data
            const calculatedStats = calculateStatistics(normalizedVehicles)
            setStatistics(calculatedStats)
            
            updateLastUpdateTime()
          }

          // Handle statistics updates from WebSocket
          if (data.statistics) {
            setStatistics(prev => {
              if (!prev) return data.statistics
              return {
                ...prev,
                ...data.statistics
              }
            })
          }
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
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000)
      }
    } catch (err) {
      console.error("Error connecting to WebSocket:", err)
      setError("Failed to connect to WebSocket")
    }
  }, [updateLastUpdateTime, calculateStatistics])

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      
      // Fetch initial vehicle data and statistics
      await Promise.all([fetchAllVehicles(), fetchStatistics()])
      
      setLoading(false)
      
      // Connect to WebSocket for real-time updates
      connectWebSocket()
    }

    initializeData()

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [fetchAllVehicles, fetchStatistics, connectWebSocket])

  return {
    vehicles,
    statistics,
    loading,
    error,
    selectedVehicle,
    lastUpdated,
    setSelectedVehicle,
    fetchAllVehicles,
    fetchVehicleById,
    fetchVehiclesByStatus,
  }
}