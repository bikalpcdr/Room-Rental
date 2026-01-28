import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerProperties, fetchBookingRequests, createPropertyWithImages, updateProperty, deleteProperty, deletePropertyImage } from '../../api';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LocationPicker from '../../components/LocationPicker';

interface Booking {
  id: string;
  status: string;
  property: {
    id: string;
    title: string;
    description: string;
    propertyType: string | null;
    address: string;
    latitude: number | null;
    longitude: number | null;
    roomCount: number;
    status: string | null;
    rentPrice: number;
    isAvailable: boolean;
    isActive: boolean | null;
    ownerId: string | null;
    ownerName: string | null;
    amenities: string[];
    images: string[];
  };
  renter: {
    userId: string;
    username: string | null;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string | null;
    isActive: boolean | null;
    profilePictureUrl: string | null;
    accountStatus: string | null;
  };
}

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  roomCount: number;
  rentPrice: number;
  isAvailable: boolean;
  amenities: string[];
  images: Array<{ id: number; url: string }>;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [existingImages, setExistingImages] = useState<Array<{ id: number; url: string }>>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    roomCount: 1,
    rentPrice: 0,
    isAvailable: true,
    amenities: [] as string[],
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const PROPERTY_TYPES = ['ROOM', 'FLAT', 'HOUSE'];
  const AMENITIES = [
    'FREE_WIFI',
    'TV',
    'AC',
    'KITCHEN',
    'PARKING',
    'ATTACHED_BATHROOM',
    'WATER',
    'COMMERCIAL_SPACE'
  ];

  useEffect(() => {
    fetchProperties();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const showWelcomeToast = localStorage.getItem('showWelcomeToast');
    if (showWelcomeToast === 'true') {
      toast.success(`Welcome back, ${userData.fullName}! 🏠`);
      localStorage.removeItem('showWelcomeToast');
    }
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await getOwnerProperties();
      setProperties(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingLoading(true);
      const response = await fetchBookingRequests();
      setBookings(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch booking requests");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAddProperty = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      propertyType: '',
      address: '',
      latitude: null,
      longitude: null,
      roomCount: 1,
      rentPrice: 0,
      isAvailable: true,
      amenities: [], // Create new array to avoid shared reference
    });
    setSelectedImages([]);
    setSelectedProperty(null);
    setExistingImages([]);
    setRemovedImageIds([]);
    setIsEdit(false);
    setShowFormModal(true);
  }, []);

  const handleEditProperty = useCallback((property: Property) => {
    setFormData({
      title: property.title || '',
      description: property.description || '',
      propertyType: property.propertyType || '',
      address: property.address || '',
      latitude: property.latitude ?? null,
      longitude: property.longitude ?? null,
      roomCount: property.roomCount || 1,
      rentPrice: property.rentPrice || 0,
      isAvailable: property.isAvailable !== undefined ? property.isAvailable : true,
      amenities: [...(property.amenities || [])], // Create new array to avoid shared reference
    });
    setSelectedProperty(property);
    setExistingImages(property.images || []);
    setRemovedImageIds([]);
    setIsEdit(true);
    setShowFormModal(true);
  }, []);

  const handleDeleteImage = useCallback(async (imageId: number) => {
    try {
      await deletePropertyImage(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      setRemovedImageIds(prev => [...prev, imageId]);
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
    }
  }, []);

  const handleDeleteProperty = useCallback(async (propertyId: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(propertyId);
        toast.success("Property deleted successfully!");
        fetchProperties();
      } catch (err) {
        toast.error("Failed to delete property");
      }
    }
  }, [fetchProperties]);

  const handleViewProperty = useCallback((property: Property) => {
    navigate(`/property/${property.id}`);
  }, [navigate]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && selectedProperty) {
        const propertyId = selectedProperty.id;
        await updateProperty({ 
          ...formData, 
          propertyId: parseInt(propertyId),
          removedImageIds,
          amenities: [...formData.amenities] // Create new array to avoid shared reference
        });
        toast.success("Property updated successfully!");
        setShowFormModal(false);
        fetchProperties();
      } else {
        await createPropertyWithImages(formData, selectedImages);
        setShowFormModal(false);
        toast.success("Property created successfully!");
        fetchProperties();
      }
      setSelectedImages([]);
      setRemovedImageIds([]);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to save property");
    }
  }, [isEdit, formData, selectedProperty, fetchProperties, selectedImages, removedImageIds]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      // Handle latitude/longitude as numbers or null
      if (name === 'latitude' || name === 'longitude') {
        const coordValue = value === '' ? null : parseFloat(value);
        setFormData(prev => ({ ...prev, [name]: coordValue }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  }, []);

  const handleAmenityChange = useCallback((amenity: string) => {
    setFormData(prev =>
      prev.amenities.includes(amenity)
        ? { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }
        : { ...prev, amenities: [...prev.amenities, amenity] }
    );
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let combined = [...selectedImages, ...files];
    combined = combined.filter((file, idx, arr) =>
      arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
    );
    
    if (combined.length > 20) {
      toast.error("You can only upload up to 20 images");
      setSelectedImages(combined.slice(0, 20));
    } else {
      setSelectedImages(combined);
    }
    e.target.value = '';
  }, [selectedImages]);

  const handleRemoveSelectedImage = useCallback((idx: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== idx));
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-gray-50">
        {/* Page Header */}
        <div className="bg-blue-600 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-blue-100">Manage your properties and booking requests</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600">{properties.length}</div>
              <div className="text-gray-600">Total Properties</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-600">{properties.filter(p => p.isAvailable).length}</div>
              <div className="text-gray-600">Available</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-purple-600">{properties.filter(p => !p.isAvailable).length}</div>
              <div className="text-gray-600">Rented</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-orange-600">
                Rs. {properties.reduce((sum, p) => sum + p.rentPrice, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Value</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'properties'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Properties
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Bookings
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'properties' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">My Properties</h2>
                    <button
                      onClick={handleAddProperty}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Add Property
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0].url.startsWith("http") ? property.images[0].url : `http://localhost:7777${property.images[0].url}`}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{property.description}</p>
                          <p className="text-blue-600 font-bold mb-2">Rs. {property.rentPrice.toLocaleString()}/month</p>
                          <div className="flex justify-between">
                            <button 
                              onClick={() => handleViewProperty(property)}
                              className="text-green-600 hover:text-green-800"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleEditProperty(property)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProperty(property.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {properties.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No properties found. Add your first property!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Booking Requests</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Guest
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.property.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.renter.fullName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Rs. {booking.property.rentPrice.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {booking.status === 'PENDING' && (
                                <>
                                  <button className="text-green-600 hover:text-green-900 mr-3">Accept</button>
                                  <button className="text-red-600 hover:text-red-900">Reject</button>
                                </>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <span className="text-gray-500">Confirmed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Property Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {isEdit ? 'Edit Property' : 'Add New Property'}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <LocationPicker
                  formData={formData}
                  setFormData={setFormData}
                  address={formData.address}
                />

                {/* Existing Images (Edit Mode) */}
                {isEdit && existingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.url.startsWith("http") ? img.url : `http://localhost:7777${img.url}`}
                            alt="Property"
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                            title="Delete image"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {existingImages.length} image(s) already uploaded. You can upload up to {20 - existingImages.length} more.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isEdit ? "Add More Images" : "Images"}
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {selectedImages.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {selectedImages.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedImage(idx)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Count</label>
                    <input
                      type="number"
                      name="roomCount"
                      value={formData.roomCount}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rent Price (Rs.)</label>
                    <input
                      type="number"
                      name="rentPrice"
                      value={formData.rentPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES.map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="mr-2"
                        />
                        {amenity.replace('_', ' ')}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Available for rent</label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  {isEdit ? 'Update Property' : 'Create Property'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
