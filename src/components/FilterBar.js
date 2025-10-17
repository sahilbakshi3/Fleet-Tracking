"use client"
import "../styles/FilterBar.css"

function FilterBar({ statistics, onFilterChange, currentFilter, children }) {
  const filters = [
    { id: "all", label: "All Vehicles", count: statistics?.total || 0 },
    { id: "moving", label: "Moving", count: statistics?.moving || 0 },
    { id: "idle", label: "Idle", count: statistics?.idle || 0 },
    { id: "delivered", label: "Delivered", count: statistics?.delivered || 0 },
    { id: "maintenance", label: "Maintenance", count: statistics?.maintenance || 0 },
  ]

  return (
    <div className="filter-bar">
      <div className="filter-container">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`filter-button ${currentFilter === filter.id ? "active" : ""}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <span className="filter-label">{filter.label}</span>
            <span className="filter-count">{filter.count}</span>
          </button>
        ))}
      </div>

      {/* Vehicle list (passed from Dashboard) will appear here */}
      <div className="filter-vehicle-list">
        {children}
      </div>
    </div>
  )
}

export default FilterBar
