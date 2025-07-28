import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { initiateEsewaPayment } from "../api";

function EsewaPaymentButton({ amount, referenceId, productId, successUrl, failureUrl, children }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [formData, setFormData] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState("");

  const handlePay = async () => {
    setLoading(true);
    try {
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
      alert("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : (children || "Pay with eSewa")}
      </button>
      {formData && paymentUrl && (
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
    </>
  );
}

EsewaPaymentButton.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  referenceId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  successUrl: PropTypes.string.isRequired,
  failureUrl: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default EsewaPaymentButton; 