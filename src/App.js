"use client"

import { useState, useCallback } from "react"
import "./App.css"
import Dashboard from "./components/Dashboard"
import VehicleModal from "./components/VehicleModal"
import { useVehicleData } from "./hooks/useVehicleData"

function App() {
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState("all")

  // NOTE: useVehicleData should now return fetchAllVehicles, fetchVehicleById, fetchVehiclesByStatus
  const {
    vehicles,
    statistics,
    loading,
    error,
    fetchAllVehicles,
    fetchVehicleById,
    fetchVehiclesByStatus,
    updateVehicles,
  } = useVehicleData()

  // Map UI filter -> API status path. Adjust if your backend uses different status names.
  const filterToApiStatus = (uiFilter) => {
    const map = {
      all: null,
      moving: "en_route",      // UI "moving" -> API "en_route"
      idle: "idle",
      delivered: "delivered",
      maintenance: "maintenance",
    }
    return map[uiFilter] ?? uiFilter
  }

  // Clicking a vehicle row: fetch full details by id and open modal
  const handleVehicleClick = useCallback(
    async (vehicleOrId) => {
      const id = typeof vehicleOrId === "string" ? vehicleOrId : vehicleOrId?.id
      if (!id) return

      // try to fetch the full details from GET /api/vehicles/{id}
      try {
        const full = await fetchVehicleById(id)
        if (full) {
          setSelectedVehicle(full)
          setShowModal(true)
        } else {
          // fallback: if fetch failed, try to open with the brief object in vehicles array
          const fallback = vehicles.find((v) => v.id === id)
          if (fallback) {
            setSelectedVehicle(fallback)
            setShowModal(true)
          }
        }
      } catch (err) {
        console.error("Error in handleVehicleClick:", err)
      }
    },
    [fetchVehicleById, vehicles]
  )

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setSelectedVehicle(null)
  }, [])

  // When the filter button changes, call the status endpoint (or fetchAll)
  const handleFilterChange = useCallback(
    async (status) => {
      setFilter(status)

      const apiStatus = filterToApiStatus(status)
      try {
        if (!apiStatus) {
          // "all"
          if (typeof fetchAllVehicles === "function") await fetchAllVehicles()
        } else {
          // fetch by status endpoint
          if (typeof fetchVehiclesByStatus === "function") {
            await fetchVehiclesByStatus(apiStatus)
          }
        }
      } catch (err) {
        console.error("Error fetching vehicles for filter:", err)
      }
    },
    [fetchAllVehicles, fetchVehiclesByStatus]
  )

  // Keep client-side fallback filtering if you want double-safety
  const filteredVehicles = Array.isArray(vehicles)
    ? filter === "all"
      ? vehicles
      : vehicles.filter((v) => (v.status || "").toLowerCase() === filter.toLowerCase())
    : []

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Fleet Tracking Dashboard</h1>
          <p>Real-time vehicle monitoring and management</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <Dashboard
        vehicles={filteredVehicles}
        statistics={statistics}
        loading={loading}
        onVehicleClick={handleVehicleClick}
        onFilterChange={handleFilterChange}
        currentFilter={filter}
      />

      {showModal && selectedVehicle && (
        <VehicleModal vehicle={selectedVehicle} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default App
