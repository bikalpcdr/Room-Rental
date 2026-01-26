import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOwnerBookings, createProperty, deleteProperty } from '../../api';
import { logout } from '../../utils/auth';

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
  };
  user: {
    username: string;
    email: string;
  };
  status: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getOwnerBookings();
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
            <h1 className="text-2xl font-bold">Owner Dashboard</h1>
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
            <div className="text-3xl font-bold text-blue-600">5</div>
            <div className="text-gray-600">Total Properties</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{bookings.length}</div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              {bookings.filter(b => b.status === 'CONFIRMED').length}
            </div>
            <div className="text-gray-600">Confirmed Bookings</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">
              ${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}
            </div>
            <div className="text-gray-600">Total Revenue</div>
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
                          {booking.property.title} - {booking.user.username}
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
                    onClick={() => setShowAddProperty(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Add Property
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample properties - in real app these would come from API */}
                  {[1, 2, 3, 4, 5].map((id) => (
                    <div key={id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Property Image</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">Property {id}</h3>
                        <p className="text-gray-600 text-sm mb-2">Location: City {id}</p>
                        <p className="text-blue-600 font-bold mb-3">$1,200/month</p>
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
                          Dates
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
                            {booking.user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${booking.totalAmount}
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
  );
};

export default OwnerDashboard;
