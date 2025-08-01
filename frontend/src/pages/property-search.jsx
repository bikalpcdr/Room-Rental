import React, {useCallback, useEffect, useState} from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {createBooking, getAllProperties, searchProperties} from "../api";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import "../style/property-search.css";

const PROPERTY_TYPES = ["ROOM", "FLAT", "HOUSE"];
const PAYMENT_METHODS = ["E_SEWA", "KHALTI", "CASH"];
const PRICE_RANGES = [
    {label: "Any", value: ""},
    {label: "Under 5k", value: "5000"},
    {label: "Under 10k", value: "10000"},
    {label: "Under 15k", value: "15000"},
    {label: "Under 20k", value: "20000"}
];

const PropertyCard = React.memo(({property, onBook, onView}) => (
    <div className="property-card">
        <div className="property-card-header">
            <div className="property-type-badge">{property.propertyType}</div>
            <div className={`availability-badge ${property.isAvailable ? 'available' : 'unavailable'}`}>
                {property.isAvailable ? 'Available' : 'Unavailable'}
            </div>
        </div>

        <div className="property-card-content">
            <h3 className="property-title">{property.title || 'N/A'}</h3>
            <p className="property-address">📍 {property.address}</p>

            <div className="property-details">
                <div className="detail-item">
                    <span className="detail-icon">🏠</span>
                    <span>{property.roomCount} {property.roomCount === 1 ? 'Room' : 'Rooms'}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span>Rs. {property.rentPrice?.toLocaleString()}</span>
                </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
                <div className="property-amenities">
                    <h4>Amenities:</h4>
                    <div className="amenities-list">
                        {property.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                        {property.amenities.length > 3 && (
                            <span className="amenity-tag">+{property.amenities.length - 3} more</span>
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="property-card-actions">
            <button
                className="view-btn"
                onClick={() => onView(property.id)}
                disabled={!property.isAvailable}
            >
                View Details
            </button>
            <button
                className="book-btn"
                onClick={() => onBook(property)}
                disabled={!property.isAvailable}
            >
                {property.isAvailable ? 'Book Now' : 'Not Available'}
            </button>
        </div>
    </div>
));

PropertyCard.propTypes = {
    property: PropTypes.object.isRequired,
    onBook: PropTypes.func.isRequired,
    onView: PropTypes.func.isRequired,
};

const FilterSection = React.memo(({
                                      selectedType,
                                      address,
                                      priceRange,
                                      onTypeChange,
                                      onAddressChange,
                                      onPriceChange,
                                      onClearFilters
                                  }) => (
    <div className="filter-section">
        <div className="filter-header">
            <h3>🔍 Search Filters</h3>
            <button className="clear-filters-btn" onClick={onClearFilters}>
                Clear All
            </button>
        </div>

        <div className="filter-grid">
            <div className="filter-group">
                <label htmlFor="property-type">Property Type</label>
                <select
                    id="property-type"
                    value={selectedType}
                    onChange={onTypeChange}
                    className="filter-select"
                >
                    <option value="">All Types</option>
                    {PROPERTY_TYPES.map(type => (
                        <option key={type} value={type}>
                            {type.charAt(0) + type.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="address">Location</label>
                <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={onAddressChange}
                    placeholder="Enter city or area..."
                    className="filter-input"
                />
            </div>

            <div className="filter-group">
                <label htmlFor="priceRange">Price Range</label>
                <select
                    id="priceRange"
                    value={priceRange}
                    onChange={onPriceChange}
                    className="filter-select"
                >
                    {PRICE_RANGES.map(range => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    </div>
));

FilterSection.propTypes = {
    selectedType: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    priceRange: PropTypes.string.isRequired,
    onTypeChange: PropTypes.func.isRequired,
    onAddressChange: PropTypes.func.isRequired,
    onPriceChange: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired,
};

function PropertySearch() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState("");
    const [address, setAddress] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingProperty, setBookingProperty] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("E_SEWA");
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

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

    // Server-side filtering using searchProperties API
    const fetchFilteredProperties = useCallback(async (type, addr, price) => {
        setLoading(true);
        try {
            // If no filters, fetch all properties
            if (!type && !addr && !price) {
                await fetchProperties();
                return;
            }
            const filter = {};
            if (type) filter.propertyType = type;
            if (addr) filter.address = addr;
            if (price) filter.priceRange = Number(price);
            const res = await searchProperties(filter);
            setProperties(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to search properties");
        } finally {
            setLoading(false);
        }
    }, [fetchProperties]);

    // Handlers for each filter
    const onTypeChange = (e) => {
        const value = e.target.value;
        setSelectedType(value);
        fetchFilteredProperties(value, address, priceRange);
    };

    const onAddressChange = (e) => {
        const value = e.target.value;
        setAddress(value);
        fetchFilteredProperties(selectedType, value, priceRange);
    };

    const onPriceChange = (e) => {
        const value = e.target.value;
        setPriceRange(value);
        fetchFilteredProperties(selectedType, address, value);
    };

    const onClearFilters = () => {
        setSelectedType("");
        setAddress("");
        setPriceRange("");
        fetchProperties();
    };

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // Booking logic
    const openBookingModal = (property) => {
        if (!userData.id) {
            toast.error("Please login to book a property");
            navigate('/login');
            return;
        }
        setBookingProperty(property);
        setShowBookingModal(true);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        try {
            const bookingData = {
                propertyId: bookingProperty.id,
                userId: userData.id,
                paymentMethod: paymentMethod,
                amount: bookingProperty.rentPrice
            };

            if (paymentMethod === "CASH") {
                // For cash payments, create booking directly
                await createBooking(bookingData);
                toast.success("Booking created successfully! Please pay in cash.");
                setShowBookingModal(false);
            } else {
                // For online payments, redirect to payment gateway
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:7777'}/api/booking/initiate-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(bookingData)
                });

                if (response.ok) {
                    const html = await response.text();
                    // Open payment form in the same tab
                    document.open();
                    document.write(html);
                    document.close();
                    toast.success("Redirecting to payment gateway...");
                    setShowBookingModal(false);
                } else {
                    throw new Error('Payment initiation failed');
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to book property");
        } finally {
            setBookingLoading(false);
        }
    };

    const handleViewProperty = (propertyId) => {
        navigate(`/property/${propertyId}`);
    };

    const stats = {
        total: properties.length,
        available: properties.filter(p => p.isAvailable).length,
        filtered: properties.length
    };

    return (
        <>
            <Header/>
            <main className="property-search-page">
                <div className="search-header">
                    <div className="search-header-content">
                        <h1>🏠 Find Your Perfect Room</h1>
                        <p>Discover thousands of verified properties in your preferred location</p>
                    </div>
                </div>

                <div className="search-container">
                    <FilterSection
                        selectedType={selectedType}
                        address={address}
                        priceRange={priceRange}
                        onTypeChange={onTypeChange}
                        onAddressChange={onAddressChange}
                        onPriceChange={onPriceChange}
                        onClearFilters={onClearFilters}
                    />

                    <div className="results-section">
                        <div className="results-header">
                            <div className="results-stats">
                                <span>Showing {properties.length} properties</span>
                            </div>
                            <div className="view-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                                    onClick={() => setViewMode('cards')}
                                >
                                    🏠 Cards
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                                    onClick={() => setViewMode('table')}
                                >
                                    📋 Table
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading properties...</p>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="no-results">
                                <div className="no-results-icon">🔍</div>
                                <h3>No properties found</h3>
                                <p>Try adjusting your search filters or browse all available properties.</p>
                                <button className="clear-filters-btn" onClick={onClearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : viewMode === 'cards' ? (
                            <div className="properties-grid">
                                {properties.map((property) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                        onBook={openBookingModal}
                                        onView={handleViewProperty}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="properties-table">
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
                                            <td>{property.title || 'N/A'}</td>
                                            <td>
                                                <span className="property-type-badge">{property.propertyType}</span>
                                            </td>
                                            <td>{property.address}</td>
                                            <td>{property.roomCount}</td>
                                            <td>Rs. {property.rentPrice?.toLocaleString()}</td>
                                            <td>
                          <span className={`availability-badge ${property.isAvailable ? 'available' : 'unavailable'}`}>
                            {property.isAvailable ? 'Yes' : 'No'}
                          </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="view-btn"
                                                        onClick={() => handleViewProperty(property.id)}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        className="book-btn"
                                                        onClick={() => openBookingModal(property)}
                                                        disabled={!property.isAvailable}
                                                    >
                                                        Book
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

                {/* Booking Modal */}
                {showBookingModal && (
                    <div className="modal-overlay">
                        <div className="booking-modal">
                            <div className="modal-header">
                                <h2>Book Property</h2>
                                <button className="close-btn" onClick={() => setShowBookingModal(false)}>
                                    ×
                                </button>
                            </div>
                            <form className="modal-content" onSubmit={handleBooking}>
                                <div className="property-summary">
                                    <h3>Property Details</h3>
                                    <div className="property-summary-grid">
                                        <div>
                                            <strong>Title:</strong> {bookingProperty?.title || 'N/A'}
                                        </div>
                                        <div><strong>Type:</strong> {bookingProperty?.propertyType}</div>
                                        <div><strong>Address:</strong> {bookingProperty?.address}</div>
                                        <div><strong>Rooms:</strong> {bookingProperty?.roomCount}</div>
                                        <div><strong>Rent
                                            Price:</strong> Rs. {bookingProperty?.rentPrice?.toLocaleString()}</div>
                                        <div><strong>Available:</strong> {bookingProperty?.isAvailable ? 'Yes' : 'No'}
                                        </div>
                                    </div>
                                </div>

                                <div className="payment-section">
                                    <label htmlFor="payment-method">
                                        Payment Method:
                                    </label>
                                    <select
                                        id="payment-method"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="payment-select"
                                    >
                                        {PAYMENT_METHODS.map(method => (
                                            <option key={method} value={method}>
                                                {method === 'E_SEWA' ? 'eSewa' :
                                                    method === 'KHALTI' ? 'Khalti' :
                                                        method === 'CASH' ? 'Cash Payment' : method}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="payment-summary">
                                    <h4>Payment Summary</h4>
                                    <div className="summary-details">
                                        <div><strong>Amount to
                                            Pay:</strong> Rs. {bookingProperty?.rentPrice?.toLocaleString()}</div>
                                        <div><strong>Payment Method:</strong> {paymentMethod === 'E_SEWA' ? 'eSewa' :
                                            paymentMethod === 'KHALTI' ? 'Khalti' :
                                                paymentMethod === 'CASH' ? 'Cash Payment' : paymentMethod}</div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingModal(false)}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="confirm-btn"
                                        disabled={bookingLoading}
                                    >
                                        {bookingLoading ? "Processing..." : "Confirm Booking"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer/>
        </>
    );
}

export default PropertySearch; 