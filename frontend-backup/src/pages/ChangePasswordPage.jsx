import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/header';
import Footer from '../components/footer';
import '../style/ChangePasswordPage.css';
import { resetPassword, changePassword } from "../api";

const ChangePasswordPage = ({ isLoggedIn = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emailOrUsername: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        // For non-logged in users (password reset)
        if (!isLoggedIn) {
            if (!formData.emailOrUsername) {
                toast.error("Please enter your email or username");
                return false;
            }
            if (!formData.newPassword) {
                toast.error("Please enter a new password");
                return false;
            }
            if (formData.newPassword.length < 8) {
                toast.error("New password must be at least 8 characters long");
                return false;
            }
            if (!formData.confirmPassword) {
                toast.error("Please confirm your new password");
                return false;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("New passwords do not match");
                return false;
            }
            return true;
        }

        // For logged in users (change password)
        if (!formData.currentPassword) {
            toast.error("Please enter your current password");
            return false;
        }
        if (!formData.newPassword) {
            toast.error("Please enter a new password");
            return false;
        }
        if (formData.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long");
            return false;
        }
        if (!formData.confirmPassword) {
            toast.error("Please confirm your new password");
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match");
            return false;
        }
        if (formData.currentPassword === formData.newPassword) {
            toast.error("New password must be different from current password");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (isLoggedIn) {
                // For logged in users - change password
                await changePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                });
            } else {
                // For non-logged in users - reset password
                await resetPassword({
                    emailOrUsername: formData.emailOrUsername,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                });
            }

            toast.success(isLoggedIn ? "Password changed successfully!" : "Password reset successfully!");

            // Reset form after successful change
            setFormData({
                emailOrUsername: "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // Redirect both flows to login page
            navigate('/login');
        } catch (error) {
            toast.error(error?.response?.data?.message || (isLoggedIn ? "Failed to change password" : "Failed to reset password"));
        }
    };

    return (
        <div className="change-password-page">
            <Header />

            <div className="change-password-container">
                <h2>{isLoggedIn ? "Change Password" : "Reset Password"}</h2>
                <div className="password-info">
                    {isLoggedIn
                        ? "Enter your current password and choose a new secure password"
                        : "Enter your email/username and create a new secure password"
                    }
                </div>

                <form onSubmit={handleSubmit} className="change-password-form">
                    {!isLoggedIn && (
                        <div className="input-group">
                            <label htmlFor="emailOrUsername">Email or Username</label>
                            <input
                                id="emailOrUsername"
                                name="emailOrUsername"
                                type="text"
                                placeholder="Enter your email or username"
                                value={formData.emailOrUsername}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    {isLoggedIn && (
                        <div className="input-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showPasswords.current ? "text" : "password"}
                                    placeholder="Enter current password"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => togglePasswordVisibility('current')}
                                >
                                    {showPasswords.current ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('new')}
                            >
                                {showPasswords.new ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        <div className="password-requirements">
                            Password must be at least 8 characters long
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPasswords.confirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('confirm')}
                            >
                                {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        {isLoggedIn ? "Change Password" : "Reset Password"}
                    </button>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default ChangePasswordPage;