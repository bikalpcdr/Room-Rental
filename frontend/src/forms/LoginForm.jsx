import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

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
            navigate('/admin');
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
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo">
          🏠
        </div>
        <h1>Welcome Back</h1>
        <p>Sign in to your account to continue</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className={`input-wrapper ${errors.username ? 'error' : ''}`}>
            <span className="password-toggle">👤</span>
            <input
              id="username"
              type="text"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => handleInputChange('username', e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || locked}
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

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || locked}
              aria-describedby="password-error"
              aria-invalid={!!errors.password}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={handlePasswordToggle}
              disabled={loading || locked}
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

        {locked && (
          <div className="lockout-message">
            🔒 Account temporarily locked due to too many failed attempts. 
            Please try again in 5 minutes.
          </div>
        )}

        <div className="form-options">
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMe}
              disabled={loading || locked}
            />
            <span className="checkmark"></span>
            Remember me
          </label>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>

        <button 
          type="submit" 
          className={`login-button ${!isFormValid || loading || locked ? 'disabled' : ''}`}
          disabled={!isFormValid || loading || locked}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Signing in...
            </>
          ) : locked ? (
            "Account Locked"
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="login-footer">
        <p>Don't have an account? <Link to="/register" className="register-link">Sign up here</Link></p>
      </div>

      {showSocialLogin && (
        <>
          <div className="login-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <button 
              className="social-button google"
              disabled={loading || locked}
              type="button"
              onClick={handleGoogleLogin}
            >
              <span>🔍</span>
              Continue with Google
            </button>
            <button 
              className="social-button facebook"
              disabled={loading || locked}
              type="button"
              onClick={handleFacebookLogin}
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

LoginForm.propTypes = {
  onSuccess: PropTypes.func,
  showSocialLogin: PropTypes.bool
};

export default React.memo(LoginForm); 