import React, {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import Header from "../../components/header";
import Footer from "../../components/footer";
import RenterBookingTable from "../../components/RenterBookingTable";
// import "./style/renter-dashboard.css";
import {cancelBooking, getAllProperties, getBookingsByRenterId} from "../../api";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

const StatsCards = React.memo(({stats}) => (
    <div className="stats-container d-flex justify-content-center mt-3 mb-3 ">
        <div className="stat-card">
            <h3>Total Rentals</h3>
            <p className="stat-number">{stats.rentals}</p>
        </div>
        <div className="stat-card">
            <h3>Active Bookings</h3>
            <p className="stat-number">{stats.activeBookings}</p>
        </div>
        <div className="stat-card">
            <h3>Total Spent</h3>
            <p className="stat-number">Rs. {stats.totalSpent}</p>
        </div>
        <div className="stat-card">
            <h3>Saved Properties</h3>
            <p className="stat-number">{stats.savedProperties}</p>
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
    <div className="management-cards-container d-flex justify-content-center mt-3 mb-3">
        <div className="management-card" onClick={onBookingManagementClick}>
            <div className="management-card-icon">📋</div>
            <div className="management-card-content">
                <h3>My Bookings</h3>
                <p>View and manage your current bookings, track payment status, and cancel pending requests.</p>
                <div className="management-card-actions">
                    <span className="click-hint">Click to view →</span>
                </div>
            </div>
        </div>

        <div className="management-card" onClick={onPropertySearchClick}>
            <div className="management-card-icon">🔍</div>
            <div className="management-card-content">
                <h3>Search Properties</h3>
                <p>Browse available properties, filter by location and price, and book your perfect room.</p>
                <div className="management-card-actions">
                    <span className="click-hint">Click to view →</span>
                </div>
            </div>
        </div>

        <div className="management-card" onClick={onSavedPropertiesClick}>
            <div className="management-card-icon">❤️</div>
            <div className="management-card-content">
                <h3>Saved Properties</h3>
                <p>View your saved properties and favorite listings for quick access and future bookings.</p>
                <div className="management-card-actions">
                    <span className="click-hint">Click to view →</span>
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
            <main className="admin-dashboard w-80 border-1">
                <div className="dashboard-header">
                    <div>
                        <h1>Renter Dashboard</h1>
                        <p style={{margin: '0.5rem 0 0 0', color: '#666', fontSize: '1rem'}}>
                            Welcome, {userData?.fullName} ({userData?.email})
                        </p>
                    </div>
                    {(currentView === 'bookings' || currentView === 'properties' || currentView === 'saved') && (
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
                            onBookingManagementClick={handleBookingManagementClick}
                            onPropertySearchClick={handlePropertySearchClick}
                            onSavedPropertiesClick={handleSavedPropertiesClick}
                        />
                    </>
                )}

                {currentView === 'bookings' && (
                    <div className="users-section">
                        <h2>My Bookings</h2>
                        {bookings.length === 0 ? (
                            <div className="coming-soon">
                                <div className="coming-soon-icon">📋</div>
                                <h3>No Bookings Found</h3>
                                <p>You haven't made any bookings yet. Start searching for properties to book your
                                    perfect room!</p>
                            </div>
                        ) : (
                            <RenterBookingTable
                                bookings={bookings}
                                loading={loading}
                                onCancel={handleCancelBooking}
                                onViewProperty={handleViewProperty}
                            />
                        )}
                    </div>
                )}

                {currentView === 'properties' && (
                    <div className="properties-section">
                        <h2>All Properties</h2>
                        {propertyLoading ? (
                            <div className="admin-loading">
                                <div className="loading-spinner"></div>
                                <p>Loading properties...</p>
                            </div>
                        ) : propertyList.length === 0 ? (
                            <div className="coming-soon">
                                <div className="coming-soon-icon">🏠</div>
                                <h3>No Properties Found</h3>
                                <p>There are currently no properties available in the system.</p>
                            </div>
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
                                            <td>{property.title || 'N/A'}</td>
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
                )}

                {currentView === 'saved' && (
                    <div className="properties-section">
                        <h2>Saved Properties</h2>
                        <div className="coming-soon">
                            <div className="coming-soon-icon">❤️</div>
                            <h3>Saved Properties Coming Soon</h3>
                            <p>This feature is currently under development. You'll be able to save your favorite
                                properties for quick access.</p>
                        </div>
                    </div>
                )}
            </main>
            <Footer/>
        </>
    );
}

RenterDashboard.propTypes = {};

export default React.memo(RenterDashboard); 