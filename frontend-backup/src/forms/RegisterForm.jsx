import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import logo from "../assets/logo1.png";

const RegisterForm = ({ onSuccess, showSocialRegister = true }) => {
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
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    // Terms validation
    if (!acceptTerms) {
      newErrors.terms = "Please accept the terms and conditions";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [formData, acceptTerms]);

  // Validate form on input changes
  useEffect(() => {
    validateForm();
  }, [formData, acceptTerms, validateForm]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

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
        // Set specific error for username or email
        if (res.data.message.toLowerCase().includes("username")) {
          setErrors({ username: "Username already exists" });
        } else if (res.data.message.toLowerCase().includes("email")) {
          setErrors({ email: "Email already exists" });
        }
      } else {
        toast.success(res.data?.message || "Registration successful! Please login.");

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(res.data);
        } else {
          // Default behavior: redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);

      // Set specific error messages based on response
      if (err.response?.status === 400) {
        if (err.response.data?.message?.toLowerCase().includes("username")) {
          setErrors({ username: "Username already exists" });
        } else if (err.response.data?.message?.toLowerCase().includes("email")) {
          setErrors({ email: "Email already exists" });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, acceptTerms, onSuccess, navigate]);

  const handlePasswordToggle = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleConfirmPasswordToggle = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleAcceptTerms = useCallback((e) => {
    setAcceptTerms(e.target.checked);
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: '' }));
    }
  }, [errors.terms]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && isFormValid && !loading) {
      handleSubmit(e);
    }
  }, [isFormValid, loading, handleSubmit]);

  const handleGoogleRegister = useCallback(() => {
    toast.info("🔍 Google registration feature is coming soon!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const handleFacebookRegister = useCallback(() => {
    toast.info("📘 Facebook registration feature is coming soon!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  return (
    <div className="register-container">
      <div className="register-header">
        <img src={logo} alt="Logo" className="login-logo mb-3" />
        <h1>Create Account</h1>
        <p>Join Room Rental Service and find your perfect space</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className={`input-wrapper ${errors.fullName ? 'error' : ''}`}>
              <span className="input-icon1">👤</span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                placeholder="Enter your full name"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-describedby="fullName-error"
                aria-invalid={!!errors.fullName}
                required
              />
            </div>
            {errors.fullName && (
              <span id="fullName-error" className="error-message">
                👎 {errors.fullName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className={`input-wrapper ${errors.username ? 'error' : ''}`}>
              <span className="input-icon1">🔑</span>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                placeholder="Choose a username"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-describedby="username-error"
                aria-invalid={!!errors.username}
                required
              />
            </div>
            {errors.username && (
              <span id="username-error" className="error-message">
                👎 {errors.username}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
              <span className="input-icon1">✉️</span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-describedby="email-error"
                aria-invalid={!!errors.email}
                required
              />
            </div>
            {errors.email && (
              <span id="email-error" className="error-message">
                👎 {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className={`input-wrapper ${errors.phoneNumber ? 'error' : ''}`}>
              <span className="input-icon1">📞</span>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                placeholder="Enter your phone number"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-describedby="phoneNumber-error"
                aria-invalid={!!errors.phoneNumber}
                required
              />
            </div>
            {errors.phoneNumber && (
              <span id="phoneNumber-error" className="error-message">
                👎 {errors.phoneNumber}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                placeholder="Create a password"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-describedby="password-error"
                aria-invalid={!!errors.password}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={handlePasswordToggle}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="error-message">
                👎 {errors.password}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                placeholder="Confirm your password"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-describedby="confirmPassword-error"
                aria-invalid={!!errors.confirmPassword}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={handleConfirmPasswordToggle}
                disabled={loading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span id="confirmPassword-error" className="error-message">
                👎 {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="role">I want to</label>
          <div className={`input-wrapper ${errors.role ? 'error' : ''}`}>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              disabled={loading}
              aria-describedby="role-error"
              aria-invalid={!!errors.role}
              required
            >
              <option value="">Select your role</option>
              <option value="OWNER">Rent out my property</option>
              <option value="RENTER">Find a room to rent</option>
            </select>
          </div>
          {errors.role && (
            <span id="role-error" className="error-message">
              👎 {errors.role}
            </span>
          )}
        </div>

        <div className="form-options">
          <label className={`checkbox-wrapper ${errors.terms ? 'error' : ''}`}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={handleAcceptTerms}
              disabled={loading}
            />
            <span className="checkmark"></span>
            I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
          </label>
          {errors.terms && (
            <span className="error-message">
              👎 {errors.terms}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={`register-button ${!isFormValid || loading ? 'disabled' : ''}`}
          disabled={!isFormValid || loading}
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

      {/* <div className="register-footer">
        <p>Already have an account? <Link to="/login" className="login-link">Sign in here</Link></p>
      </div> */}

      {showSocialRegister && (
        <>
          <div className="register-divider">
            <span>or</span>
          </div>

          <div className="social-register">
            <button
              className="social-button google"
              disabled={loading}
              type="button"
              onClick={handleGoogleRegister}
            >
              <span>🔍</span>
              Continue with Google
            </button>
            <button
              className="social-button facebook"
              disabled={loading}
              type="button"
              onClick={handleFacebookRegister}
            >
              <span>📘</span>
              Continue with Facebook
            </button>
          </div>
        </>
      )}
    </div>
  );
};

RegisterForm.propTypes = {
  onSuccess: PropTypes.func,
  showSocialRegister: PropTypes.bool
};

export default React.memo(RegisterForm); 