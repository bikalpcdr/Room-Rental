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

function PropertyForm({ formData, setFormData, onSubmit, onCancel, isEdit, propertyId, selectedImages, setSelectedImages }) {
  const [existingImages, setExistingImages] = useState([]);

  // Fetch property details and images on edit
  useEffect(() => {
    if (isEdit && propertyId) {
      getPropertyById(propertyId).then(res => {
        const data = res.data?.data;
        setExistingImages(data?.images || []);
      });
    } else {
      setExistingImages([]);
    }
  }, [isEdit, propertyId]);

  const handleAmenityChange = useCallback((amenity) => {
    setFormData((prev) =>
        prev.amenities.includes(amenity)
            ? { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }
            : { ...prev, amenities: [...prev.amenities, amenity] }
    );
  }, [setFormData]);

  const handleDeleteImage = async (imageId) => {
    try {
      await deletePropertyImage(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleFileChange = useCallback((e) => {
    if (!setSelectedImages) return;
    
    const files = Array.from(e.target.files || []);
    // Combine previous and new files, avoid duplicates by name and size
    let combined = [...(selectedImages || []), ...files];
    combined = combined.filter((file, idx, arr) =>
      arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
    );
    
    // Limit to 20 total images (existing + new)
    const maxNewImages = isEdit ? 20 - existingImages.length : 20;
    if (combined.length > maxNewImages) {
      alert(`You can only upload ${maxNewImages} more images for this property.`);
      setSelectedImages(combined.slice(0, maxNewImages));
    } else {
      setSelectedImages(combined);
    }
    
    // Reset the input so the same file can be selected again
    e.target.value = '';
  }, [selectedImages, setSelectedImages, isEdit, existingImages.length]);

  // Remove a selected image by index
  const handleRemoveSelectedImage = useCallback((idx) => {
    if (!setSelectedImages) return;
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
  }, [setSelectedImages]);

  const amenityRows = useMemo(() => [AMENITIES.slice(0, 4), AMENITIES.slice(4, 8)], []);

  const API_BASE_URL = "http://localhost:7777";

  const toImageSrc = useCallback((img) => {
    const raw = img?.url || img?.imageUrl;
    if (!raw) return "";
    return raw.startsWith("http") ? raw : API_BASE_URL + raw;
  }, []);

  // Generate previews for selected images
  const imagePreviews = useMemo(() => {
    if (!selectedImages || selectedImages.length === 0) return [];
    return selectedImages.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
  }, [selectedImages]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

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

        {/* Existing Images (Edit Mode) */}
        {isEdit && existingImages.length > 0 && (
            <div className="form-group">
              <label>Existing Images</label>
              <div className="image-preview-container">
                {existingImages.map((img) => (
                    <div key={img.id} className="image-preview-item">
                      <img
                          src={toImageSrc(img)}
                          alt="property"
                          className="image-preview-thumbnail"
                      />
                      <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="image-delete-btn"
                          aria-label="Delete image"
                      >
                        ×
                      </button>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* Image Upload Section (Both Create and Edit) */}
        {setSelectedImages && (
            <div className="form-group">
              <label htmlFor="property-images">
                {isEdit ? "Add More Images" : "Property Images"}
              </label>
              <input
                  id="property-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
              />
              {isEdit && existingImages.length > 0 && (
                  <div className="image-upload-hint">
                    {existingImages.length} image(s) already uploaded. You can upload up to {20 - existingImages.length} more.
                  </div>
              )}
              {!isEdit && (
                  <div className="image-upload-hint">
                    You can upload up to 20 images.
                  </div>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                  <div className="image-preview-container" style={{ marginTop: 12 }}>
                    {imagePreviews.map(({ file, preview }, idx) => (
                        <div key={idx} className="image-preview-item">
                          <img
                              src={preview}
                              alt={`preview-${idx}`}
                              className="image-preview-thumbnail"
                          />
                          <button
                              type="button"
                              onClick={() => handleRemoveSelectedImage(idx)}
                              className="image-delete-btn"
                              aria-label="Remove image"
                          >
                            ×
                          </button>
                          <div className="image-preview-name" title={file.name}>
                            {file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                          </div>
                        </div>
                    ))}
                  </div>
              )}

              {selectedImages && selectedImages.length > 0 && (
                  <div className="selected-images-count">
                    {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                  </div>
              )}
            </div>
        )}

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
  propertyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedImages: PropTypes.array,
  setSelectedImages: PropTypes.func,
};

export default PropertyForm;
