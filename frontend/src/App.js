import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Contact from "./pages/contact";
import About from "./pages/about";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import AdminDashboard from "./pages/admin-dashboard";
import OwnerDashboard from "./pages/owner-dashboard";
import RenterDashboard from "./pages/renter-dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewProperty from "./pages/view-property";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/property/:id" element={<ViewProperty />} />
        <Route 
          path="/admin" 
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
