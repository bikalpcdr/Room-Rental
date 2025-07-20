import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import "../style/PropertyForm.css";

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

function PropertyForm({ formData, setFormData, onSubmit, onCancel, isEdit, onImagesChange }) {
  const handleAmenityChange = useCallback((amenity) => {
    setFormData((prev) =>
      prev.amenities.includes(amenity)
        ? { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }
        : { ...prev, amenities: [...prev.amenities, amenity] }
    );
  }, [setFormData]);

  const handleImagesChange = useCallback((e) => {
    if (typeof onImagesChange === 'function') {
      onImagesChange(Array.from(e.target.files));
    }
  }, [onImagesChange]);

  const amenityRows = useMemo(() => [AMENITIES.slice(0, 4), AMENITIES.slice(4, 8)], []);

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
      <div className="form-group">
        <label htmlFor="property-images">Property Images</label>
        <input
          id="property-images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
        />
      </div>
      <div className="modal-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">{isEdit ? "Update Property" : "Create Property"}</button>
      </div>
    </form>
  );
}

PropertyForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  onImagesChange: PropTypes.func,
};

export default PropertyForm;