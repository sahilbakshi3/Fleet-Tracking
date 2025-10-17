import React, { useState, useEffect } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import MainContent from "./components/MainContent"
import VehicleModal from "./components/VehicleModal"
import { useVehicleData } from "./hooks/useVehicleData"
import "./styles/App.css"

function App() {
  const {
    vehicles,
    statistics,
    loading,
    error,
    selectedVehicle,
    lastUpdated,
    setSelectedVehicle,
    fetchAllVehicles,
    fetchVehiclesByStatus,
  } = useVehicleData()

  const [activeFilter, setActiveFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    if (filter === "all") {
      fetchAllVehicles()
    } else {
      fetchVehiclesByStatus(filter)
    }
  }

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVehicle(null)
  }

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading fleet data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />
      
      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}
      
      <div className="app-layout">
        <Sidebar
          statistics={statistics}
          lastUpdated={lastUpdated}
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
        />
        
        <MainContent
          vehicles={vehicles}
          onVehicleClick={handleVehicleClick}
          activeFilter={activeFilter}
        />
      </div>
      
      {isModalOpen && selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App