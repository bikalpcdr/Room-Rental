import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/header';
import Footer from '../components/footer';
import '../style/payment-failure.css';

function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
    const [errorDetails, setErrorDetails] = useState(null);

    // Function to decode base64 string
    const decodeBase64 = (str) => {
        try {
            return JSON.parse(atob(str));
        } catch (error) {
            console.error('Error decoding base64 data:', error);
            return null;
        }
    };

  useEffect(() => {
        const handlePaymentFailure = async () => {
            try {
                // Get eSewa data from URL parameter
                const esewaData = searchParams.get('data');
                
                if (!esewaData) {
                    console.error('No eSewa data found in URL parameters');
                    setErrorDetails({
                        orderNumber: 'N/A',
                        errorMessage: 'Payment was cancelled or failed',
                        amount: 'N/A'
                    });
                    setLoading(false);
                    return;
                }

                // Decode the base64 data from eSewa
                const paymentInfo = decodeBase64(esewaData);
                console.log('Decoded eSewa data (failure):', paymentInfo);

                if (!paymentInfo) {
                    console.error('Failed to decode eSewa data');
                    setErrorDetails({
                        orderNumber: 'N/A',
                        errorMessage: 'Invalid payment response',
                        amount: 'N/A'
                    });
                    setLoading(false);
                    return;
                }

                // Extract payment data from decoded eSewa response
                const orderNumber = paymentInfo.transaction_uuid;
                const transactionCode = paymentInfo.transaction_code;
                const transactionUuid = paymentInfo.transaction_uuid;
                const status = paymentInfo.status;
                const totalAmount = paymentInfo.total_amount;
                const productCode = paymentInfo.product_code;
                const signature = paymentInfo.signature;
                const signedFieldNames = paymentInfo.signed_field_names;

                console.log('Extracted payment parameters (failure):', {
                    orderNumber,
                    transactionCode,
                    transactionUuid,
                    status,
                    totalAmount,
                    productCode,
                    signature,
                    signedFieldNames
                });

                // Prepare transaction data for failed payment
                const transactionRequest = {
                    bookingId: parseInt(transactionUuid), // Extract booking ID from transaction_uuid
                    orderNumber: orderNumber,
                    transactionCode: transactionCode,
                    transactionUuid: transactionUuid,
                    status: status === 'COMPLETE' ? 'SUCCESS' : 'FAILED',
                    totalAmount: parseFloat(totalAmount),
                    productCode: productCode,
                    signature: signature,
                    signedFieldName: signedFieldNames,
                    paymentMethod: 'E_SEWA',
                    orderType: 'BOOKING'
                };

                setErrorDetails({
                    orderNumber: orderNumber,
                    errorMessage: 'Payment was cancelled or failed',
                    amount: totalAmount
                });

                // Save failed transaction to backend
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:7777'}/api/v1/payment-transaction/callback`, {
        method: 'POST',
        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
                    body: JSON.stringify(transactionRequest)
                });

        if (response.ok) {
                    console.log('Failed transaction saved');
        } else {
                    console.error('Failed to save failed transaction:', response.status, response.statusText);
        }

            } catch (error) {
                console.error('Error handling payment failure:', error);
                toast.error('Error processing payment failure');
                setErrorDetails({
                    orderNumber: 'N/A',
                    errorMessage: 'Error processing payment failure',
                    amount: 'N/A'
      });
            } finally {
      setLoading(false);
    }
        };

        handlePaymentFailure();
  }, [searchParams]);

    const handleRetryPayment = () => {
        navigate('/property-search');
    };

  const handleGoToDashboard = () => {
        navigate('/renter-dashboard');
  };

    const handleContactSupport = () => {
        // You can implement contact support functionality
        toast.info('Contact support at bikalpcdr@roomrental.com');
  };

    if (loading) {
  return (
    <>
      <Header />
                <div className="payment-failure-container">
            <div className="loading-spinner"></div>
            <p>Processing payment status...</p>
          </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="payment-failure-container">
                <div className="failure-card">
                    <div className="failure-icon">❌</div>
                    <h1>Payment Failed</h1>
                    <p>Sorry, your payment could not be processed. Please try again or contact support if the problem persists.</p>
                    
                    {errorDetails && (
                        <div className="error-details">
                            <h3>Error Details</h3>
                            <div className="detail-row">
                                <span>Order Number:</span>
                                <span>{errorDetails.orderNumber}</span>
                            </div>
                            <div className="detail-row">
                                <span>Amount:</span>
                                <span>Rs. {errorDetails.amount}</span>
                            </div>
                            <div className="detail-row">
                                <span>Error:</span>
                                <span className="error-message">{errorDetails.errorMessage}</span>
            </div>
            </div>
                    )}

                    <div className="action-buttons">
                        <button className="retry-btn" onClick={handleRetryPayment}>
                            Try Again
                        </button>
                        <button className="dashboard-btn" onClick={handleGoToDashboard}>
                Go to Dashboard
              </button>
                        <button className="support-btn" onClick={handleContactSupport}>
                            Contact Support
              </button>
            </div>
          </div>
            </div>
      <Footer />
    </>
  );
}

export default PaymentFailure; 