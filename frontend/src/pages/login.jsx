import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/login.css";
import { loginUser } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(username, password);
      const userData = res.data?.data;
      
      // Store user data and token in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        profilePictureUrl: userData.profilePictureUrl
      }));

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedUsername', username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedUsername');
      }

      // Set flag to show welcome toast on dashboard
      localStorage.setItem('showWelcomeToast', 'true');

      // Redirect immediately based on user role
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

    } catch (err) {
      toast.error(
          err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="login-page">
        <div className="login-background">
          <div className="login-container">
            <div className="login-header">
              <div className="login-logo">🏠</div>
              <h1>Welcome Back</h1>
              <p>Sign in to your account to continue</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>Don't have an account? <Link to="/register" className="register-link">Sign up here</Link></p>
            </div>

            <div className="login-divider">
              <span>or</span>
            </div>

            <div className="social-login">
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
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
      <Footer />
    </>
  );
}

export default Login;