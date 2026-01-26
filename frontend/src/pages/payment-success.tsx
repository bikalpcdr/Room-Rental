import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Show success message when component mounts
    toast.success('Payment completed successfully!');
  }, []);

  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Your booking has been confirmed and payment has been processed successfully.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          {bookingId && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">Booking ID:</span>
              <span className="ml-2 font-semibold">{bookingId}</span>
            </div>
          )}
          {amount && (
            <div>
              <span className="text-sm text-gray-600">Amount Paid:</span>
              <span className="ml-2 font-semibold">${amount}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Link 
            to="/renter-dashboard"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View My Bookings
          </Link>
          <Link 
            to="/"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>A confirmation email has been sent to your registered email address.</p>
          <p className="mt-2">If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
