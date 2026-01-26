import React, { useRef, useState } from "react";
import { initiatePayment } from "../api";

interface EsewaPaymentButtonProps {
  amount: number;
  referenceId: string;
  productId?: string;
  successUrl: string;
  failureUrl: string;
  children?: React.ReactNode;
  className?: string;
}

const EsewaPaymentButton: React.FC<EsewaPaymentButtonProps> = ({ 
  amount, 
  referenceId, 
  productId, 
  successUrl, 
  failureUrl, 
  children,
  className = ""
}) => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePay = async () => {
    setLoading(true);
    
    try {
      const paymentData = {
        amount,
        referenceId,
        productId: productId || referenceId,
        successUrl,
        failureUrl,
        paymentMethod: 'esewa'
      };

      const response = await initiatePayment(paymentData);
      
      if (response.data.paymentUrl) {
        // Redirect to eSewa payment page
        window.location.href = response.data.paymentUrl;
      } else {
        // Fallback to form submission for older eSewa integration
        const formData = new FormData();
        formData.append('amt', amount.toString());
        formData.append('pdc', '0');
        formData.append('psc', '0');
        formData.append('txAmt', '0');
        formData.append('tAmt', amount.toString());
        formData.append('pid', productId || referenceId);
        formData.append('scd', 'EPAYTEST');
        formData.append('su', successUrl);
        formData.append('fu', failureUrl);

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
        
        formData.forEach((value, key) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value.toString();
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form ref={formRef} style={{ display: 'none' }} />
      <button
        onClick={handlePay}
        disabled={loading}
        className={`bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {children || `Pay with eSewa - Rs. ${amount}`}
          </span>
        )}
      </button>
    </>
  );
};

export default EsewaPaymentButton;
