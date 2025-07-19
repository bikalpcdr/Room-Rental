import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/terms.css";
import PropTypes from "prop-types";

function Terms() {
  return (
    <>
      <Header />
      <main className="terms-container">
        {/* Hero Section */}
        <section className="terms-hero">
          <div className="hero-content">
            <h1 className="hero-title">Terms of Service</h1>
            <p className="hero-subtitle">
              Please read these terms carefully before using our platform
            </p>
            <p className="last-updated">Last updated: December 2024</p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="terms-content">
          <div className="content-wrapper">
            <div className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Room Rental Service ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="terms-section">
              <h2>2. Description of Service</h2>
              <p>
                Room Rental Service is an online platform that connects property owners with potential renters. We provide a marketplace for listing, discovering, and booking rental properties. Our services include:
              </p>
              <ul>
                <li>Property listing and management tools</li>
                <li>Search and discovery features</li>
                <li>Booking and reservation system</li>
                <li>Payment processing services</li>
                <li>Communication tools between parties</li>
                <li>Verification and security features</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>3. User Accounts and Registration</h2>
              <p>
                To access certain features of the Platform, you must create an account. You agree to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>4. User Responsibilities</h2>
              <h3>4.1 Property Owners</h3>
              <p>As a property owner, you agree to:</p>
              <ul>
                <li>Provide accurate and complete property information</li>
                <li>Maintain your property in safe and habitable condition</li>
                <li>Honor confirmed bookings and reservations</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respond to renter inquiries in a timely manner</li>
                <li>Provide clear cancellation and refund policies</li>
              </ul>

              <h3>4.2 Renters</h3>
              <p>As a renter, you agree to:</p>
              <ul>
                <li>Provide accurate personal information</li>
                <li>Respect the property and its rules</li>
                <li>Pay all agreed-upon fees and deposits</li>
                <li>Communicate honestly with property owners</li>
                <li>Follow booking and cancellation policies</li>
                <li>Report any issues promptly</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>5. Payment Terms</h2>
              <p>
                All payments are processed through secure third-party payment processors. You agree to:
              </p>
              <ul>
                <li>Pay all fees and charges in full and on time</li>
                <li>Provide valid payment information</li>
                <li>Authorize charges for services used</li>
                <li>Accept our fee structure and pricing</li>
                <li>Understand that fees are non-refundable unless otherwise stated</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>6. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Platform for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Platform</li>
                <li>Use automated systems to access the Platform</li>
                <li>Provide false or misleading information</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>7. Content and Intellectual Property</h2>
              <p>
                You retain ownership of content you submit to the Platform. By submitting content, you grant us a worldwide, non-exclusive license to use, display, and distribute your content in connection with our services.
              </p>
              <p>
                The Platform and its original content, features, and functionality are owned by Room Rental Service and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </div>

            <div className="terms-section">
              <h2>8. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform, to understand our practices regarding the collection and use of your personal information.
              </p>
            </div>

            <div className="terms-section">
              <h2>9. Disclaimers and Limitations</h2>
              <p>
                The Platform is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul>
                <li>The accuracy of property listings or user information</li>
                <li>The availability of properties at all times</li>
                <li>Uninterrupted or error-free service</li>
                <li>The quality or safety of listed properties</li>
                <li>The conduct of other users</li>
              </ul>
              <p>
                In no event shall Room Rental Service be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.
              </p>
            </div>

            <div className="terms-section">
              <h2>10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Room Rental Service, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Platform or violation of these terms.
              </p>
            </div>

            <div className="terms-section">
              <h2>11. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Platform at any time, with or without cause, with or without notice. Upon termination, your right to use the Platform will cease immediately.
              </p>
            </div>

            <div className="terms-section">
              <h2>12. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Room Rental Service operates, without regard to its conflict of law provisions.
              </p>
            </div>

            <div className="terms-section">
              <h2>13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on the Platform. Your continued use of the Platform after such modifications constitutes acceptance of the updated terms.
              </p>
            </div>

            <div className="terms-section">
              <h2>14. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> legal@roomrental.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Main Street, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="terms-cta-section">
          <div className="section-content">
            <h2>Have Questions About Our Terms?</h2>
            <p>
              If you need clarification on any part of our Terms of Service, our legal team is here to help.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">
                <i className="fas fa-envelope"></i>
                Contact Legal Team
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-file-alt"></i>
                Download PDF
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

Terms.propTypes = {};

export default React.memo(Terms); 