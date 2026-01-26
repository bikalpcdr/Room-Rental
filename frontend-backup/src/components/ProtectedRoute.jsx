import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

function ProtectedRoute({ children, requiredRole = null }) {
  const userRole = useMemo(() => getUserRole(), []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    switch (userRole) {
      case 'ADMIN':
        return <Navigate to="/admin-dashboard" replace />;
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

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default ProtectedRoute; 