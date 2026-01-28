import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationPickerProps {
    formData: {
        latitude: number | null;
        longitude: number | null;
        [key: string]: any;
    };
    setFormData: (data: any) => void;
    address?: string;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        },
    });
    return null;
}

// Component to update map view when center changes
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom?: number }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom());
        }
    }, [center, zoom, map]);
    return null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ formData, setFormData, address }) => {
    const [locationError, setLocationError] = useState("");
    const [searchQuery, setSearchQuery] = useState(address || "");
    const [isSearching, setIsSearching] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([27.7172, 85.3240]); // Default: Kathmandu, Nepal

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

    const updateLocation = useCallback((lat: number, lon: number) => {
        setFormData((prev: any) => ({
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
                }
                setLocationError(errorMessage);
                setIsGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000,
            }
        );
    }, [updateLocation]);

    const handleMapClick = useCallback((latlng: L.LatLng) => {
        updateLocation(latlng.lat, latlng.lng);
    }, [updateLocation]);

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) {
            setLocationError("Please enter a location to search.");
            return;
        }

        setIsSearching(true);
        setLocationError("");

        try {
            // Using Nominatim API for geocoding (free and open)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            
            if (!response.ok) {
                throw new Error("Search request failed");
            }

            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                updateLocation(parseFloat(lat), parseFloat(lon));
                setMapCenter([parseFloat(lat), parseFloat(lon)]);
            } else {
                setLocationError("Location not found. Please try a different search term.");
            }
        } catch (error) {
            setLocationError("Failed to search location. Please try again.");
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery, updateLocation]);

    return (
        <div className="space-y-4">
            {/* Search and Current Location Controls */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a location..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSearching ? "Searching..." : "Search"}
                </button>
                <button
                    onClick={handleGetCurrentLocation}
                    disabled={isGettingLocation}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                    {isGettingLocation ? "Getting Location..." : "📍 Use Current Location"}
                </button>
            </div>

            {/* Error Message */}
            {locationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {locationError}
                </div>
            )}

            {/* Current Coordinates Display */}
            {formData.latitude != null && formData.longitude != null && (
                <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                        <strong>Selected Location:</strong> {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </p>
                </div>
            )}

            {/* Map */}
            <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapClickHandler onMapClick={handleMapClick} />
                    <ChangeMapView center={mapCenter} />
                    
                    {formData.latitude != null && formData.longitude != null && (
                        <Marker position={[formData.latitude, formData.longitude]}>
                            <Popup>
                                <div className="text-sm">
                                    <strong>Selected Location</strong><br />
                                    Lat: {formData.latitude.toFixed(6)}<br />
                                    Lng: {formData.longitude.toFixed(6)}
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            <p className="text-xs text-gray-500">
                Click on the map or search to select a location. You can also use your current location.
            </p>
        </div>
    );
};

export default LocationPicker;
