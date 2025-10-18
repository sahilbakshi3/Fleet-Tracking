import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import VehicleModal from "./components/VehicleModal";
import { useVehicleData } from "./hooks/useVehicleData";
import "./styles/App.css";

function App() {
  const {
    vehicles,
    statistics,
    loading,
    error,
    selectedVehicle,
    lastUpdated,
    lastUpdatedAt,
    setSelectedVehicle,
    fetchAllVehicles,
    fetchVehiclesByStatus,
  } = useVehicleData();

  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- SOFT REFRESH LOGIC (every 3 minutes) ---
  useEffect(() => {
    const REFRESH_INTERVAL = 3 * 60 * 1000; // 3 minutes

    const refreshData = () => {
      // Only refresh when user is viewing the page
      if (document.visibilityState === "visible") {
        console.log("🔄 Soft refreshing fleet data...");
        if (activeFilter === "all") {
          fetchAllVehicles();
        } else {
          fetchVehiclesByStatus(activeFilter);
        }
      }
    };

    // Run refresh every 3 minutes
    const interval = setInterval(refreshData, REFRESH_INTERVAL);

    // Optional: refresh once when user switches back to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeFilter, fetchAllVehicles, fetchVehiclesByStatus]);

  // --- FILTER + MODAL HANDLERS ---
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === "all") {
      fetchAllVehicles();
    } else {
      fetchVehiclesByStatus(filter);
    }
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading fleet data...</p>
        </div>
      </div>
    );
  }

  // --- MAIN UI ---
  return (
    <div className="app">
      <Header />

      {error && <div className="error-banner">{error}</div>}

      <div className="app-layout">
        <Sidebar
          statistics={statistics}
          lastUpdated={lastUpdated}
          lastUpdatedAt={lastUpdatedAt}
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
        <VehicleModal vehicle={selectedVehicle} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
