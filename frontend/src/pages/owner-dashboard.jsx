import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import PropertyForm from "../forms/PropertyForm";
import "../style/admin-dashboard.css";
import { getOwnerProperties, createProperty, updateProperty, deleteProperty, getPropertyById } from "../api";
import PropTypes from "prop-types";

function OwnerDashboard() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({
    roomTitle: "",
    description: "",
    propertyType: "",
    address: "",
    roomCount: 1,
    rentPrice: 0,
    isAvailable: true,
    amenities: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
    const showWelcomeToast = localStorage.getItem('showWelcomeToast');
    if (showWelcomeToast === 'true') {
      toast.success(`Welcome back, ${userData.fullName}! 🏠`);
      localStorage.removeItem('showWelcomeToast');
    }
    // eslint-disable-next-line
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOwnerProperties();
      setProperties(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddProperty = useCallback(() => {
    setFormData({
      roomTitle: "",
      description: "",
      propertyType: "",
      address: "",
      roomCount: 1,
      rentPrice: 0,
      isAvailable: true,
      amenities: [],
    });
    setIsEdit(false);
    setShowFormModal(true);
  }, []);

  const handleEditProperty = useCallback((property) => {
    setFormData({
      ...property,
      title: property.title || property.roomTitle || "",
    });
    setSelectedProperty(property);
    setIsEdit(true);
    setShowFormModal(true);
  }, []);

  const handleDeleteProperty = useCallback(async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(propertyId);
        toast.success("Property deleted successfully!");
        fetchProperties();
      } catch (err) {
        toast.error("Failed to delete property");
      }
    }
  }, [fetchProperties]);

  const handleViewProperty = useCallback(async (property) => {
    try {
      const res = await getPropertyById(property.id || property.propertyId);
      const details = res.data?.data;
      toast.info(`Title: ${details.title || details.roomTitle}\nAddress: ${details.address}`);
    } catch (err) {
      toast.error("Failed to fetch property details");
    }
  }, []);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProperty({ ...formData, propertyId: selectedProperty.propertyId || selectedProperty.id });
        toast.success("Property updated successfully!");
      } else {
        await createProperty(formData);
        toast.success("Property created successfully!");
      }
      setShowFormModal(false);
      fetchProperties();
    } catch (err) {
      toast.error("Failed to save property");
    }
  }, [isEdit, formData, selectedProperty, fetchProperties]);

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
            <p className="stat-number">{properties.length}</p>
            <small>Click to add property</small>
          </div>
        </div>

        <div className="users-section">
          <h2>Property Management</h2>
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
              No properties found. Click "+ Add Property" to create one.
            </p>
          ) : (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>S.N</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Rooms</th>
                    <th>Rent</th>
                    <th>Available</th>
                    <th>Amenities</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property, index) => (
                    <tr key={property.id || property.propertyId}>
                      <td>{index+1}</td>
                      <td>{property.roomTitle || property.roomTitle}</td>
                      <td>{property.propertyType}</td>
                      <td>{property.address}</td>
                      <td>{property.roomCount}</td>
                      <td>{property.rentPrice}</td>
                      <td>{property.isAvailable ? "Yes" : "No"}</td>
                      <td className={"first"}>{property.amenities?.join(", ")}</td>
                      <td className={"btn"}>
                        <button className="view-btn" onClick={() => navigate(`/property/${property.id || property.propertyId}`)}>
                          View
                        </button>
                        <button className="edit-btn" onClick={() => handleEditProperty(property)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteProperty(property.id || property.propertyId)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="create-user-btn" 
              onClick={handleAddProperty}
              style={{ margin: '0 1rem' }}
            >
              + Add Property
            </button>
          </div>
        </div>

        {/* Property Form Modal */}
        {showFormModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{isEdit ? "Edit Property" : "Add Property"}</h2>
                <button className="close-btn" onClick={() => setShowFormModal(false)}>
                  ×
                </button>
              </div>
              <PropertyForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowFormModal(false)}
                isEdit={isEdit}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

OwnerDashboard.propTypes = {};

export default React.memo(OwnerDashboard); 