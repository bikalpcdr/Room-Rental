import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/admin-dashboard.css";
import { getAllUsers, deleteUserById, createUser, updateUser } from "../api";
import { ToastContainer, toast } from "react-toastify";
import { getUserData } from "../utils/auth";
import "react-toastify/dist/ReactToastify.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: "RENTER"
  });

  const userData = getUserData();

  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    owners: 0,
    renters: 0
  });

  useEffect(() => {
    fetchUsers();
    
    // Check if we should show welcome toast
    const showWelcomeToast = localStorage.getItem('showWelcomeToast');
    if (showWelcomeToast === 'true') {
      toast.success(`Welcome back, ${userData.fullName}! 🎉`);
      localStorage.removeItem('showWelcomeToast');
    }
  }, []);

  useEffect(() => {
    calculateStats();
  }, [users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalUsers = users.length;
    const admins = users.filter(user => user.role === "ADMIN").length;
    const owners = users.filter(user => user.role === "OWNER").length;
    const renters = users.filter(user => user.role === "RENTER").length;

    setStats({ totalUsers, admins, owners, renters });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName,
        formData.phoneNumber,
        formData.role
      );
      toast.success("User created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(
        selectedUser.userId,
        formData.username,
        formData.fullName,
        formData.phoneNumber,
        formData.role
      );
      toast.success("User updated successfully!");
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserById(userId);
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      role: "RENTER"
    });
    setSelectedUser(null);
  };

  const openEditModal = (user) => {
    setSelectedUser({ ...user, id: user.userId });
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '1rem' }}>
              Welcome, {userData?.fullName} ({userData?.email})
            </p>
          </div>
          <button className="create-user-btn" onClick={openCreateModal}>
            + Create User
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Admins</h3>
            <p className="stat-number">{stats.admins}</p>
          </div>
          <div className="stat-card">
            <h3>Owners</h3>
            <p className="stat-number">{stats.owners}</p>
          </div>
          <div className="stat-card">
            <h3>Renters</h3>
            <p className="stat-number">{stats.renters}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-section">
          <h2>User Management</h2>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>UserID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>

                    <td>{index + 1}</td>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <span  className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => openEditModal(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.userId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New User</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value="RENTER">Renter</option>
                    <option value="OWNER">Owner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Create User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Edit User</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value="RENTER">Renter</option>
                    <option value="OWNER">Owner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Update User</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </main>
      <Footer />
    </>
  );
}

export default AdminDashboard; 