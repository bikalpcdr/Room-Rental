import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { getAllProperties, searchProperties, createBooking } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PROPERTY_TYPES = ["ROOM", "FLAT", "HOUSE"];

function PropertySearch() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [address, setAddress] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingProperty, setBookingProperty] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  // Fetch all properties on mount
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllProperties();
      setProperties(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  }, []);

  // Search properties by filters
  const handleFilterChange = async (type, addr, price) => {
    setLoading(true);
    try {
      if (type || addr || price) {
        const filter = {};
        if (type) filter.propertyType = type;
        if (addr) filter.address = addr;
        if (price) filter.priceRange = Number(price);
        const res = await searchProperties(filter);
        setProperties(res.data?.data || []);
      } else {
        // If no filters, fetch all properties
        await fetchProperties();
      }
    } catch (err) {
      toast.error("Failed to search properties");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for each filter
  const onTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    handleFilterChange(value, address, priceRange);
  };
  const onAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    handleFilterChange(selectedType, value, priceRange);
  };
  const onPriceChange = (e) => {
    const value = e.target.value;
    setPriceRange(value);
    handleFilterChange(selectedType, address, value);
  };

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Booking logic
  const openBookingModal = (property) => {
    setBookingProperty(property);
    setShowBookingModal(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      await createBooking({
        propertyId: bookingProperty.id,
        userId: userData.id,
      });
      toast.success("Booking request sent!");
      setShowBookingModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book property");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Property Search</h1>
        </div>
        <div style={{ margin: "1rem 0", display: 'flex', gap: 16, alignItems: 'center' }}>
          <label htmlFor="property-type">Filter by Type: </label>
          <select
            id="property-type"
            value={selectedType}
            onChange={onTypeChange}
            style={{ marginLeft: 8 }}
          >
            <option value="">All</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
            ))}
          </select>
          <label htmlFor="address" style={{ marginLeft: 16 }}>Address: </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={onAddressChange}
            placeholder="e.g. Kathmandu"
            style={{ marginLeft: 8 }}
          />
          <label htmlFor="priceRange" style={{ marginLeft: 16 }}>Max Price: </label>
          <input
            id="priceRange"
            type="number"
            value={priceRange}
            onChange={onPriceChange}
            placeholder="e.g. 20000"
            style={{ marginLeft: 8, width: 100 }}
            min={0}
          />
        </div>
        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td>{property.title || property.roomTitle || 'N/A'}</td>
                    <td>{property.propertyType}</td>
                    <td>{property.address}</td>
                    <td>{property.roomCount}</td>
                    <td>{property.rentPrice}</td>
                    <td>{property.isAvailable ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="view-btn" onClick={() => navigate(`/property/${property.id}`)}>View</button>
                      <button className="view-btn" onClick={() => openBookingModal(property)}>Book</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Book Property</h2>
                <button className="close-btn" onClick={() => setShowBookingModal(false)}>
                  ×
                </button>
              </div>
              <form className="modal-content" onSubmit={handleBooking}>
                <div style={{ marginBottom: 16 }}>
                  <strong>Property:</strong> {bookingProperty?.title || bookingProperty?.roomTitle || 'N/A'}
                </div>
                <button type="submit" className="create-user-btn" disabled={bookingLoading}>
                  {bookingLoading ? "Booking..." : "Book Now"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default PropertySearch; 