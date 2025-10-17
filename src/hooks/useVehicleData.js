"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const API_BASE_URL = "https://case-study-26cf.onrender.com"
const WS_URL = "wss://case-study-26cf.onrender.com"

export function useVehicleData() {
  const [vehicles, setVehicles] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  // Fetch vehicles from API
  const fetchVehicles = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicles`)
      if (!response.ok) throw new Error("Failed to fetch vehicles")
      const data = await response.json()

      // The API might return an array directly or an object with a data/vehicles property
      const vehiclesArray = Array.isArray(data) ? data : data.data || data.vehicles || []
      console.log("[v0] Vehicles fetched:", vehiclesArray)
      setVehicles(vehiclesArray)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching vehicles:", err)
      setVehicles([]) // Ensure vehicles is always an array
    }
  }, [])

  // Fetch statistics from API
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

  // Initialize WebSocket connection
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
            setVehicles(vehiclesArray)
          }

          // Update statistics if provided
          if (data.statistics) {
            setStatistics(data.statistics)
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
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...")
          connectWebSocket()
        }, 5000)
      }
    } catch (err) {
      console.error("Error connecting to WebSocket:", err)
      setError("Failed to connect to WebSocket")
    }
  }, [])

  // Initial data fetch and WebSocket setup
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      await Promise.all([fetchVehicles(), fetchStatistics()])
      setLoading(false)
      connectWebSocket()
    }

    initializeData()

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [fetchVehicles, fetchStatistics, connectWebSocket])

  const updateVehicles = useCallback((newVehicles) => {
    const vehiclesArray = Array.isArray(newVehicles) ? newVehicles : []
    setVehicles(vehiclesArray)
  }, [])

  return {
    vehicles,
    statistics,
    loading,
    error,
    updateVehicles,
  }
}
