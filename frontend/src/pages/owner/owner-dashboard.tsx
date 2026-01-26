import React, { useState, useEffect } from 'react';
import { getOwnerProperties, fetchBookingRequests } from '../../api';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings'>('overview');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

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
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Property Overview</h2>
                  <p className="text-gray-600 mb-4">
                    Manage your properties and track booking performance from your dashboard.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Recent Bookings</h3>
                      <p className="text-sm text-gray-600">
                        {bookings.slice(0, 3).map(booking => (
                          <div key={booking.id} className="mb-2">
                            {booking.property.title} - {booking.renter.fullName}
                          </div>
                        ))}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Quick Actions</h3>
                      <div className="space-y-2">
                        <button 
                          onClick={() => setActiveTab('properties')}
                          className="w-full text-left bg-white p-2 rounded hover:bg-gray-100"
                        >
                          Add New Property
                        </button>
                        <button className="w-full text-left bg-white p-2 rounded hover:bg-gray-100">
                          View Analytics
                        </button>
                        <button className="w-full text-left bg-white p-2 rounded hover:bg-gray-100">
                          Manage Calendar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'properties' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">My Properties</h2>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Add Property
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Property Image</span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{property.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{property.address}</p>
                          <p className="text-blue-600 font-bold mb-3">Rs. {property.rentPrice.toLocaleString()}/month</p>
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700">
                              Edit
                            </button>
                            <button className="flex-1 bg-red-600 text-white py-1 px-2 rounded text-sm hover:bg-red-700">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
    </div>
  );
};

export default OwnerDashboard;
