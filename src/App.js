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
  const { vehicles, statistics, loading, error, updateVehicles } = useVehicleData()

  const handleVehicleClick = useCallback((vehicle) => {
    setSelectedVehicle(vehicle)
    setShowModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setSelectedVehicle(null)
  }, [])

  const handleFilterChange = useCallback((status) => {
    setFilter(status)
  }, [])

  const filteredVehicles = Array.isArray(vehicles)
    ? filter === "all"
      ? vehicles
      : vehicles.filter((v) => v.status && v.status.toLowerCase() === filter.toLowerCase())
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

      {showModal && selectedVehicle && <VehicleModal vehicle={selectedVehicle} onClose={handleCloseModal} />}
    </div>
  )
}

export default App
