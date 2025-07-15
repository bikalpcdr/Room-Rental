import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

function ProtectedRoute({ children, requiredRole = null }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && getUserRole() !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    const userRole = getUserRole();
    switch (userRole) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'OWNER':
        return <Navigate to="/owner-dashboard" replace />;
      case 'RENTER':
        return <Navigate to="/renter-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute; 