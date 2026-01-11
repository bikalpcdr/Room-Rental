import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";

function LocationPicker({ formData, setFormData, address }) {
    const [locationError, setLocationError] = useState("");
    const [searchQuery, setSearchQuery] = useState(address || "");
    const [isSearching, setIsSearching] = useState(false);

    const handleGetCurrentLocation = useCallback(() => {
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
                setLocationError("Sorry, no position available.");
            }
        );
    }, [formData, setFormData]);

    const handleFindFromAddress = useCallback(async () => {
        const query = (searchQuery || "").trim();
        if (!query) {
            setLocationError("Please enter an address to search.");
            return;
        }

        setLocationError("");
        setIsSearching(true);

        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
            const res = await fetch(url, {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                setLocationError("Failed to search location.");
                return;
            }

            const data = await res.json();
            const first = Array.isArray(data) ? data[0] : null;

            if (!first?.lat || !first?.lon) {
                setLocationError("No results found for that address.");
                return;
            }

            setFormData({
                ...formData,
                latitude: Number(first.lat),
                longitude: Number(first.lon),
            });
        } catch (e) {
            setLocationError("Failed to search location.");
        } finally {
            setIsSearching(false);
        }
    }, [formData, searchQuery, setFormData]);

    const handleClearLocation = useCallback(() => {
        setLocationError("");
        setFormData({
            ...formData,
            latitude: null,
            longitude: null,
        });
    }, [formData, setFormData]);

    const mapSrc = useMemo(() => {
        if (formData.latitude == null || formData.longitude == null) return "";
        const lat = Number(formData.latitude);
        const lon = Number(formData.longitude);
        if (Number.isNaN(lat) || Number.isNaN(lon)) return "";
        const delta = 0.01;
        const left = lon - delta;
        const right = lon + delta;
        const top = lat + delta;
        const bottom = lat - delta;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
    }, [formData.latitude, formData.longitude]);

    return (
        <div className="form-group">
            <label>Location</label>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" onClick={handleGetCurrentLocation}>
                    Use Current Location
                </button>
                <button type="button" onClick={handleClearLocation}>
                    Clear
                </button>
            </div>

            <div style={{ marginTop: 10 }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search address to mark location"
                />
                <button
                    type="button"
                    onClick={handleFindFromAddress}
                    disabled={isSearching}
                    style={{ marginTop: 8 }}
                >
                    {isSearching ? "Searching..." : "Find From Address"}
                </button>
            </div>

            {locationError && (
                <div style={{ marginTop: 8, color: "#c62828", fontSize: 13 }}>
                    {locationError}
                </div>
            )}

            {formData.latitude != null && formData.longitude != null && (
                <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>
                    Latitude: {formData.latitude}
                    <br />
                    Longitude: {formData.longitude}
                </div>
            )}

            {mapSrc && (
                <div
                    style={{
                        marginTop: 10,
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        overflow: "hidden",
                    }}
                >
                    <iframe
                        title="property-location"
                        src={mapSrc}
                        width="100%"
                        height="260"
                        style={{ border: 0 }}
                        loading="lazy"
                    />
                </div>
            )}
        </div>
    );
}

LocationPicker.propTypes = {
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    address: PropTypes.string,
};

export default LocationPicker;