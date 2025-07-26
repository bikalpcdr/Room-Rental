import React from "react";
import PropTypes from "prop-types";

class OwnerBookingRequestTable extends React.Component {
  render() {
    const { bookings, loading, onApprove, onReject, onViewProperty } = this.props;
    if (loading) {
      return (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading booking requests...</p>
        </div>
      );
    }
    if (!bookings || bookings.length === 0) {
      return (
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          No booking requests found.
        </p>
      );
    }
    return (
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Address</th>
              <th>Renter</th>
              <th>Status</th>
              <th>Rent Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.property?.roomTitle || 'N/A'}</td>
                <td>{booking.property?.address || 'N/A'}</td>
                <td>
                  {booking.renter?.fullName}
                  <br />
                  <small>{booking.renter?.email}</small>
                  <br />
                  <small>{booking.renter?.phoneNumber}</small>
                </td>
                <td>
                  <span className={`role-badge role-${booking.status?.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </td>
                <td>Rs.{booking.property?.rentPrice || 0}</td>
                <td>
                  <div className="action-buttons">
                    {booking.status === 'PENDING' && (
                      <>
                        <button 
                          className="edit-btn" 
                          onClick={() => onApprove(booking.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="delete-btn" 
                          onClick={() => onReject(booking.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button 
                      className="view-btn" 
                      onClick={() => onViewProperty(booking.property?.id)}
                    >
                      View Property
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

OwnerBookingRequestTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onViewProperty: PropTypes.func.isRequired,
};

export default OwnerBookingRequestTable; 