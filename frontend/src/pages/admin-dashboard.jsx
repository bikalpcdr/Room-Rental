import React, {useCallback, useEffect, useMemo, useState} from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/admin-dashboard.css";
import {createUser, deleteProperty, deleteUserById, getAllProperties, getAllUsers, updateUser} from "../api";
import {toast} from "react-toastify";
import {getUserData} from "../utils/auth";
import UserForm from "../forms/UserForm";
import UserTable from "../components/UserTable";
import PropertyTable from "../components/PropertyTable";
import PropTypes from "prop-types";

const StatsCards = React.memo(({stats}) => (
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
));

StatsCards.propTypes = {
    stats: PropTypes.shape({
        totalUsers: PropTypes.number,
        admins: PropTypes.number,
        owners: PropTypes.number,
        renters: PropTypes.number,
    }).isRequired,
};

const ManagementCards = React.memo(({onUserManagementClick, onPropertyManagementClick}) => (
    <div className="management-cards-container">
        <div className="management-card" onClick={onUserManagementClick}>
            <div className="management-card-icon">👥</div>
            <div className="management-card-content">
                <h3>User Management</h3>
                <p>Manage all users, create new accounts, edit user details, and control access permissions.</p>
                <div className="management-card-actions">
                    <span className="click-hint">Click to view →</span>
                </div>
            </div>
        </div>

        <div className="management-card" onClick={onPropertyManagementClick}>
            <div className="management-card-icon">🏠</div>
            <div className="management-card-content">
                <h3>Property Management</h3>
                <p>View all properties, manage listings, approve new properties, and monitor property status.</p>
                <div className="management-card-actions">
                    <span className="click-hint">Click to view →</span>
                </div>
            </div>
        </div>
    </div>
));

ManagementCards.propTypes = {
    onUserManagementClick: PropTypes.func.isRequired,
    onPropertyManagementClick: PropTypes.func.isRequired,
};

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [propertyLoading, setPropertyLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'users', 'properties'
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        role: "RENTER"
    });

    const userData = getUserData();

    useEffect(() => {
        fetchUsers();
        const showWelcomeToast = localStorage.getItem('showWelcomeToast');
        if (showWelcomeToast === 'true') {
            toast.success(`Welcome back, ${userData.fullName}! 🎉`);
            localStorage.removeItem('showWelcomeToast');
        }
        // eslint-disable-next-line
    }, []);

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
        const totalUsers = users.length;
        const admins = users.filter(user => user.role === "ADMIN").length;
        const owners = users.filter(user => user.role === "OWNER").length;
        const renters = users.filter(user => user.role === "RENTER").length;
        return {totalUsers, admins, owners, renters};
    }, [users]);

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
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete property");
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

    const handleUserManagementClick = useCallback(() => {
        setCurrentView('users');
    }, []);

    const handlePropertyManagementClick = useCallback(() => {
        setCurrentView('properties');
        fetchProperties(); // Fetch properties when switching to property view
    }, [fetchProperties]);

    const handleBackToDashboard = useCallback(() => {
        setCurrentView('dashboard');
    }, []);

    if (loading) {
        return (
            <>
                <Header/>
                <div className="admin-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header/>
            <main className="admin-dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p style={{margin: '0.5rem 0 0 0', color: '#666', fontSize: '1rem'}}>
                            Welcome, {userData?.fullName} ({userData?.email})
                        </p>
                    </div>
                    {currentView === 'users' && (
                        <button className="create-user-btn" onClick={openCreateModal}>
                            + Create User
                        </button>
                    )}
                    {(currentView === 'users' || currentView === 'properties') && (
                        <button className="back-btn" onClick={handleBackToDashboard}>
                            ← Back to Dashboard
                        </button>
                    )}
                </div>

                {currentView === 'dashboard' && (
                    <>
                        {/* Statistics Cards */}
                        <StatsCards stats={stats}/>

                        {/* Management Cards */}
                        <ManagementCards
                            onUserManagementClick={handleUserManagementClick}
                            onPropertyManagementClick={handlePropertyManagementClick}
                        />
                    </>
                )}

                {currentView === 'users' && (
                    <div className="users-section">
                        <h2>User Management</h2>
                        <UserTable users={users} onEdit={openEditModal} onDelete={handleDeleteUser}/>
                    </div>
                )}

                {currentView === 'properties' && (
                    <div className="properties-section">
                        <h2>Property Management</h2>
                        {propertyLoading ? (
                            <div className="admin-loading">
                                <div className="loading-spinner"></div>
                                <p>Loading properties...</p>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="coming-soon">
                                <div className="coming-soon-icon">🏠</div>
                                <h3>No Properties Found</h3>
                                <p>There are currently no properties in the system.</p>
                            </div>
                        ) : (
                            <PropertyTable properties={properties} onDelete={handleDeleteProperty}/>
                        )}
                    </div>
                )}

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

            </main>
            <Footer/>
        </>
    );
}

AdminDashboard.propTypes = {};

export default React.memo(AdminDashboard); 