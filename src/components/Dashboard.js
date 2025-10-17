import Statistics from "./Statistics"
import FilterBar from "./FilterBar"
import VehicleList from "./VehicleList"
import "../styles/Dashboard.css"

function Dashboard({ vehicles, statistics, loading, onVehicleClick, onFilterChange, currentFilter }) {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Filter card appears above Fleet Statistics */}
        <FilterBar
          statistics={statistics}
          onFilterChange={onFilterChange}
          currentFilter={currentFilter}
        >
          <VehicleList
            vehicles={vehicles}
            loading={loading}
            onVehicleClick={onVehicleClick}
          />
        </FilterBar>

        {/* Fleet statistics grid */}
        <Statistics statistics={statistics} loading={loading} />
      </div>
    </div>
  )
}

export default Dashboard
