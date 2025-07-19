import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserData, logout, isAdmin, isOwner, isRenter } from "../utils/auth";
import { uploadProfilePicture } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Memoize userData to avoid unnecessary re-renders
  const userData = useMemo(() => getUserData(), [location.pathname, isAuthenticated()]);

  // Memoize dashboard link
  const dashboardLink = useMemo(() => {
    if (isAdmin()) return "/admin-dashboard";
    if (isOwner()) return "/owner-dashboard";
    if (isRenter()) return "/renter-dashboard";
    return "/";
  }, [userData]);

  const backendBaseUrl = "http://localhost:7777";
  const getProfileImageUrl = useCallback((url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : backendBaseUrl + url;
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);
  const toggleUserMenu = useCallback(() => setIsUserMenuOpen((open) => !open), []);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  // Helper to update profilePictureUrl in localStorage
  const updateUserProfilePictureUrl = useCallback((newUrl) => {
    const userData = getUserData();
    const updatedUser = { ...userData, profilePictureUrl: newUrl };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedImage) return;
    setUploading(true);
    try {
      const res = await uploadProfilePicture(userData.id, selectedImage);
      const newUrl = res.data?.data;
      updateUserProfilePictureUrl(newUrl);
      toast.success("Profile picture updated!");
      setSelectedImage(null);
      setPreviewUrl(null);
      // Instead of reload, you may want to refetch user data or force a re-render
      // window.location.reload();
    } catch (err) {
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  }, [selectedImage, userData, updateUserProfilePictureUrl]);

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo/Brand */}
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <div className="brand-icon">🏠</div>
            <h1 className="brand-title">Room Rental Service</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`} aria-label="Main Navigation">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {!isAuthenticated() || !userData ? (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link login-link">Login</Link>
              <Link to="/register" className="nav-link register-link">Register</Link>
            </div>
          ) : (
            <div className="user-section">
              {/* User Menu */}
              <div className="user-menu-container">
                <button 
                  className="user-menu-trigger"
                  onClick={toggleUserMenu}
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="user-avatar">
                    {userData?.profilePictureUrl ? (
                      <img src={getProfileImageUrl(userData.profilePictureUrl)} alt="avatar" className="avatar-img" />
                    ) : (
                      userData?.fullName?.charAt(0) || 'U'
                    )}
                  </div>
                  <span className="user-name">{userData?.fullName}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar-large" style={{ position: 'relative' }}>
                        {userData?.profilePictureUrl ? (
                          <img src={getProfileImageUrl(userData.profilePictureUrl)} alt="avatar" className="avatar-img-large" />
                        ) : (
                          userData?.fullName?.charAt(0) || 'U'
                        )}
                        <label htmlFor="profile-upload" className="camera-icon" style={{ position: 'absolute', bottom: 0, right: 0, cursor: 'pointer' }}>
                          <span role="img" aria-label="Change profile picture">📷</span>
                          <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      {previewUrl && (
                        <div className="profile-upload-preview">
                          <img src={previewUrl} alt="Preview" className="avatar-img-large" style={{ marginTop: 8 }} />
                          <button onClick={handleUpload} disabled={uploading} className="upload-btn">
                            {uploading ? "Uploading..." : "Upload"}
                          </button>
                          <button onClick={() => { setPreviewUrl(null); setSelectedImage(null); }} className="cancel-btn">Cancel</button>
                        </div>
                      )}
                    </div>
                    <div className="dropdown-links">
                      <Link 
                        to={dashboardLink} 
                        className="dropdown-link"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        🏠 Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="dropdown-link"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        👤 Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="dropdown-link"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        ⚙️ Settings
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        onClick={handleLogout}
                        className="dropdown-link logout-link"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button onClick={toggleMenu} className="close-menu-btn">×</button>
            </div>
            <div className="mobile-menu-links">
              <Link to="/" className="mobile-link" onClick={toggleMenu}>🏠 Home</Link>
              <Link to="/about" className="mobile-link" onClick={toggleMenu}>ℹ️ About</Link>
              <Link to="/contact" className="mobile-link" onClick={toggleMenu}>📞 Contact</Link>
              {!isAuthenticated() || !userData ? (
                <>
                  <Link to="/login" className="mobile-link" onClick={toggleMenu}>🔑 Login</Link>
                  <Link to="/register" className="mobile-link" onClick={toggleMenu}>📝 Register</Link>
                </>
              ) : (
                <>
                  <Link to={dashboardLink} className="mobile-link" onClick={toggleMenu}>🏠 Dashboard</Link>
                  <Link to="/profile" className="mobile-link" onClick={toggleMenu}>👤 Profile</Link>
                  <button onClick={handleLogout} className="mobile-link logout-mobile">🚪 Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </header>
  );
}

export default Header;