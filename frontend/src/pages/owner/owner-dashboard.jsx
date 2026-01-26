import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import PropertyForm from "../../forms/PropertyForm";
import PropertyImageUploadForm from "../../forms/PropertyImageUploadForm";
import OwnerPropertyTable from "../../components/OwnerPropertyTable";
import OwnerBookingRequestTable from "../../components/OwnerBookingRequestTable";
import "./style/owner-dashboard.css";
import {
    approveBooking,
    createPropertyWithImages,
    deleteProperty,
    fetchBookingRequests,
    getOwnerProperties,
    getPropertyById,
    rejectBooking,
    updateProperty,
    uploadPropertyImages
} from "../../api";
import PropTypes from "prop-types";

const StatsCards = React.memo(({ stats }) => (
    <div className="stats-container d-flex gap-5 flex-wrap justify-content-center">
        <div className="stat-card">
            <h3>Total Properties</h3>
            <p className="stat-number">{stats.totalProperties}</p>
        </div>
        <div className="stat-card">
            <h3>Available</h3>
            <p className="stat-number">{stats.available}</p>
        </div>
        <div className="stat-card">
            <h3>Rented</h3>
            <p className="stat-number">{stats.rented}</p>
        </div>
        <div className="stat-card">
            <h3>Total Value</h3>
            <p className="stat-number">Rs. {stats.totalValue}</p>
        </div>
    </div>
));

StatsCards.propTypes = {
    stats: PropTypes.shape({
        totalProperties: PropTypes.number,
        available: PropTypes.number,
        rented: PropTypes.number,
        totalValue: PropTypes.number,
    }).isRequired,
};

const ManagementCards = React.memo(({ onPropertyManagementClick, onBookingRequestsClick }) => (
    <div className="management-cards-container d-flex gap-4 flex-wrap justify-content-center mt-4 mb-4">
        <div className="management-card" onClick={onPropertyManagementClick}>
            <div className="management-card-icon">🏠</div>
            <div className="management-card-content">
                <h3>Property Management</h3>
                <p>Manage your properties, add new listings, edit details, upload images, and control availability.</p>
                <div className="management-card-actions">
                    <span className="click-hint">Click to view →</span>
                </div>
            </div>
        </div>

        <div className="management-card" onClick={onBookingRequestsClick}>
            <div className="management-card-icon">📋</div>
            <div className="management-card-content">
                <h3>Booking Requests</h3>
                <p>View and manage booking requests from renters, approve or reject applications, and track rental
                    status.</p>
                <div className="management-card-actions">
                    <span className="click-hint">Click to view →</span>
                </div>
            </div>
        </div>
    </div>
));

ManagementCards.propTypes = {
    onPropertyManagementClick: PropTypes.func.isRequired,
    onBookingRequestsClick: PropTypes.func.isRequired,
};

function OwnerDashboard() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'properties', 'bookings'
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        propertyType: "",
        address: "",
        latitude: null,
        longitude: null,
        roomCount: 1,
        rentPrice: 0,
        isAvailable: true,
        amenities: [],
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [newPropertyId, setNewPropertyId] = useState(null);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [existingImageCount, setExistingImageCount] = useState(0);

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

    const fetchBookings = useCallback(async () => {
        try {
            setBookingLoading(true);
            const response = await fetchBookingRequests();
            setBookings(response.data?.data || []);
        } catch (error) {
            toast.error("Failed to fetch booking requests");
        } finally {
            setBookingLoading(false);
        }
    }, []);

    const stats = useMemo(() => {
        const totalProperties = properties.length;
        const available = properties.filter(prop => prop.isAvailable).length;
        const rented = totalProperties - available;
        const totalValue = properties.reduce((sum, prop) => sum + (prop.rentPrice || 0), 0);
        return { totalProperties, available, rented, totalValue };
    }, [properties]);

    const handleAddProperty = useCallback(() => {
        setFormData({
            title: "",
            description: "",
            propertyType: "",
            address: "",
            latitude: null,
            longitude: null,
            roomCount: 1,
            rentPrice: 0,
            isAvailable: true,
            amenities: [],
        });
        setSelectedImages([]);
        setSelectedProperty(null);
        setIsEdit(false);
        setShowFormModal(true);
    }, []);

    const handleEditProperty = useCallback((property) => {
        setFormData({
            title: property.title || property.roomTitle || "",
            description: property.description || "",
            propertyType: property.propertyType || "",
            address: property.address || "",
            latitude: property.latitude ?? null,
            longitude: property.longitude ?? null,
            roomCount: property.roomCount || 1,
            rentPrice: property.rentPrice || 0,
            isAvailable: property.isAvailable !== undefined ? property.isAvailable : true,
            amenities: property.amenities || [],
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

    const handleViewProperty = useCallback((property) => {
        navigate(`/property/${property.id || property.propertyId}`);
    }, [navigate]);

    const handleFormSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                const propertyId = selectedProperty?.propertyId || selectedProperty?.id;
                await updateProperty({ ...formData, propertyId });

                // Upload new images if any are selected
                if (selectedImages && selectedImages.length > 0) {
                    await uploadPropertyImages(propertyId, selectedImages);
                    toast.success("Property and images updated successfully!");
                } else {
                    toast.success("Property updated successfully!");
                }
                setShowFormModal(false);
                fetchProperties();
            } else {
                await createPropertyWithImages(formData, selectedImages);
                setShowFormModal(false);
                toast.success("Property created successfully!");
                fetchProperties();
            }
            setSelectedImages([]);
        } catch (err) {
            toast.error("Failed to save property");
        }
    }, [isEdit, formData, selectedProperty, fetchProperties, selectedImages]);

    const handleImageUpload = async () => {
        if (selectedImages.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        try {
            await uploadPropertyImages(newPropertyId, selectedImages);
            toast.success("Images uploaded successfully!");
            setShowImageUpload(false);
            setSelectedImages([]);
            fetchProperties();
        } catch (err) {
            toast.error("Failed to upload images");
        }
    };

    const openImageUploadModal = async (propertyId) => {
        setNewPropertyId(propertyId);
        setSelectedImages([]);
        setShowImageUpload(true);
    };

    const handleApproveBooking = useCallback(async (bookingId) => {
        if (window.confirm("Are you sure you want to approve this booking request?")) {
            try {
                await approveBooking(bookingId);
                toast.success("Booking request approved successfully!");
                fetchBookings();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to approve booking request");
            }
        }
    }, [fetchBookings]);

    const handleRejectBooking = useCallback(async (bookingId) => {
        if (window.confirm("Are you sure you want to reject this booking request?")) {
            try {
                await rejectBooking(bookingId);
                toast.success("Booking request rejected successfully!");
                fetchBookings();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to reject booking request");
            }
        }
    }, [fetchBookings]);

    const handleViewPropertyFromBooking = useCallback((propertyId) => {
        navigate(`/property/${propertyId}`);
    }, [navigate]);

    const handlePropertyManagementClick = useCallback(() => {
        setCurrentView('properties');
    }, []);

    const handleBookingRequestsClick = useCallback(() => {
        setCurrentView('bookings');
        fetchBookings(); // Fetch bookings when switching to booking view
    }, [fetchBookings]);

    const handleBackToDashboard = useCallback(() => {
        setCurrentView('dashboard');
    }, []);

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
            <main className="od-main container-fluid py-4">

                {/* Header */}
                <div className="od-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">

                    <div className="od-header-text">
                        <h1 className="fw-bold mb-1">Owner Dashboard</h1>
                        <p className="od-welcome-text">
                            Welcome, {userData?.fullName} ({userData?.email})
                        </p>
                    </div>

                    <div className="od-header-actions mt-3 mt-md-0 d-flex gap-2 flex-wrap">
                        {currentView === 'properties' && (
                            <button
                                type="button"
                                className="btn btn-success od-btn-add"
                                onClick={handleAddProperty}
                                aria-label="Add new property"
                            >
                                + Add Property
                            </button>
                        )}

                        {(currentView === 'properties' || currentView === 'bookings') && (
                            <button
                                className="btn btn-outline-secondary bg-primary text-white"
                                onClick={handleBackToDashboard}
                            >
                                ← Back to Dashboard
                            </button>
                        )}
                    </div>
                </div>

                {/* Dashboard */}
                {currentView === 'dashboard' && (
                    <>
                        <StatsCards stats={stats} />
                        <ManagementCards
                            onPropertyManagementClick={handlePropertyManagementClick}
                            onBookingRequestsClick={handleBookingRequestsClick}
                        />
                    </>
                )}

                {/* Property Management */}
                {currentView === 'properties' && (
                    <section className="od-section">
                        <h2 className="mb-3">Property Management</h2>

                        {properties.length === 0 ? (
                            <div className="od-empty text-center py-5">
                                <div className="od-empty-icon mb-2">🏠</div>
                                <h3>No Properties Found</h3>
                                <p>
                                    You haven't added any properties yet. Click
                                    <strong> "Add Property"</strong> to get started!
                                </p>
                            </div>
                        ) : (
                            <OwnerPropertyTable
                                properties={properties}
                                onEdit={handleEditProperty}
                                onDelete={handleDeleteProperty}
                                onUploadImages={openImageUploadModal}
                                onViewProperty={handleViewProperty}
                            />
                        )}
                    </section>
                )}

                {/* Booking Requests */}
                {currentView === 'bookings' && (
                    <section className="od-section">
                        <h2 className="mb-3">Booking Requests</h2>
                        <OwnerBookingRequestTable
                            bookings={bookings}
                            loading={bookingLoading}
                            onApprove={handleApproveBooking}
                            onReject={handleRejectBooking}
                            onViewProperty={handleViewPropertyFromBooking}
                        />
                    </section>
                )}

                {/* Property Form Modal (Portal) */}
                {showFormModal && createPortal(
                    <div
                        className="od-modal-overlay"
                        onClick={(e) => e.target === e.currentTarget && setShowFormModal(false)}
                        id="od-property-form-overlay"
                    >
                        <div
                            className="od-modal-box"
                            onClick={(e) => e.stopPropagation()}
                            id="od-property-form-modal"
                        >
                            <div className="od-modal-header">
                                <h2>{isEdit ? "Edit Property" : "Add Property"}</h2>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowFormModal(false)}
                                    aria-label="Close modal"
                                ></button>
                            </div>

                            <PropertyForm
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={handleFormSubmit}
                                onCancel={() => setShowFormModal(false)}
                                isEdit={isEdit}
                                propertyId={selectedProperty?.propertyId || selectedProperty?.id}
                                selectedImages={selectedImages}
                                setSelectedImages={setSelectedImages}
                            />
                        </div>
                    </div>,
                    document.body
                )}

                {/* Image Upload Modal */}
                {showImageUpload && (
                    <div className="od-modal-overlay">
                        <div className="od-modal-box">
                            <div className="od-modal-header">
                                <h2>Upload Images for Property</h2>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowImageUpload(false)}
                                ></button>
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

            </main>

            <Footer />
        </>
    );
}

OwnerDashboard.propTypes = {};

export default OwnerDashboard;