import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/header';
import Footer from '../components/footer';
import '../style/payment-success.css';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [transactionData, setTransactionData] = useState(null);

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
        const handlePaymentSuccess = async () => {
            try {
                // Get eSewa data from URL parameter
                const esewaData = searchParams.get('data');
                
                if (!esewaData) {
                    console.error('No eSewa data found in URL parameters');
                    toast.error('Invalid payment response. Please contact support.');
                    setLoading(false);
                    return;
                }

                // Decode the base64 data from eSewa
                const paymentInfo = decodeBase64(esewaData);
                console.log('Decoded eSewa data:', paymentInfo);

                if (!paymentInfo) {
                    console.error('Failed to decode eSewa data');
                    toast.error('Invalid payment response. Please contact support.');
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

                console.log('Extracted payment parameters:', {
                    orderNumber,
                    transactionCode,
                    transactionUuid,
                    status,
                    totalAmount,
                    productCode,
                    signature,
                    signedFieldNames
                });

                // Prepare transaction data
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

                setTransactionData(transactionRequest);

                // Save transaction to backend
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:7777'}/api/v1/payment-transaction/callback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(transactionRequest)
                });

                if (response.ok) {
                    toast.success('Payment successful! Transaction saved.');
                } else {
                    console.error('Failed to save transaction:', response.status, response.statusText);
                    toast.warning('Payment successful but transaction could not be saved. Please contact support.');
                }

            } catch (error) {
                console.error('Error handling payment success:', error);
                toast.error('Error processing payment success. Please contact support.');
            } finally {
                setLoading(false);
            }
        };

        handlePaymentSuccess();
    }, [searchParams, navigate]);

    const handleContinue = () => {
        navigate('/property-search');
    };

    const handleViewBookings = () => {
        navigate('/renter-dashboard');
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="payment-success-container">
                    <div className="loading-spinner"></div>
                    <p>Processing your payment...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="payment-success-container">
                <div className="success-card">
                    <div className="success-icon">✅</div>
                    <h1>Payment Successful!</h1>
                    <p>Your booking has been confirmed and payment has been processed successfully.</p>
                    
                    {transactionData && (
                        <div className="transaction-details">
                            <h3>Transaction Details</h3>
                            <div className="detail-row">
                                <span>Order Number:</span>
                                <span>{transactionData.orderNumber}</span>
                            </div>
                            <div className="detail-row">
                                <span>Transaction Code:</span>
                                <span>{transactionData.transactionCode}</span>
                            </div>
                            <div className="detail-row">
                                <span>Transaction ID:</span>
                                <span>{transactionData.transactionUuid}</span>
                            </div>
                            <div className="detail-row">
                                <span>Amount:</span>
                                <span>Rs. {transactionData.totalAmount}</span>
                            </div>
                            <div className="detail-row">
                                <span>Status:</span>
                                <span className="status-success">{transactionData.status}</span>
                            </div>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button className="continue-btn" onClick={handleContinue}>
                            Continue Browsing
                        </button>
                        <button className="view-bookings-btn" onClick={handleViewBookings}>
                            View My Bookings
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PaymentSuccess; 