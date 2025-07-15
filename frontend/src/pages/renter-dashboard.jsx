import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/admin-dashboard.css";

function RenterDashboard() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [stats, setStats] = useState({
    rentals: 0,
    activeBookings: 0,
    totalSpent: 0,
    savedProperties: 0
  });

  useEffect(() => {
    // Check if we should show welcome toast
    const showWelcomeToast = localStorage.getItem('showWelcomeToast');
    if (showWelcomeToast === 'true') {
      toast.success(`Welcome back, ${userData.fullName}! 🏠`);
      localStorage.removeItem('showWelcomeToast');
    }
  }, []);

  const handleSearchRooms = () => {
    toast.info("Room search features coming soon!");
  };

  const handleViewBookings = () => {
    toast.info("Booking management features coming soon!");
  };

  const handleViewSaved = () => {
    toast.info("Saved properties features coming soon!");
  };

  const handleViewSpending = () => {
    toast.info("Spending tracking features coming soon!");
  };

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Renter Dashboard</h1>
          <p>Welcome, {userData.fullName}!</p>
        </div>

        <div className="stats-container">
          <div className="stat-card" onClick={handleViewBookings} style={{ cursor: 'pointer' }}>
            <h3>My Rentals</h3>
            <p className="stat-number">{stats.rentals}</p>
            <small>Click to view rentals</small>
          </div>
          <div className="stat-card" onClick={handleViewBookings} style={{ cursor: 'pointer' }}>
            <h3>Active Bookings</h3>
            <p className="stat-number">{stats.activeBookings}</p>
            <small>Click to view bookings</small>
          </div>
          <div className="stat-card" onClick={handleViewSpending} style={{ cursor: 'pointer' }}>
            <h3>Total Spent</h3>
            <p className="stat-number">${stats.totalSpent}</p>
            <small>Click to view details</small>
          </div>
          <div className="stat-card" onClick={handleViewSaved} style={{ cursor: 'pointer' }}>
            <h3>Saved Properties</h3>
            <p className="stat-number">{stats.savedProperties}</p>
            <small>Click to view saved</small>
          </div>
        </div>

        <div className="users-section">
          <h2>Rental Management</h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            Rental management features coming soon...
          </p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="create-user-btn" 
              onClick={handleSearchRooms}
              style={{ margin: '0 1rem' }}
            >
              🔍 Search Rooms
            </button>
            <button 
              className="create-user-btn" 
              onClick={handleViewBookings}
              style={{ margin: '0 1rem' }}
            >
              📋 View Bookings
            </button>
            <button 
              className="create-user-btn" 
              onClick={handleViewSaved}
              style={{ margin: '0 1rem' }}
            >
              ❤️ Saved Properties
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default RenterDashboard; 