import React from "react";
import { useNavigate } from "react-router-dom";

interface Property {
  id?: string;
  propertyId?: string;
  title: string;
  propertyType: string;
  address: string;
  roomCount: number;
  rentPrice: number;
  isAvailable: boolean;
  amenities?: string[];
}

interface OwnerPropertyTableProps {
  properties: Property[];
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
  onUploadImages?: (propertyId: string) => void;
  onViewProperty?: (property: Property) => void;
}

const OwnerPropertyTable: React.FC<OwnerPropertyTableProps> = ({ 
  properties, 
  onEdit, 
  onDelete, 
  onUploadImages,
  onViewProperty 
}) => {
  const navigate = useNavigate();

  const handleView = (property: Property) => {
    if (onViewProperty) {
      onViewProperty(property);
    } else {
      navigate(`/property/${property.id || property.propertyId}`);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              S.N
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rooms
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rent
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Available
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amenities
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property, index) => (
            <tr key={property.id || property.propertyId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {property.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.propertyType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.roomCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Rs.{property.rentPrice}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  property.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.isAvailable ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {property.amenities?.join(", ") || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => handleView(property)}
                    className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-50 rounded text-xs"
                  >
                    View
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(property)}
                      className="text-green-600 hover:text-green-900 px-2 py-1 bg-green-50 rounded text-xs"
                    >
                      Edit
                    </button>
                  )}
                  {onUploadImages && (
                    <button
                      onClick={() => onUploadImages(property.id || property.propertyId!)}
                      className="text-purple-600 hover:text-purple-900 px-2 py-1 bg-purple-50 rounded text-xs"
                    >
                      Images
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(property.id || property.propertyId!)}
                      className="text-red-600 hover:text-red-900 px-2 py-1 bg-red-50 rounded text-xs"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {properties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No properties found
        </div>
      )}
    </div>
  );
};

export default OwnerPropertyTable;
