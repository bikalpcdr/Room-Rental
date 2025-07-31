import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/register.css";
import { registerUser } from "../api";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    role: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return false;
    }
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions!");
      return false;
    }
    return true;
  }, [formData, acceptTerms]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.fullName, 
        formData.phoneNumber, 
        formData.role
      );
      if (res.data?.message?.toLowerCase().includes("already exists") || 
          res.data?.message?.toLowerCase().includes("exist")) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data?.message || "Registration successful! Please login.");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, navigate]);

  const handlePasswordToggle = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleConfirmPasswordToggle = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleAcceptTerms = useCallback((e) => {
    setAcceptTerms(e.target.checked);
  }, []);

  return (
    <>
      <Header />
      <main className="register-page">
        <div className="register-background">
          <div className="register-container">
            <div className="register-header">
              <div className="register-logo">🏠</div>
              <h1>Create Account</h1>
              <p>Join Room Rental Service and find your perfect space</p>
            </div>

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon1">👤</span>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      placeholder="Enter your full name"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-wrapper">
                    <span className="input-icon1">🔑</span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      placeholder="Choose a username"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon1">✉️</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      placeholder="Enter your email"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <div className="input-wrapper">
                    <span className="input-icon1">📞</span>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      placeholder="Enter your phone number"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      placeholder="Create a password"
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={handlePasswordToggle}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      placeholder="Confirm your password"
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={handleConfirmPasswordToggle}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">I want to</label>
                <div className="input-wrapper">
                  <span className="input-icon">🎯</span>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="OWNER">Rent out my property</option>
                    <option value="RENTER">Find a room to rent</option>
                  </select>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={handleAcceptTerms}
                  />
                  <span className="checkmark"></span>
                  I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </label>
              </div>

              <button 
                type="submit" 
                className="register-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="register-footer">
              <p>Already have an account? <Link to="/login" className="login-link">Sign in here</Link></p>
            </div>

            <div className="register-divider">
              <span>or</span>
            </div>

            <div className="social-register">
              <button className="social-button google">
                <span>🔍</span>
                Continue with Google
              </button>
              <button className="social-button facebook">
                <span>📘</span>
                Continue with Facebook
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

Register.propTypes = {};

export default React.memo(Register);
