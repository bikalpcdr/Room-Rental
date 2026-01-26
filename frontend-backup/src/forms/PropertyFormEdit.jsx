import React, { useCallback, useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../style/PropertyForm.css";
import { getPropertyById, deletePropertyImage } from "../api";
import LocationPicker from "../components/LocationPicker";

const PROPERTY_TYPES = ["ROOM", "FLAT", "HOUSE"];
const AMENITIES = [
  "FREE_WIFI",
  "TV",
  "AC",
  "KITCHEN",
  "PARKING",
  "ATTACHED_BATHROOM",
  "WATER",
  "COMMERCIAL_SPACE"
];

function PropertyFormEdit({ formData, setFormData, onSubmit, onCancel, propertyId }) {
  const [existingImages, setExistingImages] = useState([]);

  // Fetch property details and images on mount
  useEffect(() => {
    if (propertyId) {
      getPropertyById(propertyId).then(res => {
        const data = res.data?.data;
        setExistingImages(data?.images || []);
      });
    } else {
      setExistingImages([]);
    }
  }, [propertyId]);

  const handleAmenityChange = useCallback((amenity) => {
    setFormData((prev) =>
        prev.amenities.includes(amenity)
            ? { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }
            : { ...prev, amenities: [...prev.amenities, amenity] }
    );
  }, [setFormData]);

  const handleDeleteImage = async (imageId) => {
    await deletePropertyImage(imageId);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const amenityRows = useMemo(() => [AMENITIES.slice(0, 4), AMENITIES.slice(4, 8)], []);

  const API_BASE_URL = "http://localhost:7777";

  const toImageSrc = useCallback((img) => {
    const raw = img?.url || img?.imageUrl;
    if (!raw) return "";
    return raw.startsWith("http") ? raw : API_BASE_URL + raw;
  }, []);

  return (
      <form onSubmit={onSubmit} autoComplete="off">
        <div className="form-group">
          <label htmlFor="property-title">Title</label>
          <input
              id="property-title"
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g. Cozy Room in City Center"
          />
        </div>
        <div className="form-group">
          <label htmlFor="property-description">Description</label>
          <textarea
              id="property-description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Describe your property, features, nearby places, etc."
              rows={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="property-type">Property Type</label>
          <select
              id="property-type"
              value={formData.propertyType}
              onChange={e => setFormData({ ...formData, propertyType: e.target.value })}
              required
          >
            <option value="">Select Type</option>
            {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="property-address">Address</label>
          <input
              id="property-address"
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              required
              placeholder="e.g. 123 Main St, Kathmandu"
          />
        </div>

        <LocationPicker
            formData={formData}
            setFormData={setFormData}
            address={formData.address}
        />

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="property-roomCount">Room Count</label>
            <input
                id="property-roomCount"
                type="number"
                value={formData.roomCount}
                onChange={e => setFormData({ ...formData, roomCount: Number(e.target.value) })}
                required
                min={1}
                placeholder="e.g. 2"
            />
          </div>
          <div className="form-group">
            <label htmlFor="property-rentPrice">Rent Price</label>
            <input
                id="property-rentPrice"
                type="number"
                value={formData.rentPrice}
                onChange={e => setFormData({ ...formData, rentPrice: Number(e.target.value) })}
                required
                min={0}
                placeholder="e.g. 15000"
            />
          </div>
          <div className="form-group">
            <label htmlFor="property-available">Available</label>
            <select
                id="property-available"
                value={formData.isAvailable}
                onChange={e => setFormData({ ...formData, isAvailable: e.target.value === "true" })}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Amenities</label>
          <div>
            {amenityRows.map((row, i) => (
                <div className="amenities-row" key={i}>
                  {row.map((amenity) => (
                      <label key={amenity} className="amenity-checkbox">
                        <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                        />
                        {amenity}
                      </label>
                  ))}
                </div>
            ))}
          </div>
        </div>
        {existingImages.length > 0 && (
            <div className="form-group">
              <label>Existing Images</label>
              <div className="existing-images-container">
                <div className="existing-images-grid">
                  {existingImages.map((img) => (
                      <div key={img.id} className="existing-image-item">
                        <img
                            src={toImageSrc(img)}
                            alt="property"
                            className="existing-image-thumbnail"
                        />
                        <button
                            type="button"
                            className="existing-image-delete"
                            onClick={() => handleDeleteImage(img.id)}
                            aria-label="Delete image"
                        >
                          ×
                        </button>
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}
        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">Update Property</button>
        </div>
      </form>
  );
}

PropertyFormEdit.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  propertyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PropertyFormEdit; 