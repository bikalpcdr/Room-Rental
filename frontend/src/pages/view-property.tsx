import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  roomCount: number;
  rentPrice: number;
  isAvailable: boolean;
  amenities: string[];
  images: Array<{ id: number; url: string }>;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

const ViewProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<{ id: number; url: string } | null>(null);

  const API_BASE_URL = "http://localhost:7777";
  const getImageUrl = (img: string) =>
    img ? (img.startsWith("http") ? img : API_BASE_URL + img) : "";

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    
    try {
      const res = await getPropertyById(id);
      const propertyData = res.data?.data;
      setProperty(propertyData);
      setMainImage(propertyData?.images?.[0] || null);
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading property details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Property not found.</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-wrap lg:flex-nowrap gap-8 p-8">
              {/* Gallery Section */}
              <div className="flex-1 min-w-0">
                <div className="space-y-4">
                  {mainImage && (
                    <img
                      src={getImageUrl(mainImage.url)}
                      alt="Main Property"
                      className="w-full h-96 object-cover rounded-lg shadow-md"
                    />
                  )}
                  {property.images && property.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {property.images.map((img) => (
                        <img
                          key={img.id}
                          src={getImageUrl(img.url)}
                          alt={`Thumbnail ${img.id}`}
                          className={`w-full h-24 object-cover rounded cursor-pointer transition-all ${
                            mainImage?.id === img.id ? "ring-2 ring-blue-500" : "hover:opacity-80"
                          }`}
                          onClick={() => setMainImage(img)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Details Section */}
              <div className="flex-1 min-w-0 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {property.propertyType}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {property.roomCount} rooms
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Rs. {property.rentPrice.toLocaleString()}/month
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.isAvailable 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {property.isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>

                  <div className="text-gray-600 mb-4">
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.address}
                  </div>

                  <div className="text-gray-700 mb-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="leading-relaxed">{property.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {property.amenities && property.amenities.length > 0 ? (
                        property.amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {amenity.replace(/_/g, ' ')}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500">No amenities listed</div>
                      )}
                    </div>
                  </div>

                  {property.ownerName && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-2">Owner</h3>
                      <div className="text-gray-700">{property.ownerName}</div>
                    </div>
                  )}

                  <Link 
                    to="/owner-dashboard" 
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default React.memo(ViewProperty);
