import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/header';
import Footer from '../components/footer';
import '../style/OptRequestPage.css';
import { requestOpt, verifyOtp } from "../api";

const OptRequestPage = () => {
    const navigate = useNavigate();
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    // Request OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!emailOrUsername) {
            toast.error("Please enter email or username");
            return;
        }

        try {
            await requestOpt(emailOrUsername);
            toast.success("OTP sent successfully!");
            setOtpSent(true);   // show OTP input field
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send OTP");
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }

        try {
            await verifyOtp(emailOrUsername, otp);
            toast.success("OTP verified successfully!");

            // Redirect using React Router
            navigate('/change-password');

        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="otp-request-page">
            <Header />

            <div className="otp-form-container">
                {!otpSent ? (
                    <>
                        <h2>Request OTP</h2>
                        <form onSubmit={handleRequestOtp}>
                            <input
                                type="text"
                                placeholder="Enter Email or Username"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                            />
                            <button type="submit">Request OTP</button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2>Verify OTP</h2>
                        <div className="otp-message">
                            Check your registered email for OTP
                        </div>
                        <form onSubmit={handleVerifyOtp} className="otp-verify-form">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button type="submit">Verify OTP</button>
                        </form>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default OptRequestPage;