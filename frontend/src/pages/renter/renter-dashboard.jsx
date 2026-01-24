import React, {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import Header from "../../components/header";
import Footer from "../../components/footer";
import RenterBookingTable from "../../components/RenterBookingTable";
import {cancelBooking, getAllProperties, getBookingsByRenterId} from "../../api";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

const StatsCards = React.memo(({stats}) => (
    <div className="row justify-content-center g-4 mb-4">
        <div className="col-md-3 col-sm-6">
            <div className="stat-card card h-100">
                <div className="card-body text-center">
                    <h3 className="card-title">Total Rentals</h3>
                    <p className="stat-number card-text display-4 fw-bold">{stats.rentals}</p>
                </div>
            </div>
        </div>
        <div className="col-md-3 col-sm-6">
            <div className="stat-card card h-100">
                <div className="card-body text-center">
                    <h3 className="card-title">Active Bookings</h3>
                    <p className="stat-number card-text display-4 fw-bold">{stats.activeBookings}</p>
                </div>
            </div>
        </div>
        <div className="col-md-3 col-sm-6">
            <div className="stat-card card h-100">
                <div className="card-body text-center">
                    <h3 className="card-title">Total Spent</h3>
                    <p className="stat-number card-text display-4 fw-bold">Rs. {stats.totalSpent}</p>
                </div>
            </div>
        </div>
        <div className="col-md-3 col-sm-6">
            <div className="stat-card card h-100">
                <div className="card-body text-center">
                    <h3 className="card-title">Saved Properties</h3>
                    <p className="stat-number card-text display-4 fw-bold">{stats.savedProperties}</p>
                </div>
            </div>
        </div>
    </div>
));

StatsCards.propTypes = {
    stats: PropTypes.shape({
        rentals: PropTypes.number,
        activeBookings: PropTypes.number,
        totalSpent: PropTypes.number,
        savedProperties: PropTypes.number,
    }).isRequired,
};

const ManagementCards = React.memo(({onBookingManagementClick, onPropertySearchClick, onSavedPropertiesClick}) => (
    <div className="row justify-content-center g-4 mb-4">
        <div className="col-md-4 col-sm-12">
            <div className="management-card card h-100" onClick={onBookingManagementClick}>
                <div className="card-body text-center">
                    <div className="management-card-icon mb-3">📋</div>
                    <h3 className="card-title">My Bookings</h3>
                    <p className="card-text">View and manage your current bookings, track payment status, and cancel pending requests.</p>
                    <div className="management-card-actions">
                        <span className="click-hint">Click to view →</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-md-4 col-sm-12">
            <div className="management-card card h-100" onClick={onPropertySearchClick}>
                <div className="card-body text-center">
                    <div className="management-card-icon mb-3">🔍</div>
                    <h3 className="card-title">Search Properties</h3>
                    <p className="card-text">Browse available properties, filter by location and price, and book your perfect room.</p>
                    <div className="management-card-actions">
                        <span className="click-hint">Click to view →</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="col-md-4 col-sm-12">
            <div className="management-card card h-100" onClick={onSavedPropertiesClick}>
                <div className="card-body text-center">
                    <div className="management-card-icon mb-3">❤️</div>
                    <h3 className="card-title">Saved Properties</h3>
                    <p className="card-text">View your saved properties and favorite listings for quick access and future bookings.</p>
                    <div className="management-card-actions">
                        <span className="click-hint">Click to view →</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
));

ManagementCards.propTypes = {
    onBookingManagementClick: PropTypes.func.isRequired,
    onPropertySearchClick: PropTypes.func.isRequired,
    onSavedPropertiesClick: PropTypes.func.isRequired,
};

function RenterDashboard() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'bookings', 'properties', 'saved'
    const [propertyList, setPropertyList] = useState([]);
    const [propertyLoading, setPropertyLoading] = useState(false);

    const navigate = useNavigate();

    const fetchBookings = useCallback(async () => {
        if (!userData.id) return;

        setLoading(true);
        try {
            const res = await getBookingsByRenterId(userData.id);
            const bookingsData = res.data?.data || [];
            setBookings(bookingsData);
        } catch (err) {
            toast.error("Failed to fetch bookings");
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    }, [userData.id]);

    const fetchProperties = useCallback(async () => {
        try {
            setPropertyLoading(true);
            const response = await getAllProperties();
            setPropertyList(response.data?.data || []);
        } catch (error) {
            toast.error("Failed to fetch properties");
            console.error("Error fetching properties:", error);
        } finally {
            setPropertyLoading(false);
        }
    }, []);

    const stats = useMemo(() => {
        const rentals = bookings.length;
        const activeBookings = bookings.filter(b =>
            b.status === 'PENDING' || b.status === 'CONFIRMED'
        ).length;

        const totalSpent = bookings
            .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
            .reduce((sum, b) => sum + (b.property?.rentPrice || 0), 0);

        return {
            rentals,
            activeBookings,
            totalSpent,
            savedProperties: 0 // TODO: Implement saved properties feature
        };
    }, [bookings]);

    useEffect(() => {
        fetchBookings();
        const showWelcomeToast = localStorage.getItem('showWelcomeToast');
        if (showWelcomeToast === 'true') {
            toast.success(`Welcome back, ${userData.fullName}! 🏠`);
            localStorage.removeItem('showWelcomeToast');
        }
    }, [fetchBookings, userData.fullName]);

    const handleCancelBooking = useCallback(async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await cancelBooking(bookingId);
                toast.success("Booking cancelled successfully!");
                fetchBookings();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to cancel booking");
            }
        }
    }, [fetchBookings]);

    const handleViewProperty = useCallback((propertyId) => {
        navigate(`/property/${propertyId}`);
    }, [navigate]);

    const handleBookingManagementClick = useCallback(() => {
        setCurrentView('bookings');
    }, []);

    const handlePropertySearchClick = useCallback(() => {
        navigate('/property-search');
    }, [navigate]);

    const handleSavedPropertiesClick = useCallback(() => {
        setCurrentView('saved');
        toast.info("Saved properties feature coming soon!");
    }, []);

    const handleBackToDashboard = useCallback(() => {
        setCurrentView('dashboard');
    }, []);

    if (loading) {
        return (
            <>
                <Header/>
                <div className="rd-loading d-flex flex-column justify-content-center align-items-center" style={{minHeight: '60vh'}}>
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading dashboard...</p>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header/>
            <main className="rd-main container-fluid py-4">
                <div className="rd-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                    <div className="rd-header-text">
                        <h1 className="fw-bold mb-1">Renter Dashboard</h1>
                        <p className="rd-welcome-text">
                            Welcome, {userData?.fullName} ({userData?.email})
                        </p>
                    </div>
                    <div className="rd-header-actions mt-3 mt-md-0 d-flex gap-2 flex-wrap">
                        {(currentView === 'bookings' || currentView === 'properties' || currentView === 'saved') && (
                            <button
                                className="btn btn-outline-secondary bg-primary text-white"
                                onClick={handleBackToDashboard}
                            >
                                ← Back to Dashboard
                            </button>
                        )}
                    </div>
                </div>

                {currentView === 'dashboard' && (
                    <>
                        {/* Statistics Cards */}
                        <StatsCards stats={stats}/>

                        {/* Management Cards */}
                        <ManagementCards
                            onBookingManagementClick={handleBookingManagementClick}
                            onPropertySearchClick={handlePropertySearchClick}
                            onSavedPropertiesClick={handleSavedPropertiesClick}
                        />
                    </>
                )}

                {currentView === 'bookings' && (
                    <section className="rd-section">
                        <h2 className="mb-3">My Bookings</h2>
                        {bookings.length === 0 ? (
                            <div className="rd-empty text-center py-5">
                                <div className="rd-empty-icon mb-2">📋</div>
                                <h3>No Bookings Found</h3>
                                <p>You haven't made any bookings yet. Start searching for properties to book your perfect room!</p>
                            </div>
                        ) : (
                            <RenterBookingTable
                                bookings={bookings}
                                loading={loading}
                                onCancel={handleCancelBooking}
                                onViewProperty={handleViewProperty}
                            />
                        )}
                    </section>
                )}

                {currentView === 'properties' && (
                    <section className="rd-section">
                        <h2 className="mb-3">All Properties</h2>
                        {propertyLoading ? (
                            <div className="rd-loading text-center py-5">
                                <div className="spinner-border mb-3"></div>
                                <p>Loading properties...</p>
                            </div>
                        ) : propertyList.length === 0 ? (
                            <div className="rd-empty text-center py-5">
                                <div className="rd-empty-icon mb-2">🏠</div>
                                <h3>No Properties Found</h3>
                                <p>There are currently no properties available in the system.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover table-striped">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">Title</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">Rooms</th>
                                            <th scope="col">Rent Price</th>
                                            <th scope="col">Available</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {propertyList.map((property) => (
                                            <tr key={property.id}>
                                                <td>{property.title || 'N/A'}</td>
                                                <td><span className="badge bg-info text-dark">{property.propertyType}</span></td>
                                                <td>{property.address}</td>
                                                <td>{property.roomCount}</td>
                                                <td><strong>Rs. {property.rentPrice}</strong></td>
                                                <td>
                                                    {property.isAvailable ? (
                                                        <span className="badge bg-success">Available</span>
                                                    ) : (
                                                        <span className="badge bg-secondary">Not Available</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {currentView === 'saved' && (
                    <section className="rd-section">
                        <h2 className="mb-3">Saved Properties</h2>
                        <div className="rd-empty text-center py-5">
                            <div className="rd-empty-icon mb-2">❤️</div>
                            <h3>Saved Properties Coming Soon</h3>
                            <p>This feature is currently under development. You'll be able to save your favorite properties for quick access.</p>
                        </div>
                    </section>
                )}
            </main>
            <Footer/>
        </>
    );
}

RenterDashboard.propTypes = {};

export default React.memo(RenterDashboard); 