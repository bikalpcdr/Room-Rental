import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../../api';
import { logout } from '../../utils/auth';

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
    images: string[];
  };
  owner: {
    name: string;
    email: string;
  };
  status: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const RenterDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'profile'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">Renter Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link to="/" className="hover:text-blue-200">Home</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'CONFIRMED').length}
            </div>
            <div className="text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'PENDING').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              ${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}
            </div>
            <div className="text-gray-600">Total Spent</div>
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
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-gray-600 mb-6">
                  Here's an overview of your recent bookings and account activity.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Recent Bookings</h3>
                    <div className="space-y-2">
                      {bookings.slice(0, 3).map(booking => (
                        <div key={booking.id} className="bg-white p-3 rounded">
                          <div className="font-medium">{booking.property.title}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link 
                        to="/property-search"
                        className="block w-full text-left bg-white p-3 rounded hover:bg-gray-100 transition"
                      >
                        🏠 Browse Properties
                      </Link>
                      <button className="w-full text-left bg-white p-3 rounded hover:bg-gray-100 transition">
                        📅 View Calendar
                      </button>
                      <button className="w-full text-left bg-white p-3 rounded hover:bg-gray-100 transition">
                        💳 Payment Methods
                      </button>
                      <button className="w-full text-left bg-white p-3 rounded hover:bg-gray-100 transition">
                        📞 Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-bold mb-4">My Bookings</h2>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">You haven't made any bookings yet.</p>
                    <Link 
                      to="/property-search"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
                    >
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            {booking.property.images && booking.property.images.length > 0 ? (
                              <img 
                                src={booking.property.images[0]} 
                                alt={booking.property.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-gray-400">No Image</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{booking.property.title}</h3>
                            <p className="text-gray-600 mb-2">📍 {booking.property.location}</p>
                            <p className="text-gray-600 mb-2">
                              📅 {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 mb-2">👤 Owner: {booking.owner.name}</p>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="text-2xl font-bold text-blue-600">
                                ${booking.totalAmount}
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {booking.status}
                                </span>
                                <Link 
                                  to={`/property/${booking.property.id}`}
                                  className="text-blue-600 hover:text-blue-500"
                                >
                                  View Property
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input 
                          type="tel" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-4">Preferences</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Preferences</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Email notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">SMS notifications</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenterDashboard;
