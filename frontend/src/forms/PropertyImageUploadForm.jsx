import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import "../style/PropertyForm.css";

function PropertyImageUploadForm({ selectedImages, setSelectedImages, onUpload, onCancel, existingImageCount }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Combine previous and new files, avoid duplicates by name and size
    let combined = [...selectedImages, ...files];
    combined = combined.filter((file, idx, arr) =>
      arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
    );
    if (combined.length + existingImageCount > 20) {
      alert(`You can only upload ${20 - existingImageCount} more images for this property.`);
      setSelectedImages(combined.slice(0, 20 - existingImageCount));
    } else {
      setSelectedImages(combined);
    }
  };

  // Remove a selected image by index
  const handleRemoveImage = (idx) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== idx));
  };

  // Handle upload with loading state
  const handleUpload = async () => {
    setIsUploading(true);
    try {
      await onUpload();
    } finally {
      setIsUploading(false);
    }
  };

  // Generate previews for selected images
  const previews = useMemo(() => selectedImages.map(file => URL.createObjectURL(file)), [selectedImages]);

  return (
    <form onSubmit={e => { e.preventDefault(); handleUpload(); }} autoComplete="off">
      <div className="form-group">
        <label htmlFor="property-images">Property Images</label>
        <input
          id="property-images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <div style={{ marginTop: 8, color: '#888', fontSize: '0.95em' }}>
          {existingImageCount} image(s) already uploaded. You can upload up to {20 - existingImageCount} more.
        </div>
        {previews.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {previews.map((src, idx) => (
              <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={src}
                  alt={`preview-${idx}`}
                  style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="modal-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </div>
    </form>
  );
}

PropertyImageUploadForm.propTypes = {
  selectedImages: PropTypes.array.isRequired,
  setSelectedImages: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  existingImageCount: PropTypes.number.isRequired,
};

export default PropertyImageUploadForm; 