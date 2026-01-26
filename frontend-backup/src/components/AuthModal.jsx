import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'react-feather';
import LoginForm from '../forms/LoginForm';
import RegisterForm from '../forms/RegisterForm';
import './style/auth-modal.css';

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [isLogin, setIsLogin] = useState(defaultTab === 'login');
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsLogin(defaultTab === 'login');
      // Trigger animation on next tick
      setTimeout(() => setIsVisible(true), 10);
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
      // Delay unmounting for animation
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, defaultTab]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`auth-modal-backdrop ${isVisible ? 'visible' : ''}`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={`auth-modal-container ${isVisible ? 'visible' : ''}`}>
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="auth-modal-content">
          <div className="auth-tabs pe-4 ps-4">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <div className="auth-form-container">
            {isLogin ? (
              <LoginForm
                onSuccess={(userData) => {
                  // Navigate to role-based dashboard
                  switch (userData.role) {
                    case 'ADMIN':
                      window.location.href = '/admin-dashboard';
                      break;
                    case 'OWNER':
                      window.location.href = '/owner-dashboard';
                      break;
                    case 'RENTER':
                      window.location.href = '/renter-dashboard';
                      break;
                    default:
                      window.location.href = '/';
                  }
                  onClose();
                }}
              />
            ) : (
              <RegisterForm onSuccess={onClose} />
            )}
          </div>
        </div>
      </div>

    </div>,
    document.body
  );
};

export default React.memo(AuthModal);
