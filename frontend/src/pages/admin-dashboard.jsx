import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/admin-dashboard.css";
import { getAllUsers, deleteUserById, createUser, updateUser, getAllProperties, deleteProperty } from "../api";
import { ToastContainer, toast } from "react-toastify";
import { getUserData } from "../utils/auth";
import "react-toastify/dist/ReactToastify.css";
import UserForm from "../forms/UserForm";
import PropTypes from "prop-types";
import UsersTable from "../components/UserTable";
import PropertiesTable from "../components/PropertyTable";
import FloatingTableModal from "../components/FloatingTableModal";

const StatsCards = React.memo(({ stats, onViewUsers, onViewProperties }) => (
  <div className="stats-container">
    <div className="stat-card" onClick={onViewUsers} style={{ cursor: 'pointer' }}>
      <h3>Total Users</h3>
      <p className="stat-number">{stats.totalUsers}</p>
      <small>Click to manage users</small>
    </div>
    <div className="stat-card" onClick={onViewProperties} style={{ cursor: 'pointer' }}>
      <h3>Total Properties</h3>
      <p className="stat-number">{stats.totalProperties}</p>
      <small>Click to manage properties</small>
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
));

StatsCards.propTypes = {
  stats: PropTypes.shape({
    totalUsers: PropTypes.number,
    totalProperties: PropTypes.number,
    admins: PropTypes.number,
    owners: PropTypes.number,
    renters: PropTypes.number,
  }).isRequired,
  onViewUsers: PropTypes.func.isRequired,
  onViewProperties: PropTypes.func.isRequired,
};

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserTable, setShowUserTable] = useState(false);
  
  // Property management states
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [showPropertyTable, setShowPropertyTable] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: "RENTER"
  });

  const userData = getUserData();

  const fetchUsers = useCallback(async () => {
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
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      setPropertiesLoading(true);
      const response = await getAllProperties();
      setProperties(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch properties");
      console.error("Error fetching properties:", error);
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchProperties();
    const showWelcomeToast = localStorage.getItem('showWelcomeToast');
    if (showWelcomeToast === 'true') {
      toast.success(`Welcome back, ${userData.fullName}! 🎉`);
      localStorage.removeItem('showWelcomeToast');
    }
    // eslint-disable-next-line
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalProperties = properties.length;
    const admins = users.filter(user => user.role === "ADMIN").length;
    const owners = users.filter(user => user.role === "OWNER").length;
    const renters = users.filter(user => user.role === "RENTER").length;
    return { totalUsers, totalProperties, admins, owners, renters };
  }, [users, properties]);

  const handleCreateUser = useCallback(async (e) => {
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
  }, [formData, fetchUsers]);

  const handleUpdateUser = useCallback(async (e) => {
    e.preventDefault();
    try {
      await updateUser(
        selectedUser.id,
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
  }, [formData, selectedUser, fetchUsers]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserById(userId);
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  }, [fetchUsers]);

  const handleDeleteProperty = useCallback(async (propertyId) => {
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

  const resetForm = useCallback(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      role: "RENTER"
    });
    setSelectedUser(null);
  }, []);

  const openEditModal = useCallback((user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role
    });
    setShowEditModal(true);
  }, []);

  const openCreateModal = useCallback(() => {
    resetForm();
    setShowCreateModal(true);
  }, [resetForm]);

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
        <StatsCards stats={stats} onViewUsers={() => setShowUserTable(true)} onViewProperties={() => setShowPropertyTable(true)} />

        {/* Users Table */}
        <FloatingTableModal
          isOpen={showUserTable}
          onClose={() => setShowUserTable(false)}
          title="User Management"
        >
          <UsersTable users={users} onEdit={openEditModal} onDelete={handleDeleteUser} />
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="create-user-btn" onClick={openCreateModal}>
              + Add User
            </button>
          </div>
        </FloatingTableModal>

        {/* Property Management Section */}
        <FloatingTableModal
          isOpen={showPropertyTable}
          onClose={() => setShowPropertyTable(false)}
          title="Property Management"
        >
          {propertiesLoading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
              No properties found.
            </p>
          ) : (
            <PropertiesTable properties={properties} onDelete={handleDeleteProperty} />
          )}
        </FloatingTableModal>

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
              <UserForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateUser}
                onCancel={() => setShowCreateModal(false)}
                isEdit={false}
              />
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
              <UserForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleUpdateUser}
                onCancel={() => setShowEditModal(false)}
                isEdit={true}
              />
            </div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </main>
      <Footer />
    </>
  );
}

AdminDashboard.propTypes = {};

export default React.memo(AdminDashboard); 