import React, { useCallback, useMemo, useEffect, useState } from "react";
import LocationPicker from "../components/LocationPicker";
import { getPropertyById, deletePropertyImage } from "../api";

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

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  roomCount: number;
  rentPrice: number;
  isAvailable: boolean;
  amenities: string[];
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

interface PropertyImage {
  id?: string;
  url?: string;
  imageUrl?: string;
}

interface PropertyFormProps {
  formData: PropertyFormData;
  setFormData: (data: PropertyFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEdit?: boolean;
  propertyId?: string;
  selectedImages?: File[];
  setSelectedImages?: (images: File[]) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  isEdit = false, 
  propertyId, 
  selectedImages = [], 
  setSelectedImages 
}) => {
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);

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

  const handleAmenityChange = useCallback((amenity: string) => {
    setFormData((prev: any) =>
        prev.amenities.includes(amenity)
            ? { ...prev, amenities: prev.amenities.filter((a: string) => a !== amenity) }
            : { ...prev, amenities: [...prev.amenities, amenity] }
    );
  }, [setFormData]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deletePropertyImage(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setSelectedImages) return;
    
    const files = Array.from(e.target.files || []);
    // Combine previous and new files, avoid duplicates by name and size
    let combined = [...selectedImages, ...files];
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
  const handleRemoveSelectedImage = useCallback((idx: number) => {
    if (!setSelectedImages) return;
    setSelectedImages((prev: File[]) => prev.filter((_: File, i: number) => i !== idx));
  }, [setSelectedImages]);

  const amenityRows = useMemo(() => [AMENITIES.slice(0, 4), AMENITIES.slice(4, 8)], []);

  const API_BASE_URL = "http://localhost:7777";

  const toImageSrc = useCallback((img: PropertyImage) => {
    const raw = img?.url || img?.imageUrl;
    if (!raw) return "";
    return raw.startsWith("http") ? raw : API_BASE_URL + raw;
  }, []);

  // Generate previews for selected images
  const imagePreviews = useMemo(() => {
    if (selectedImages.length === 0) return [];
    return selectedImages.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
  }, [selectedImages]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter property title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type *
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            >
              <option value="">Select Property Type</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter property address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rooms *
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.roomCount}
              onChange={(e) => setFormData({ ...formData, roomCount: parseInt(e.target.value) || 0 })}
              placeholder="Enter number of rooms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rent Price (Rs.) *
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.rentPrice}
              onChange={(e) => setFormData({ ...formData, rentPrice: parseInt(e.target.value) || 0 })}
              placeholder="Enter rent price"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            />
            <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
              Available for rent
            </label>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter property description"
          />
        </div>
      </div>

      {/* Location Picker */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Property Location</h3>
        <LocationPicker
          formData={formData}
          setFormData={setFormData}
          address={formData.address}
        />
      </div>

      {/* Amenities */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {amenityRows.map((row, rowIndex) => (
            <div key={rowIndex} className="space-y-2">
              {row.map(amenity => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {amenity.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Property Images</h3>
        
        {/* Existing Images */}
        {isEdit && existingImages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((img, index) => (
                <div key={img.id || index} className="relative group">
                  <img
                    src={toImageSrc(img)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => img.id && handleDeleteImage(img.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        {setSelectedImages && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Upload New Images ({selectedImages.length}/20)
            </h4>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveSelectedImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {isEdit ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </div>
  );
};

export default PropertyForm;
