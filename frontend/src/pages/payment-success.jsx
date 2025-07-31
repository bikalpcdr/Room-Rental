import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { toast } from "react-toastify";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderNumber = searchParams.get("orderNumber");
    const status = searchParams.get("status");

    if (orderNumber && status) {
      // Call the payment callback endpoint
      fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:7777'}/api/booking/payment-callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `orderNumber=${orderNumber}&status=${status}`
      })
      .then(response => {
        if (response.ok) {
          toast.success("Payment processed successfully!");
        } else {
          toast.error("Payment processing failed");
        }
      })
      .catch(error => {
        console.error("Payment callback error:", error);
        toast.error("Payment processing failed");
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleGoToDashboard = () => {
    navigate("/renter-dashboard");
  };

  const handleGoToBookings = () => {
    navigate("/renter-dashboard");
  };

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Payment Status</h1>
        </div>
        
        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Processing payment...</p>
          </div>
        ) : (
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ color: '#155724', marginBottom: '1rem' }}>
                ✅ Payment Successful!
              </h2>
              <p style={{ color: '#155724', fontSize: '16px' }}>
                Your booking has been confirmed and payment has been processed successfully.
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3>What's Next?</h3>
              <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                <li>You will receive a confirmation email</li>
                <li>The property owner will be notified of your booking</li>
                <li>You can view your booking details in your dashboard</li>
                <li>Contact the property owner for move-in details</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={handleGoToDashboard}
                className="create-user-btn"
                style={{ minWidth: '150px' }}
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleGoToBookings}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #007bff',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  color: '#007bff',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
              >
                View My Bookings
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default PaymentSuccess; 