"use client"
import VehicleCard from "./VehicleCard"
import "../styles/VehicleList.css"

function VehicleList({ vehicles, loading, onVehicleClick }) {
  if (loading) {
    return <div className="vehicle-list-loading">Loading vehicles...</div>
  }

  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return <div className="vehicle-list-empty">No vehicles found</div>
  }

  return (
    <div className="vehicle-list">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={() => onVehicleClick(vehicle)} />
      ))}
    </div>
  )
}

export default VehicleList
