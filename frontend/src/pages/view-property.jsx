import React, { useEffect, useState, useCallback } from "react";
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
  const [mainImage, setMainImage] = useState(null);

  const API_BASE_URL = "http://localhost:7777";
  const getImageUrl = (img) =>
    img && typeof img.url === "string"
      ? (img.url.startsWith("http") ? img.url : API_BASE_URL + img.url)
      : "";

  const fetchProperty = useCallback(async () => {
    try {
      const res = await getPropertyById(id);
      setProperty(res.data?.data);
      setMainImage(res.data?.data?.images?.[0] || null);
    } catch (err) {
      toast.error("Failed to fetch property details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="vp-loading">Loading property details...</div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <div className="vp-loading">Property not found.</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="vp-container">
        <div className="vp-card">
          <div className="vp-gallery">
            {mainImage && (
              <img
                src={getImageUrl(mainImage)}
                alt="Main Property"
                className="vp-main-image"
              />
            )}
            {property.images && property.images.length > 1 && (
              <div className="vp-thumbnails">
                {property.images.map((img, idx) => (
                  <img
                    key={img.id || idx}
                    src={getImageUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`vp-thumb ${mainImage === img ? "active" : ""}`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="vp-details">
            <h1 className="vp-title">{(property.title || property.roomTitle || "").trim()}</h1>
            <div className="vp-meta">
              <span className="vp-type">{(property.propertyType || "").trim()}</span>
              <span className="vp-rooms">{property.roomCount} rooms</span>
              <span className="vp-price">Rs. {property.rentPrice}</span>
              <span className={`vp-available ${property.isAvailable ? "yes" : "no"}`}>
                {property.isAvailable ? "Available" : "Not Available"}
              </span>
            </div>
            <div className="vp-address">{(property.address || "").trim()}</div>
            <div className="vp-description">{(property.description || "").trim()}</div>
            <div className="vp-amenities">
              <h3>Amenities</h3>
              <ul>
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((a) => (
                    <li key={a}>
                      <span className={`amenity-icon ${a.toLowerCase()}`}></span>
                      {a.replace(/_/g, ' ')}
                    </li>
                  ))
                ) : (
                  <li>None</li>
                )}
              </ul>
            </div>
            <div className="vp-owner">
              <h3>Owner</h3>
              <div>{(property.ownerName || "").trim()}</div>
            </div>
            <Link to="/owner-dashboard" className="vp-back-btn">Back to Dashboard</Link>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default React.memo(ViewProperty); 