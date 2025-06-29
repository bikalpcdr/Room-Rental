import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/admin-dashboard.css";

function OwnerDashboard() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [stats, setStats] = useState({
    properties: 0,
    activeRentals: 0,
    totalRevenue: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    // Check if we should show welcome toast
    const showWelcomeToast = localStorage.getItem('showWelcomeToast');
    if (showWelcomeToast === 'true') {
      toast.success(`Welcome back, ${userData.fullName}! 🏠`);
      localStorage.removeItem('showWelcomeToast');
    }
  }, []);

  const handleAddProperty = () => {
    toast.info("Property management features coming soon!");
  };

  const handleViewRequests = () => {
    toast.info("Request management features coming soon!");
  };

  const handleViewRevenue = () => {
    toast.info("Revenue tracking features coming soon!");
  };

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Owner Dashboard</h1>
          <p>Welcome, {userData.fullName}!</p>
        </div>

        <div className="stats-container">
          <div className="stat-card" onClick={handleAddProperty} style={{ cursor: 'pointer' }}>
            <h3>My Properties</h3>
            <p className="stat-number">{stats.properties}</p>
            <small>Click to add property</small>
          </div>
          <div className="stat-card" onClick={handleViewRequests} style={{ cursor: 'pointer' }}>
            <h3>Active Rentals</h3>
            <p className="stat-number">{stats.activeRentals}</p>
            <small>Click to view rentals</small>
          </div>
          <div className="stat-card" onClick={handleViewRevenue} style={{ cursor: 'pointer' }}>
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue}</p>
            <small>Click to view details</small>
          </div>
          <div className="stat-card" onClick={handleViewRequests} style={{ cursor: 'pointer' }}>
            <h3>Pending Requests</h3>
            <p className="stat-number">{stats.pendingRequests}</p>
            <small>Click to view requests</small>
          </div>
        </div>

        <div className="users-section">
          <h2>Property Management</h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            Property management features coming soon...
          </p>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="create-user-btn" 
              onClick={handleAddProperty}
              style={{ margin: '0 1rem' }}
            >
              + Add Property
            </button>
            <button 
              className="create-user-btn" 
              onClick={handleViewRequests}
              style={{ margin: '0 1rem' }}
            >
              View Requests
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default OwnerDashboard; 