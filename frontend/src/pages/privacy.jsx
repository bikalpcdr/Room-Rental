import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/privacy.css";
import PropTypes from "prop-types";

function Privacy() {
  return (
    <>
      <Header />
      <main className="privacy-container">
        {/* Hero Section */}
        <section className="privacy-hero">
          <div className="hero-content">
            <h1 className="hero-title">Privacy Policy</h1>
            <p className="hero-subtitle">
              How we collect, use, and protect your personal information
            </p>
            <p className="last-updated">Last updated: December 2024</p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="privacy-content">
          <div className="content-wrapper">
            <div className="privacy-section">
              <h2>1. Introduction</h2>
              <p>
                Room Rental Service ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
              </p>
              <p>
                By using our platform, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>

            <div className="privacy-section">
              <h2>2. Information We Collect</h2>
              
              <h3>2.1 Personal Information</h3>
              <p>We collect personal information that you provide directly to us, including:</p>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Date of birth and gender</li>
                <li>Address and location information</li>
                <li>Government-issued identification documents</li>
                <li>Payment and billing information</li>
                <li>Profile information and preferences</li>
              </ul>

              <h3>2.2 Property Information</h3>
              <p>For property owners, we may collect:</p>
              <ul>
                <li>Property details and descriptions</li>
                <li>Property photos and videos</li>
                <li>Pricing and availability information</li>
                <li>Property ownership documentation</li>
                <li>Insurance and safety information</li>
              </ul>

              <h3>2.3 Usage Information</h3>
              <p>We automatically collect certain information when you use our platform:</p>
              <ul>
                <li>Device information and IP addresses</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent</li>
                <li>Search queries and preferences</li>
                <li>Communication and interaction data</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              
              <h3>3.1 Service Provision</h3>
              <ul>
                <li>Creating and managing your account</li>
                <li>Processing bookings and payments</li>
                <li>Facilitating communication between users</li>
                <li>Providing customer support</li>
                <li>Verifying user identities</li>
              </ul>

              <h3>3.2 Platform Improvement</h3>
              <ul>
                <li>Analyzing usage patterns and trends</li>
                <li>Improving our services and features</li>
                <li>Personalizing user experience</li>
                <li>Developing new products and services</li>
                <li>Conducting research and analytics</li>
              </ul>

              <h3>3.3 Communication</h3>
              <ul>
                <li>Sending service-related notifications</li>
                <li>Providing updates about our platform</li>
                <li>Responding to your inquiries</li>
                <li>Sending marketing communications (with consent)</li>
                <li>Sharing important policy changes</li>
              </ul>

              <h3>3.4 Legal and Security</h3>
              <ul>
                <li>Complying with legal obligations</li>
                <li>Preventing fraud and abuse</li>
                <li>Ensuring platform security</li>
                <li>Resolving disputes and conflicts</li>
                <li>Enforcing our terms of service</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>4. Information Sharing and Disclosure</h2>
              <p>We may share your information in the following circumstances:</p>

              <h3>4.1 With Other Users</h3>
              <ul>
                <li>Property owners may see renter information for bookings</li>
                <li>Renters may see property owner information for listings</li>
                <li>Communication between parties is facilitated</li>
                <li>Reviews and ratings may be publicly displayed</li>
              </ul>

              <h3>4.2 With Service Providers</h3>
              <ul>
                <li>Payment processors for transaction processing</li>
                <li>Cloud storage providers for data hosting</li>
                <li>Analytics services for usage analysis</li>
                <li>Customer support tools for assistance</li>
                <li>Marketing services for promotional activities</li>
              </ul>

              <h3>4.3 Legal Requirements</h3>
              <ul>
                <li>When required by law or legal process</li>
                <li>To protect our rights and property</li>
                <li>In emergency situations for safety</li>
                <li>To prevent fraud or illegal activities</li>
                <li>In connection with business transfers</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>5. Data Security</h2>
              <p>We implement appropriate security measures to protect your information:</p>
              <ul>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>6. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. The retention period depends on:
              </p>
              <ul>
                <li>The type of information collected</li>
                <li>The purpose for which it was collected</li>
                <li>Legal and regulatory requirements</li>
                <li>Your account status and activity</li>
                <li>Your consent and preferences</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>7. Your Rights and Choices</h2>
              <p>You have the following rights regarding your personal information:</p>

              <h3>7.1 Access and Control</h3>
              <ul>
                <li>Access and review your personal information</li>
                <li>Update or correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain processing activities</li>
              </ul>

              <h3>7.2 Communication Preferences</h3>
              <ul>
                <li>Opt out of marketing communications</li>
                <li>Choose your notification preferences</li>
                <li>Control email and SMS settings</li>
                <li>Manage push notification settings</li>
              </ul>

              <h3>7.3 Cookies and Tracking</h3>
              <ul>
                <li>Control cookie settings in your browser</li>
                <li>Opt out of analytics tracking</li>
                <li>Manage advertising preferences</li>
                <li>Control third-party tracking</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2>8. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and features</li>
                <li>Improve security and prevent fraud</li>
                <li>Deliver relevant advertisements</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences, though disabling certain cookies may affect platform functionality.
              </p>
            </div>

            <div className="privacy-section">
              <h2>9. Third-Party Services</h2>
              <p>
                Our platform may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </div>

            <div className="privacy-section">
              <h2>10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this policy and applicable laws.
              </p>
            </div>

            <div className="privacy-section">
              <h2>11. Children's Privacy</h2>
              <p>
                Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
              </p>
            </div>

            <div className="privacy-section">
              <h2>12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="privacy-section">
              <h2>13. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@roomrental.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Main Street, New York, NY 10001</p>
                <p><strong>Data Protection Officer:</strong> dpo@roomrental.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="privacy-cta-section">
          <div className="section-content">
            <h2>Questions About Your Privacy?</h2>
            <p>
              Our privacy team is here to help you understand your rights and our data practices.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">
                <i className="fas fa-shield-alt"></i>
                Contact Privacy Team
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-download"></i>
                Download Policy
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

Privacy.propTypes = {};

export default React.memo(Privacy); 