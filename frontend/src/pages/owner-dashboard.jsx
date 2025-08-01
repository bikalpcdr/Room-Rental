import React, {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import PropertyForm from "../forms/PropertyForm";
import PropertyFormEdit from "../forms/PropertyFormEdit";
import PropertyImageUploadForm from "../forms/PropertyImageUploadForm";
import OwnerPropertyTable from "../components/OwnerPropertyTable";
import OwnerBookingRequestTable from "../components/OwnerBookingRequestTable";
import "../style/admin-dashboard.css";
import {
    approveBooking,
    createProperty,
    deleteProperty,
    fetchBookingRequests,
    getOwnerProperties,
    getPropertyById,
    rejectBooking,
    updateProperty,
    uploadPropertyImages
} from "../api";
import PropTypes from "prop-types";

const StatsCards = React.memo(({stats}) => (
    <div className="stats-container">
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

const ManagementCards = React.memo(({onPropertyManagementClick, onBookingRequestsClick}) => (
    <div className="management-cards-container">
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
            console.error("Error fetching bookings:", error);
        } finally {
            setBookingLoading(false);
        }
    }, []);

    const stats = useMemo(() => {
        const totalProperties = properties.length;
        const available = properties.filter(prop => prop.isAvailable).length;
        const rented = totalProperties - available;
        const totalValue = properties.reduce((sum, prop) => sum + (prop.rentPrice || 0), 0);
        return {totalProperties, available, rented, totalValue};
    }, [properties]);

    const handleAddProperty = useCallback(() => {
        setFormData({
            title: "",
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
            title: property.title || property.roomTitle || "",
            description: property.description || "",
            propertyType: property.propertyType || "",
            address: property.address || "",
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
                await updateProperty({...formData, propertyId: selectedProperty.propertyId || selectedProperty.id});
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
                <Header/>
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header/>
            <main className="admin-dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Owner Dashboard</h1>
                        <p style={{margin: '0.5rem 0 0 0', color: '#666', fontSize: '1rem'}}>
                            Welcome, {userData?.fullName} ({userData?.email})
                        </p>
                    </div>
                    {currentView === 'properties' && (
                        <button className="create-user-btn" onClick={handleAddProperty}>
                            + Add Property
                        </button>
                    )}
                    {(currentView === 'properties' || currentView === 'bookings') && (
                        <button className="back-btn" onClick={handleBackToDashboard}>
                            ← Back to Dashboard
                        </button>
                    )}
                </div>

                {currentView === 'dashboard' && (
                    <>
                        {/* Statistics Cards */}
                        <StatsCards stats={stats}/>

                        {/* Management Cards */}
                        <ManagementCards
                            onPropertyManagementClick={handlePropertyManagementClick}
                            onBookingRequestsClick={handleBookingRequestsClick}
                        />
                    </>
                )}

                {currentView === 'properties' && (
                    <div className="users-section">
                        <h2>Property Management</h2>
                        {properties.length === 0 ? (
                            <div className="coming-soon">
                                <div className="coming-soon-icon">🏠</div>
                                <h3>No Properties Found</h3>
                                <p>You haven't added any properties yet. Click "Add Property" to get started!</p>
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
                    </div>
                )}

                {currentView === 'bookings' && (
                    <div className="properties-section">
                        <h2>Booking Requests</h2>
                        <OwnerBookingRequestTable
                            bookings={bookings}
                            loading={bookingLoading}
                            onApprove={handleApproveBooking}
                            onReject={handleRejectBooking}
                            onViewProperty={handleViewPropertyFromBooking}
                        />
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
            </main>
            <Footer/>
        </>
    );
}

OwnerDashboard.propTypes = {};

export default React.memo(OwnerDashboard); 