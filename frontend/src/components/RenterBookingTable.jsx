import React from "react";
import PropTypes from "prop-types";
import EsewaPaymentButton from "./EsewaPaymentButton";

class RenterBookingTable extends React.Component {
  render() {
    const { bookings, loading, onCancel, onViewProperty } = this.props;
    if (loading) {
      return (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      );
    }
    if (!bookings || bookings.length === 0) {
      return (
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          No bookings found.
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
              <th>Status</th>
              <th>Rent Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.property?.title || booking.property?.roomTitle || 'N/A'}</td>
                <td>{booking.property?.address || 'N/A'}</td>
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
                          className="delete-btn" 
                          onClick={() => onCancel(booking.id)}
                        >
                          Cancel
                        </button>
                        <EsewaPaymentButton
                          amount={booking.property?.rentPrice}
                          referenceId={booking.id.toString()}
                          productId={booking.property?.id?.toString()}
                          successUrl={`${window.location.origin}/payment-success`}
                          failureUrl={`${window.location.origin}/payment-failure`}
                        >
                          Pay with eSewa
                        </EsewaPaymentButton>
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

RenterBookingTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onViewProperty: PropTypes.func.isRequired,
};

export default RenterBookingTable; 