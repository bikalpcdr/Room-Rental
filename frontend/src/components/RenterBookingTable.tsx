import React from "react";

interface Booking {
  id: string;
  property?: {
    title?: string;
    address?: string;
    rentPrice?: number;
  };
  status: string;
  startDate?: string;
  endDate?: string;
}

interface RenterBookingTableProps {
  bookings: Booking[];
  loading?: boolean;
  onCancel?: (bookingId: string) => void;
  onViewProperty?: (propertyId: string) => void;
}

const RenterBookingTable: React.FC<RenterBookingTableProps> = ({ 
  bookings, 
  loading, 
  onCancel, 
  onViewProperty 
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rent Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {booking.property?.title || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {booking.property?.address || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking.property?.rentPrice ? `Rs.${booking.property.rentPrice}` : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {booking.startDate && booking.endDate ? (
                  <div>
                    <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                    <div className="text-xs">to</div>
                    <div>{new Date(booking.endDate).toLocaleDateString()}</div>
                  </div>
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {onViewProperty && (
                    <button
                      onClick={() => onViewProperty(booking.id)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 rounded text-sm"
                    >
                      View Property
                    </button>
                  )}
                  {booking.status === 'PENDING' && onCancel && (
                    <button
                      onClick={() => onCancel(booking.id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 bg-red-50 rounded text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RenterBookingTable;
