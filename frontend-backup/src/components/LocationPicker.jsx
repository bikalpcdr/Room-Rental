import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        },
    });
    return null;
}

MapClickHandler.propTypes = {
    onMapClick: PropTypes.func.isRequired,
};

// Component to update map view when center changes
function ChangeMapView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom());
        }
    }, [center, zoom, map]);
    return null;
}

ChangeMapView.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
};

function LocationPicker({ formData, setFormData, address }) {
    const [locationError, setLocationError] = useState("");
    const [searchQuery, setSearchQuery] = useState(address || "");
    const [isSearching, setIsSearching] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [mapCenter, setMapCenter] = useState([27.7172, 85.3240]); // Default: Kathmandu, Nepal

    // Update map center when coordinates change
    useEffect(() => {
        if (formData.latitude != null && formData.longitude != null) {
            setMapCenter([formData.latitude, formData.longitude]);
        }
    }, [formData.latitude, formData.longitude]);

    // Update search query when address prop changes
    useEffect(() => {
        if (address) {
            setSearchQuery(address);
        }
    }, [address]);

    const updateLocation = useCallback((lat, lon) => {
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lon,
        }));
        setLocationError("");
    }, [setFormData]);

    const handleGetCurrentLocation = useCallback(() => {
        setLocationError("");
        setIsGettingLocation(true);

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser.");
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateLocation(latitude, longitude);
                setIsGettingLocation(false);
            },
            (error) => {
                let errorMessage = "Sorry, could not get your location.";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied by user.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out.";
                        break;
                    default:
                        errorMessage = "An unknown error occurred.";
                        break;
                }
                setLocationError(errorMessage);
                setIsGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [updateLocation]);

    const handleFindFromAddress = useCallback(async () => {
        const query = (searchQuery || "").trim();
        if (!query) {
            setLocationError("Please enter an address to search.");
            return;
        }

        setLocationError("");
        setIsSearching(true);

        try {
            // Using Nominatim API with proper user agent header
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
            const res = await fetch(url, {
                headers: {
                    Accept: "application/json",
                    "User-Agent": "RoomRentalApp/1.0",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to search location");
            }

            const data = await res.json();
            const first = Array.isArray(data) && data.length > 0 ? data[0] : null;

            if (!first?.lat || !first?.lon) {
                setLocationError("No results found for that address. Please try a different search term.");
                setIsSearching(false);
                return;
            }

            const lat = Number(first.lat);
            const lon = Number(first.lon);

            if (Number.isNaN(lat) || Number.isNaN(lon)) {
                setLocationError("Invalid location data received.");
                setIsSearching(false);
                return;
            }

            updateLocation(lat, lon);
            
            // Update address field if it's different from search query
            if (first.display_name && first.display_name !== formData.address) {
                setFormData((prev) => ({
                    ...prev,
                    address: first.display_name,
                }));
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            setLocationError("Failed to search location. Please try again later.");
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery, updateLocation, setFormData, formData.address]);

    const handleMapClick = useCallback((latlng) => {
        updateLocation(latlng.lat, latlng.lng);
    }, [updateLocation]);

    const handleMarkerDragEnd = useCallback((e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        updateLocation(position.lat, position.lng);
    }, [updateLocation]);

    const handleClearLocation = useCallback(() => {
        setLocationError("");
        setFormData((prev) => ({
            ...prev,
            latitude: null,
            longitude: null,
        }));
        setSearchQuery(address || "");
    }, [setFormData, address]);

    const hasLocation = formData.latitude != null && formData.longitude != null;

    return (
        <div className="form-group location-picker-container">
            <label htmlFor="location-picker">Location</label>
            <p className="location-picker-hint">
                Click on the map, drag the marker, use your current location, or search by address
            </p>

            {/* Action Buttons */}
            <div className="location-picker-actions">
                <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    className="location-btn location-btn-primary"
                >
                    {isGettingLocation ? "Getting Location..." : "📍 Use Current Location"}
                </button>
                <button
                    type="button"
                    onClick={handleClearLocation}
                    disabled={!hasLocation}
                    className="location-btn location-btn-secondary"
                >
                    Clear Location
                </button>
            </div>

            {/* Address Search */}
            <div className="location-picker-search">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleFindFromAddress();
                        }
                    }}
                    placeholder="Search address (e.g., Kathmandu, Nepal)"
                    className="location-search-input"
                    disabled={isSearching}
                />
                <button
                    type="button"
                    onClick={handleFindFromAddress}
                    disabled={isSearching || !searchQuery.trim()}
                    className="location-btn location-btn-search"
                >
                    {isSearching ? "Searching..." : "🔍 Search"}
                </button>
            </div>

            {/* Error Message */}
            {locationError && (
                <div className="location-picker-error" role="alert">
                    {locationError}
                </div>
            )}

            {/* Location Coordinates Display */}
            {hasLocation && (
                <div className="location-coordinates">
                    <strong>Selected Location:</strong>
                    <br />
                    Latitude: {formData.latitude.toFixed(6)}, Longitude: {formData.longitude.toFixed(6)}
                </div>
            )}

            {/* Map Container */}
            <div className="location-picker-map">
                <MapContainer
                    center={mapCenter}
                    zoom={hasLocation ? 15 : 13}
                    style={{ height: "400px", width: "100%", borderRadius: "8px", zIndex: 1 }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ChangeMapView center={mapCenter} zoom={hasLocation ? 15 : 13} />
                    {hasLocation && (
                        <Marker
                            position={[formData.latitude, formData.longitude]}
                            draggable={true}
                            eventHandlers={{
                                dragend: handleMarkerDragEnd,
                            }}
                        >
                            <Popup>
                                Property Location
                                <br />
                                {formData.address || "No address specified"}
                            </Popup>
                        </Marker>
                    )}
                    <MapClickHandler onMapClick={handleMapClick} />
                </MapContainer>
            </div>
        </div>
    );
}

LocationPicker.propTypes = {
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    address: PropTypes.string,
};

export default LocationPicker;
