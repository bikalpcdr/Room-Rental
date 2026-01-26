import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Home, Building, Users, ChevronDown, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { logout, isAuthenticated, getUserData, isAdmin, isOwner, isRenter } from "../utils/auth.js";
import AuthModal from "./AuthModal";
import { uploadProfilePicture } from "../api";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  profilePictureUrl?: string;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'register'>('login');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const prevScrollY = useRef(0);

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setIsAuthModalOpen(true);
    setDefaultTab(tab);
    setIsMenuOpen(false);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const userData = useMemo(() => getUserData() as UserData, [location.pathname, isAuthenticated()]);

  const dashboardLink = useMemo(() => {
    if (isAdmin()) return "/admin-dashboard";
    if (isOwner()) return "/owner-dashboard";
    if (isRenter()) return "/renter-dashboard";
    return "/";
  }, [userData]);

  const getProfileImageUrl = useCallback((url: string | undefined) => {
    if (!url) return null;
    return url.startsWith("http") ? url : url;
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);
  const toggleUserMenu = useCallback(() => setIsUserMenuOpen((open) => !open), []);

  const handleLogout = useCallback(() => {
    logout();
    setIsUserMenuOpen(false);
    closeAuthModal();
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  }, [navigate, location.pathname, closeAuthModal]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const updateUserProfilePictureUrl = useCallback((newUrl: string) => {
    const userData = getUserData();
    const updatedUser = { ...userData, profilePictureUrl: newUrl };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedImage || !userData?.id) return;
    setUploading(true);
    try {
      const formData = new FormData();
      const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
          setUploading(true);
          const userData = getUserData();
          if (userData) {
            await uploadProfilePicture(userData.id, file);
            toast.success('Profile picture updated successfully!');
            // Refresh user data
            window.location.reload();
          }
        } catch (error) {
          toast.error('Failed to upload profile picture');
        } finally {
          setUploading(false);
        }
      };
    } catch (err) {
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  }, [selectedImage, userData, updateUserProfilePictureUrl]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold text-gray-800">RoomRental</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
              <Link to="/property-search" className="text-gray-600 hover:text-blue-600 transition">Properties</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</Link>
              
              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {userData?.profilePictureUrl ? (
                        <img
                          src={getProfileImageUrl(userData.profilePictureUrl)}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <span className="hidden lg:block">{userData?.username}</span>
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold">{userData?.username}</p>
                        <p className="text-xs text-gray-500">{userData?.email}</p>
                      </div>
                      <Link
                        to={dashboardLink}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          // Open profile picture upload modal
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/property-search" className="text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                  Properties
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                
                {isAuthenticated() ? (
                  <>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          {userData?.profilePictureUrl ? (
                            <img
                              src={getProfileImageUrl(userData.profilePictureUrl)}
                              alt="Profile"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{userData?.username}</span>
                      </div>
                      <Link
                        to={dashboardLink}
                        className="block text-gray-600 hover:text-blue-600 mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-red-600 hover:text-red-700"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="text-gray-600 hover:text-blue-600 text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          defaultTab={defaultTab}
        />
      )}

      {/* Profile Picture Upload Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Update Profile Picture</h3>
            <div className="mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setPreviewUrl(null);
                }}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
