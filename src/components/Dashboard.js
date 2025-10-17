import Statistics from "./Statistics"
import FilterBar from "./FilterBar"
import VehicleList from "./VehicleList"
import "../styles/Dashboard.css"

function Dashboard({ vehicles, statistics, loading, onVehicleClick, onFilterChange, currentFilter }) {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Statistics statistics={statistics} loading={loading} />
        <FilterBar statistics={statistics} onFilterChange={onFilterChange} currentFilter={currentFilter} />
        <VehicleList vehicles={vehicles} loading={loading} onVehicleClick={onVehicleClick} />
      </div>
    </div>
  )
}

export default Dashboard
