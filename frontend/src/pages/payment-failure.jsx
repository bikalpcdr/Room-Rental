import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderNumber = searchParams.get("orderNumber");
    const status = searchParams.get("status");

    if (orderNumber && status) {
      // Call the payment callback endpoint with failure status
      fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:7777'}/api/booking/payment-callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `orderNumber=${orderNumber}&status=FAILED`
      })
      .then(response => {
        if (response.ok) {
          toast.error("Payment failed - booking cancelled");
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

  const handleTryAgain = () => {
    navigate("/property-search");
  };

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Payment Failed</h1>
        </div>
        
        {loading ? (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Processing payment status...</p>
          </div>
        ) : (
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ color: '#721c24', marginBottom: '1rem' }}>
                ❌ Payment Failed!
              </h2>
              <p style={{ color: '#721c24', fontSize: '16px' }}>
                Your payment was not successful. The booking has been cancelled.
              </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3>What happened?</h3>
              <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                <li>Payment was cancelled or failed</li>
                <li>Insufficient funds in your account</li>
                <li>Network connectivity issues</li>
                <li>Payment gateway timeout</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={handleGoToDashboard}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #6c757d',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  color: '#6c757d',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleTryAgain}
                className="create-user-btn"
                style={{ minWidth: '150px' }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default PaymentFailure; 