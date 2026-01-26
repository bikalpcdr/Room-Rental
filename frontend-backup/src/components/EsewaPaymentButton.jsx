import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { initiateEsewaPayment, esewaInquiry, esewaTokenPayment, esewaStatusCheck } from "../api";

function EsewaPaymentButton({ amount, referenceId, productId, successUrl, failureUrl, children, useTokenApi = false }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [formData, setFormData] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [result, setResult] = useState(null);

  const handlePay = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (useTokenApi) {
        // Token-based flow: Inquiry -> Payment -> Status Check
        const inquiryRes = await esewaInquiry(referenceId);
        const inquiryData = inquiryRes.data;
        if (inquiryData.response_code !== 0) {
          setResult({ error: inquiryData.response_message || "Inquiry failed" });
          setLoading(false);
          return;
        }
        // Simulate transaction_code (in real use, get from eSewa after user pays)
        const transactionCode = "SIMULATED_CODE";
        const paymentRes = await esewaTokenPayment({
          request_id: referenceId,
          amount,
          transaction_code: transactionCode,
          // Add package_id if needed
        });
        const paymentData = paymentRes.data;
        if (paymentData.response_code !== 0) {
          setResult({ error: paymentData.response_message || "Payment failed" });
          setLoading(false);
          return;
        }
        // Status check
        const statusRes = await esewaStatusCheck({
          request_id: referenceId,
          amount,
          transaction_code: transactionCode,
        });
        setResult(statusRes.data);
        setLoading(false);
        return;
      }
      // Old flow (form POST)
      const res = await initiateEsewaPayment({
        amount,
        referenceId,
        productId,
        successUrl,
        failureUrl
      });
      const data = res.data;
      setFormData(data);
      setPaymentUrl(data.paymentUrl);
      setTimeout(() => {
        if (formRef.current) formRef.current.submit();
      }, 100);
    } catch (err) {
      setResult({ error: "Failed to initiate payment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : (children || "Pay with eSewa")}
      </button>
      {formData && paymentUrl && !useTokenApi && (
        <form
          ref={formRef}
          action={paymentUrl}
          method="POST"
          style={{ display: "none" }}
        >
          {Object.entries(formData).map(([key, value]) => (
            key !== "paymentUrl" && (
              <input key={key} type="hidden" name={key} value={value} />
            )
          ))}
        </form>
      )}
      {result && (
        <div style={{ marginTop: 8, color: result.error ? 'red' : 'green' }}>
          {result.error ? result.error : JSON.stringify(result)}
        </div>
      )}
    </>
  );
}

EsewaPaymentButton.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  referenceId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  successUrl: PropTypes.string.isRequired,
  failureUrl: PropTypes.string.isRequired,
  children: PropTypes.node,
  useTokenApi: PropTypes.bool
};

export default EsewaPaymentButton; 