import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Show error message when component mounts
    toast.error('Payment failed. Please try again.');
  }, []);

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600">
            Unfortunately, your payment could not be processed. Please try again or contact support.
          </p>
        </div>

        {errorCode && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <div className="mb-2">
              <span className="text-sm text-red-600">Error Code:</span>
              <span className="ml-2 font-semibold text-red-800">{errorCode}</span>
            </div>
            {errorMessage && (
              <div>
                <span className="text-sm text-red-600">Message:</span>
                <span className="ml-2 text-red-800">{errorMessage}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <Link 
            to="/property-search"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Browse Properties
          </Link>
          <Link 
            to="/"
            className="block w-full text-blue-600 hover:text-blue-500"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>If the problem persists, please contact our support team.</p>
          <p className="mt-2">Email: support@roomrental.com | Phone: +1 (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
