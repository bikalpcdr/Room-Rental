import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import PropertyForm from "../forms/PropertyForm";
import PropertyFormEdit from "../forms/PropertyFormEdit";
import PropertyImageUploadForm from "../forms/PropertyImageUploadForm";
import FloatingTableModal from "../components/FloatingTableModal";
import OwnerPropertyTable from "../components/OwnerPropertyTable";
import "../style/admin-dashboard.css";
import { getOwnerProperties, createProperty, updateProperty, deleteProperty, getPropertyById, uploadPropertyImages, approveBooking, cancelBooking, fetchBookingRequests } from "../api";
import PropTypes from "prop-types";
import { ViewPropertyModal } from "../pages/view-property";
import OwnerBookingRequestTable from "../components/OwnerBookingRequestTable";

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [newPropertyId, setNewPropertyId] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [existingImageCount, setExistingImageCount] = useState(0);
  
  // Booking request states
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  
  // Property management state
  const [showPropertyTable, setShowPropertyTable] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [propertyModalId, setPropertyModalId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
    fetchBookings();
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

  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const res = await fetchBookingRequests();
      setBookings(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch booking requests");
    } finally {
      setBookingsLoading(false);
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
      // Show all property info and images in a modal or alert
      let info = `Title: ${details.roomTitle || details.title}\nAddress: ${details.address}\nType: ${details.propertyType}\nRooms: ${details.roomCount}\nRent: ${details.rentPrice}\nAvailable: ${details.isAvailable ? "Yes" : "No"}\nAmenities: ${(details.amenities || []).join(", ")}`;
      if (details.images && details.images.length > 0) {
        info += `\nImages:\n` + details.images.map(img => (img.url ? (window.location.origin + img.url) : (window.location.origin + img))).join("\n");
      }
      alert(info);
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
        setShowFormModal(false);
        fetchProperties();
      } else {
        // 1. Create property (no images)
        await createProperty(formData);
        setShowFormModal(false);
        toast.success("Property created successfully!");
        fetchProperties();
      }
      setSelectedImages([]);
    } catch (err) {
      toast.error("Failed to save property");
    }
  }, [isEdit, formData, selectedProperty, fetchProperties]);

  const handleImageUpload = async () => {
    console.log("Upload Images clicked", selectedImages, newPropertyId);
    try {
      if (selectedImages.length > 0 && newPropertyId) {
        await uploadPropertyImages(newPropertyId, selectedImages);
        toast.success("Images uploaded successfully!");
        setShowImageUpload(false);
        setNewPropertyId(null);
        fetchProperties();
      }
    } catch (err) {
      toast.error("Failed to upload images");
    }
  };

  const openImageUploadModal = async (propertyId) => {
    setNewPropertyId(propertyId);
    setSelectedImages([]);
    setShowImageUpload(true);
    // Fetch property details to get current image count
    try {
      const res = await getPropertyById(propertyId);
      setExistingImageCount(res.data?.data?.images?.length || 0);
    } catch {
      setExistingImageCount(0);
    }
  };

  // Booking request handlers
  const handleViewBookings = useCallback(() => {
    setShowBookingsModal(true);
  }, []);

  const handleApproveBooking = useCallback(async (bookingId) => {
    try {
      await approveBooking(bookingId);
      toast.success("Booking approved successfully!");
      fetchBookings();
      fetchProperties(); // Refresh properties to update availability
    } catch (err) {
      toast.error("Failed to approve booking");
    }
  }, [fetchBookings, fetchProperties]);

  const handleRejectBooking = useCallback(async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking rejected successfully!");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to reject booking");
    }
  }, [fetchBookings]);

  const getPendingBookingsCount = () => {
    return bookings.filter(booking => booking.status === 'PENDING').length;
  };

  const handleViewProperties = useCallback(() => {
    setShowPropertyTable(true);
  }, []);

  const handleViewPropertyModal = useCallback((propertyId) => {
    setShowPropertyTable(false); // Close the table modal
    setPropertyModalId(propertyId);
    setShowPropertyModal(true);
  }, []);

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
          <div className="stat-card" onClick={handleViewBookings} style={{ cursor: 'pointer' }}>
            <h3>Booking Requests</h3>
            <p className="stat-number">{getPendingBookingsCount()}</p>
            <small>Click to view requests</small>
          </div>
          <div className="stat-card" onClick={handleViewProperties} style={{ cursor: 'pointer' }}>
            <h3>Property Management</h3>
            <p className="stat-number">{properties.length}</p>
            <small>Click to manage properties</small>
          </div>
        </div>

        {/* Property Management Floating Table */}
        {showPropertyTable && (
          <FloatingTableModal
            isOpen={showPropertyTable}
            onClose={() => setShowPropertyTable(false)}
            title="Property Management"
          >
            {loading ? (
              <p>Loading properties...</p>
            ) : properties.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
                No properties found. Click "+ Add Property" to create one.
              </p>
            ) : (
              <OwnerPropertyTable
                properties={properties}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
                onUploadImages={openImageUploadModal}
                onViewProperty={handleViewPropertyModal}
              />
            )}
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
                onClick={handleViewBookings}
                style={{ margin: '0 1rem' }}
              >
                📋 View Booking Requests
              </button>
            </div>
          </FloatingTableModal>
        )}

        {/* Booking Requests Modal */}
        {showBookingsModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Booking Requests</h2>
                <button className="close-btn" onClick={() => setShowBookingsModal(false)}>
                  ×
                </button>
              </div>
              <div className="modal-content">
                <OwnerBookingRequestTable
                  bookings={bookings}
                  loading={bookingsLoading}
                  onApprove={handleApproveBooking}
                  onReject={handleRejectBooking}
                  onViewProperty={handleViewPropertyModal}
                />
              </div>
            </div>
          </div>
        )}

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
              {isEdit ? (
                <PropertyFormEdit
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowFormModal(false)}
                  propertyId={selectedProperty?.propertyId || selectedProperty?.id}
                />
              ) : (
                <PropertyForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowFormModal(false)}
                  isEdit={isEdit}
                />
              )}
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Upload Images for Property</h2>
                <button type="button" className="close-btn" onClick={() => setShowImageUpload(false)}>
                  ×
                </button>
              </div>
              <PropertyImageUploadForm
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                onUpload={handleImageUpload}
                onCancel={() => setShowImageUpload(false)}
                existingImageCount={existingImageCount}
              />
            </div>
          </div>
        )}

        {/* Property Details Floating Modal */}
        {showPropertyModal && (
          <ViewPropertyModal
            propertyId={propertyModalId}
            isOpen={showPropertyModal}
            onClose={() => setShowPropertyModal(false)}
          />
        )}
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

OwnerDashboard.propTypes = {};

export default React.memo(OwnerDashboard); 