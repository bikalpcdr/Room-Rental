import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Contact from "./pages/contact";
import About from "./pages/about";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import AdminDashboard from "./pages/admin/admin-dashboard";
import OwnerDashboard from "./pages/owner/owner-dashboard";
import RenterDashboard from "./pages/renter/renter-dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewProperty from "./pages/view-property";
import PropertySearch from "./pages/property-search";
import PaymentSuccess from "./pages/payment-success";
import PaymentFailure from "./pages/payment-failure";
import OtpRequestPage from "./pages/OtpRequestPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ScrollToTop from "./components/ScrollToTop";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <a href="/" className="text-blue-600 hover:text-blue-800 underline">
        Go to Home
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/property/:id" element={<ViewProperty />} />
        <Route path="/property-search" element={<PropertySearch />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/forgot-password" element={<OtpRequestPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/owner-dashboard" 
          element={
            <ProtectedRoute requiredRole="OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/renter-dashboard" 
          element={
            <ProtectedRoute requiredRole="RENTER">
              <RenterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer 
        style={{ zIndex: 9999 }} 
        position="top-right" 
        autoClose={5000} 
      />
    </BrowserRouter>
  );
}

export default React.memo(App);
