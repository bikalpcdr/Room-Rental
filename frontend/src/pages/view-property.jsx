import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../api";
import Header from "../components/header";
import Footer from "../components/footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/view-property.css";
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
      <main className={"view-property"}>
        <h1>{property.title || property.roomTitle}</h1>
          <div className={"mian__items"}>
        <div><span>Description:</span> {property.description}</div>
        <div><span>Type:</span> {property.propertyType}</div>
        <div><span>Address:</span> {property.address}</div>
        <div><span>Room Count:</span> {property.roomCount}</div>
        <div><span>Rent Price:</span> {property.rentPrice}</div>
        <div ><span>Available:</span> {property.isAvailable ? "Yes" : "No"}</div>
        <div><span>Owner:</span> {property.ownerName}</div>
        <div className={"amenities"}>
          <span>Amenities:</span>
          <ul>
            {property.amenities && property.amenities.length > 0 ? (
              property.amenities.map((a) => <li key={a}>{a},</li>)
            ) : (
              <li>None</li>
            )}
          </ul>
        </div>
          </div>
        <Link to="/owner-dashboard" className={"back_to_dashboard , edit-btn"}>Back to Dashboard</Link>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default ViewProperty; 