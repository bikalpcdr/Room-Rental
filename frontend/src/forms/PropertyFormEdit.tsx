import React from "react";
import PropertyForm from "./PropertyForm";

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  address: string;
  roomCount: number;
  rentPrice: number;
  isAvailable: boolean;
  amenities: string[];
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  roomCount: number;
  rentPrice: number;
  isAvailable: boolean;
  amenities: string[];
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

interface PropertyFormEditProps {
  property: Property;
  onUpdate: (property: Property) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PropertyFormEdit: React.FC<PropertyFormEditProps> = ({ 
  property, 
  onUpdate, 
  onCancel, 
  loading = false 
}) => {
  const handleSubmit = () => {
    onUpdate(property);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
        <p className="text-gray-600">Update the property information below.</p>
      </div>
      
      <PropertyForm
        formData={property}
        setFormData={onUpdate}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isEdit={true}
        propertyId={property.id}
        selectedImages={[]}
        setSelectedImages={() => {}}
      />
    </div>
  );
};

export default PropertyFormEdit;
