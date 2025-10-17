import React, { useState } from "react"
import VehicleTable from "./VehicleTable"
import "../styles/MainContent.css"

function MainContent({ vehicles, onVehicleClick, activeFilter }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  const vehicleCount = vehicles.length

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) => {
    const query = searchQuery.toLowerCase()
    return (
      vehicle.id?.toLowerCase().includes(query) ||
      vehicle.driver_name?.toLowerCase().includes(query) ||
      vehicle.destination?.toLowerCase().includes(query) ||
      vehicle.status?.toLowerCase().includes(query) ||
      vehicle.current_location?.toLowerCase().includes(query)
    )
  })

  // Sort vehicles
  const sortedVehicles = React.useMemo(() => {
    let sortableVehicles = [...filteredVehicles]
    
    if (sortConfig.key) {
      sortableVehicles.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue == null) return 1
        if (bValue == null) return -1
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }
        
        const aString = String(aValue).toLowerCase()
        const bString = String(bValue).toLowerCase()
        
        if (aString < bString) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (aString > bString) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    
    return sortableVehicles
  }, [filteredVehicles, sortConfig])

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getFilterLabel = (filter) => {
    const labels = {
      all: "All Vehicles",
      moving: "Moving Vehicles",
      idle: "Idle Vehicles",
      delivered: "Delivered Vehicles",
      maintenance: "Vehicles in Maintenance",
    }
    return labels[filter] || "Vehicles"
  }

  return (
    <main className="main-content">
      <div className="main-header">
        <div className="main-header-left">
          <div className="main-title-section">
            <h2 className="main-title">
              {getFilterLabel(activeFilter)}
            </h2>
            <span className="vehicle-count-badge">{vehicleCount}</span>
          </div>
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search vehicles, drivers, locations..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="main-header-right">
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">Live</span>
          </div>
          
          <div className="view-options">
            <button className="view-button active" title="Table view">
              <span>☰</span>
            </button>
            <button className="view-button" title="Grid view" disabled>
              <span>⊞</span>
            </button>
          </div>
        </div>
      </div>
      
      {searchQuery && (
        <div className="search-results-info">
          <span className="results-text">
            Found {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 ? "s" : ""} matching "{searchQuery}"
          </span>
          {sortedVehicles.length < vehicleCount && (
            <button className="clear-filters-btn" onClick={() => setSearchQuery("")}>
              Clear search
            </button>
          )}
        </div>
      )}
      
      <VehicleTable
        vehicles={sortedVehicles}
        onVehicleClick={onVehicleClick}
        onSort={handleSort}
        sortConfig={sortConfig}
      />
      
      {sortedVehicles.length > 0 && (
        <div className="main-footer">
          <div className="footer-info">
            Showing {sortedVehicles.length} of {vehicleCount} vehicles
          </div>
        </div>
      )}
    </main>
  )
}

export default MainContent