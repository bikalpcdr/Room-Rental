import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getBookingsByRenterId, getAllProperties } from '../../api';
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

const RenterDashboard: React.FC = () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'properties' | 'saved'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyLoading, setPropertyLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!userData.id) return;

    setLoading(true);
    try {
      const res = await getBookingsByRenterId(userData.id);
      const bookingsData = res.data?.data || [];
      setBookings(bookingsData);
    } catch (err) {
      toast.error("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [userData.id]);

  const fetchProperties = useCallback(async () => {
    try {
      setPropertyLoading(true);
      const response = await getAllProperties();
      setProperties(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch properties");
      console.error("Error fetching properties:", error);
    } finally {
      setPropertyLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    const rentals = bookings.length;
    const activeBookings = bookings.filter(b =>
      b.status === 'PENDING' || b.status === 'CONFIRMED'
    ).length;
    const totalSpent = bookings.reduce((sum, b) => sum + (b.property?.rentPrice || 0), 0);
    const savedProperties = 5; // This would come from API in real implementation

    return {
      rentals,
      activeBookings,
      totalSpent,
      savedProperties
    };
  }, [bookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (activeTab === 'properties') {
      fetchProperties();
    }
  }, [activeTab, fetchProperties]);

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
            <h1 className="text-3xl font-bold">Renter Dashboard</h1>
            <p className="text-blue-100">Manage your bookings and find your perfect rental</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.rentals}</div>
              <div className="text-gray-600">Total Rentals</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-600">{stats.activeBookings}</div>
              <div className="text-gray-600">Active Bookings</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-purple-600">
                Rs. {stats.totalSpent.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Spent</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-orange-600">{stats.savedProperties}</div>
              <div className="text-gray-600">Saved Properties</div>
            </div>
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              onClick={() => setActiveTab('bookings')}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-lg font-semibold mb-2">My Bookings</h3>
                <p className="text-gray-600 text-sm">View and manage your current bookings, track payment status, and cancel pending requests.</p>
                <div className="mt-4 text-blue-600 font-medium">Click to view →</div>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('properties')}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold mb-2">Search Properties</h3>
                <p className="text-gray-600 text-sm">Browse available properties, filter by location and price, and book your perfect room.</p>
                <div className="mt-4 text-blue-600 font-medium">Click to view →</div>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('saved')}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">❤️</div>
                <h3 className="text-lg font-semibold mb-2">Saved Properties</h3>
                <p className="text-gray-600 text-sm">View your saved properties and favorite listings for quick access and future bookings.</p>
                <div className="mt-4 text-blue-600 font-medium">Click to view →</div>
              </div>
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
                  onClick={() => setActiveTab('bookings')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'properties'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Search Properties
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'saved'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Saved Properties
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Welcome back, {userData.fullName}!</h2>
                  <p className="text-gray-600 mb-4">
                    Here's your rental activity summary and quick access to manage your bookings.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Recent Bookings</h3>
                      <p className="text-sm text-gray-600">
                        {bookings.slice(0, 3).map(booking => (
                          <div key={booking.id} className="mb-2">
                            {booking.property.title} - {booking.status}
                          </div>
                        ))}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Quick Actions</h3>
                      <div className="space-y-2">
                        <button 
                          onClick={() => setActiveTab('bookings')}
                          className="w-full text-left bg-white p-2 rounded hover:bg-gray-100"
                        >
                          View All Bookings
                        </button>
                        <button 
                          onClick={() => setActiveTab('properties')}
                          className="w-full text-left bg-white p-2 rounded hover:bg-gray-100"
                        >
                          Find New Property
                        </button>
                        <button className="w-full text-left bg-white p-2 rounded hover:bg-gray-100">
                          Payment History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
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
                              {booking.property.address}
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
                                <button className="text-red-600 hover:text-red-900">Cancel</button>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <span className="text-gray-500">Active</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'properties' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Available Properties</h2>
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
                              View Details
                            </button>
                            <button className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'saved' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Saved Properties</h2>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-xl font-semibold mb-2">No Saved Properties Yet</h3>
                    <p className="text-gray-600 mb-4">Start browsing and save properties you're interested in!</p>
                    <button 
                      onClick={() => setActiveTab('properties')}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Browse Properties
                    </button>
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

export default RenterDashboard;
