import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import logo from "../assets/logo1.png";

const LoginForm = ({ onSuccess, showSocialLogin = true }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();

  // Auto-fill remembered credentials
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const savedUsername = localStorage.getItem('savedUsername');
    if (remembered === 'true' && savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [username, password]);

  // Validate form on input changes
  useEffect(() => {
    validateForm();
  }, [username, password, validateForm]);

  // Input sanitization
  const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, '');
  };

  // Track login attempts
  const trackLoginAttempt = (success) => {
    if (!success) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setLocked(true);
        toast.error("Too many failed attempts. Please try again in 5 minutes.");
        setTimeout(() => {
          setLocked(false);
          setAttempts(0);
        }, 300000); // 5 minutes
      }
    } else {
      setAttempts(0);
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm() || locked) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const sanitizedUsername = sanitizeInput(username);
      const res = await loginUser(sanitizedUsername, password);
      const userData = res.data?.data;
      
      // Track successful login attempt
      trackLoginAttempt(true);
      
      // Store user data
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        profilePictureUrl: userData.profilePictureUrl
      }));
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedUsername', sanitizedUsername);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedUsername');
      }
      
      localStorage.setItem('showWelcomeToast', 'true');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(userData);
      } else {
        // Direct navigation without delay
        switch (userData.role) {
          case 'ADMIN':
            navigate('/admin-dashboard');
            break;
          case 'OWNER':
            navigate('/owner-dashboard');
            break;
          case 'RENTER':
            navigate('/renter-dashboard');
            break;
          default:
            navigate('/');
        }
      }
      
    } catch (err) {
      trackLoginAttempt(false);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      
      // Set specific error messages
      if (err.response?.status === 401) {
        setErrors({ password: "Invalid username or password" });
      } else if (err.response?.status === 404) {
        setErrors({ username: "User not found" });
      }
    } finally {
      setLoading(false);
    }
  }, [username, password, rememberMe, navigate, validateForm, locked, attempts, onSuccess]);

  const handlePasswordToggle = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleRememberMe = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    if (field === 'username') {
      setUsername(value);
    } else if (field === 'password') {
      setPassword(value);
    }
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && isFormValid && !loading && !locked) {
      handleSubmit(e);
    }
  }, [isFormValid, loading, locked, handleSubmit]);

  const handleGoogleLogin = useCallback(() => {
    toast.info("🔍 Google login feature is coming soon!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const handleFacebookLogin = useCallback(() => {
    toast.info("📘 Facebook login feature is coming soon!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  return (
      <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="login-card card shadow-lg w-100">
        <div className="card-body p-1 p-md-5">
          {/* Header */}
          <div className="text-center mb-0">
            <img src={logo} alt="Logo" className="login-logo mb-3" />
            <h3 className="fw-bold">Welcome Back</h3>
            <p className="text-muted">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} >
            {/* Username */}
            <div className="mb-2">
              <label className="form-label">Username</label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || locked}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || locked}
                />
                <button
                  type="button"
                  className="buttonn pe-3 ps-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label">Remember me</label>
              </div>
              <Link to="/forgot-password" className="small">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="submit-btn  text-center w-100"
              disabled={!isFormValid || loading || locked}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4">
            {/* <p className="mb-1">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p> */}

            {showSocialLogin && (
              <>
                <div className="divider my-3">OR</div>
                <div className="text-muted mb-2">Continue With</div>
                <div className="mb-3 d-flex ">
                  <button className="btn btn-outline-danger w-100 mb-2">
                    🔍 Google
                  </button>
                  <button className="btn btn-outline-primary w-100">
                    📘 Facebook
                  </button></div>

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onSuccess: PropTypes.func,
  showSocialLogin: PropTypes.bool
};

export default React.memo(LoginForm); 