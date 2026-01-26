import React from "react";

interface Booking {
  id: string;
  property?: {
    title?: string;
    address?: string;
  };
  renter?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  status: string;
  rentPrice?: number;
}

interface OwnerBookingRequestTableProps {
  bookings: Booking[];
  loading?: boolean;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onViewProperty?: (propertyId: string) => void;
}

const OwnerBookingRequestTable: React.FC<OwnerBookingRequestTableProps> = ({ 
  bookings, 
  loading, 
  onApprove, 
  onReject, 
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
        <p className="mt-4 text-gray-600">Loading booking requests...</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No booking requests found.</p>
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
              Renter
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rent Price
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
              <td className="px-6 py-4 text-sm">
                <div className="text-gray-900 font-medium">{booking.renter?.fullName}</div>
                <div className="text-gray-500 text-xs">{booking.renter?.email}</div>
                <div className="text-gray-500 text-xs">{booking.renter?.phoneNumber}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking.rentPrice ? `Rs.${booking.rentPrice}` : 'N/A'}
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
                  {booking.status === 'PENDING' && onApprove && (
                    <button
                      onClick={() => onApprove(booking.id)}
                      className="text-green-600 hover:text-green-900 px-3 py-1 bg-green-50 rounded text-sm"
                    >
                      Approve
                    </button>
                  )}
                  {booking.status === 'PENDING' && onReject && (
                    <button
                      onClick={() => onReject(booking.id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 bg-red-50 rounded text-sm"
                    >
                      Reject
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

export default OwnerBookingRequestTable;
