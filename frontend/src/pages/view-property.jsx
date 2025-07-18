import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../api";
import Header from "../components/header";
import Footer from "../components/footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewProperty() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.data?.data);
      } catch (err) {
        toast.error("Failed to fetch property details");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: "center", margin: "2rem" }}>Loading property details...</div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <div style={{ textAlign: "center", margin: "2rem" }}>Property not found.</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 700, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: "2rem" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>{property.title || property.roomTitle}</h1>
        <div style={{ marginBottom: "1rem" }}><b>Description:</b> {property.description}</div>
        <div style={{ marginBottom: "1rem" }}><b>Type:</b> {property.propertyType}</div>
        <div style={{ marginBottom: "1rem" }}><b>Address:</b> {property.address}</div>
        <div style={{ marginBottom: "1rem" }}><b>Room Count:</b> {property.roomCount}</div>
        <div style={{ marginBottom: "1rem" }}><b>Rent Price:</b> {property.rentPrice}</div>
        <div style={{ marginBottom: "1rem" }}><b>Available:</b> {property.isAvailable ? "Yes" : "No"}</div>
        <div style={{ marginBottom: "1rem" }}><b>Owner:</b> {property.ownerName}</div>
        <div style={{ marginBottom: "1rem" }}>
          <b>Amenities:</b>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {property.amenities && property.amenities.length > 0 ? (
              property.amenities.map((a) => <li key={a}>{a}</li>)
            ) : (
              <li>None</li>
            )}
          </ul>
        </div>
        <Link to="/owner-dashboard" style={{ color: "#667eea", textDecoration: "underline" }}>Back to Dashboard</Link>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default ViewProperty; 