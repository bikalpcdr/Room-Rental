import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/admin-dashboard.css";
import { getBookingsByRenterId, getAllProperties } from "../api";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function RenterDashboard() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [selectedBookingType, setSelectedBookingType] = useState('');
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyList, setPropertyList] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(false);

  const [stats, setStats] = useState({
    rentals: 0,
    activeBookings: 0,
    totalSpent: 0,
    savedProperties: 0
  });

  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    if (!userData.id) return;
    
    setLoading(true);
    try {
      const res = await getBookingsByRenterId(userData.id);
      const bookingsData = res.data?.data || [];
      setBookings(bookingsData);
      
      // Calculate stats
      const activeBookings = bookingsData.filter(b => 
        b.status === 'PENDING' || b.status === 'CONFIRMED'
      ).length;
      
      const totalSpent = bookingsData
        .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
        .reduce((sum, b) => sum + (b.property?.rentPrice || 0), 0);
      
      setStats({
        rentals: bookingsData.length,
        activeBookings,
        totalSpent,
        savedProperties: 0 // TODO: Implement saved properties feature
      });
    } catch (err) {
      toast.error("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [userData.id]);

  useEffect(() => {
    fetchBookings();
    const showWelcomeToast = localStorage.getItem('showWelcomeToast');
    if (showWelcomeToast === 'true') {
      toast.success(`Welcome back, ${userData.fullName}! 🏠`);
      localStorage.removeItem('showWelcomeToast');
    }
  }, [fetchBookings, userData.fullName]);

  const handleSearchRooms = useCallback(() => {
    navigate('/property-search');
  }, [navigate]);

  const handleViewBookings = useCallback((type = 'all') => {
    setSelectedBookingType(type);
    setShowBookingsModal(true);
  }, []);

  const handleViewSaved = useCallback(() => {
    toast.info("Saved properties features coming soon!");
  }, []);

  const handleViewSpending = useCallback(() => {
    handleViewBookings('spending');
  }, [handleViewBookings]);

  const getFilteredBookings = useCallback(() => {
    switch (selectedBookingType) {
      case 'active':
        return bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED');
      case 'spending':
        return bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
      default:
        return bookings;
    }
  }, [bookings, selectedBookingType]);

  const getModalTitle = useCallback(() => {
    switch (selectedBookingType) {
      case 'active':
        return 'Active Bookings';
      case 'spending':
        return 'Booking History & Spending';
      default:
        return 'All My Bookings';
    }
  }, [selectedBookingType]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Renter Dashboard</h1>
          <p>Welcome, {userData.fullName}!</p>
        </div>

        <div className="stats-container">
          <div className="stat-card" onClick={() => handleViewBookings('all')} style={{ cursor: 'pointer' }}>
            <h3>My Rentals</h3>
            <p className="stat-number">{stats.rentals}</p>
            <small>Click to view rentals</small>
          </div>
          <div className="stat-card" onClick={() => handleViewBookings('active')} style={{ cursor: 'pointer' }}>
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
            Manage your bookings and find new properties
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
              onClick={() => handleViewBookings('all')}
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

        {/* Bookings Modal */}
        {showBookingsModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{getModalTitle()}</h2>
                <button className="close-btn" onClick={() => setShowBookingsModal(false)}>
                  ×
                </button>
              </div>
              <div className="modal-content">
                {getFilteredBookings().length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    No bookings found.
                  </p>
                ) : (
                  <div className="table-container">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Address</th>
                          <th>Status</th>
                          <th>Rent Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredBookings().map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.property?.title || booking.property?.roomTitle || 'N/A'}</td>
                            <td>{booking.property?.address || 'N/A'}</td>
                            <td>
                              <span className={`role-badge role-${booking.status?.toLowerCase()}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td>${booking.property?.rentPrice || 0}</td>
                            <td>
                              <div className="action-buttons">
                                {booking.status === 'PENDING' && (
                                  <button 
                                    className="delete-btn" 
                                    onClick={() => {
                                      // TODO: Implement cancel booking
                                      toast.info("Cancel booking feature coming soon!");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button 
                                  className="view-btn" 
                                  onClick={() => {
                                    // TODO: Navigate to property view
                                    toast.info("Property view feature coming soon!");
                                  }}
                                >
                                  View Property
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Property Search Modal */}
        {showPropertyModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>All Properties</h2>
                <button className="close-btn" onClick={() => setShowPropertyModal(false)}>
                  ×
                </button>
              </div>
              <div className="modal-content">
                {propertyLoading ? (
                  <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading properties...</p>
                  </div>
                ) : propertyList.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    No properties found.
                  </p>
                ) : (
                  <div className="table-container">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Address</th>
                          <th>Rooms</th>
                          <th>Rent Price</th>
                          <th>Available</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyList.map((property) => (
                          <tr key={property.id}>
                            <td>{property.title || property.roomTitle || 'N/A'}</td>
                            <td>{property.propertyType}</td>
                            <td>{property.address}</td>
                            <td>{property.roomCount}</td>
                            <td>{property.rentPrice}</td>
                            <td>{property.isAvailable ? 'Yes' : 'No'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

RenterDashboard.propTypes = {};

export default React.memo(RenterDashboard); 