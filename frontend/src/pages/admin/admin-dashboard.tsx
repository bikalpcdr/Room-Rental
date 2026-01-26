import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllBookings, updateUser, deleteUserById } from '../../api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';

interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  profilePictureUrl: string | null;
  accountStatus: string | null;
}

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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, bookingsResponse] = await Promise.all([
        getAllUsers(),
        getAllBookings()
      ]);
      
      // Extract data from the nested structure
      const usersData = Array.isArray(usersResponse.data?.data) ? usersResponse.data.data : [];
      const bookingsData = Array.isArray(bookingsResponse.data?.data) ? bookingsResponse.data.data : [];
      
      console.log('Users data:', usersData);
      console.log('Bookings data:', bookingsData);
      
      setUsers(usersData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Set empty arrays on error
      setUsers([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    // For now, just show a toast. In a real app, this would open an edit modal
    toast.info(`Edit user: ${user.fullName} (ID: ${user.userId})`);
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      try {
        await deleteUserById(user.userId);
        toast.success(`User ${user.fullName} deleted successfully`);
        // Refresh the users list
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      await updateUser(
        user.userId,
        user.username,
        user.fullName,
        user.phoneNumber,
        user.role
      );
      toast.success(`User ${user.fullName} status updated`);
      // Refresh the users list
      fetchData();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user:', error);
    }
  };

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
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-blue-100">Manage users, bookings, and monitor system activity</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{users.length}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{bookings.length}</div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              {Array.isArray(users) ? users.filter(u => u.role === 'OWNER').length : 0}
            </div>
            <div className="text-gray-600">Property Owners</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">
              {Array.isArray(users) ? users.filter(u => u.role === 'RENTER').length : 0}
            </div>
            <div className="text-gray-600">Renters</div>
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
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
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
                <h2 className="text-xl font-bold mb-4">System Overview</h2>
                <p className="text-gray-600 mb-4">
                  Welcome to the admin dashboard. Here you can manage users, bookings, and monitor system activity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Recent Activity</h3>
                    <p className="text-sm text-gray-600">
                      {bookings.slice(0, 3).map(booking => (
                        <div key={booking.id} className="mb-2">
                          New booking: {booking.property.title} by {booking.renter.fullName}
                        </div>
                      ))}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left bg-white p-2 rounded hover:bg-gray-100">
                        Manage User Permissions
                      </button>
                      <button className="w-full text-left bg-white p-2 rounded hover:bg-gray-100">
                        View System Logs
                      </button>
                      <button className="w-full text-left bg-white p-2 rounded hover:bg-gray-100">
                        Generate Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
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
                      {users.map((user) => (
                        <tr key={user.userId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'OWNER' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleToggleUserStatus(user)}
                              className={`mr-3 ${
                                user.isActive 
                                  ? 'text-yellow-600 hover:text-yellow-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Booking Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date().toLocaleDateString()}
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

export default AdminDashboard;
