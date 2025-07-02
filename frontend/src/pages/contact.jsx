import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    inquiryType: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        phone: "",
        inquiryType: "general"
      });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className="contact-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-content">
            <h1 className="hero-title">Get in Touch</h1>
            <p className="hero-subtitle">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="contact-info-section">
          <div className="section-content">
            <h2 className="section-title">Contact Information</h2>
            <div className="contact-info-grid">
              <div className="contact-info-card">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3>Our Office</h3>
                <p>123 Main Street</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
              </div>
              <div className="contact-info-card">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>+1 (555) 987-6543</p>
                <p>Mon-Fri: 9AM-6PM EST</p>
              </div>
              <div className="contact-info-card">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h3>Email</h3>
                <p>info@roomrental.com</p>
                <p>support@roomrental.com</p>
                <p>sales@roomrental.com</p>
              </div>
              <div className="contact-info-card">
                <div className="contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9AM-6PM</p>
                <p>Saturday: 10AM-4PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="section-content">
            <div className="form-container">
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>
              
              {submitStatus === 'success' && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <p>Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type *</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter message subject"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    {/*<span className="checkmark"></span>*/}
                    I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-content">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>How do I list my room for rent?</h3>
                <p>
                  Simply create an account, verify your property ownership, and use our 
                  easy-to-use listing tool to upload photos and details about your room.
                </p>
              </div>
              <div className="faq-item">
                <h3>What are the fees for using the platform?</h3>
                <p>
                  We charge a small percentage fee only when a successful rental is completed. 
                  There are no upfront costs to list your property.
                </p>
              </div>
              <div className="faq-item">
                <h3>How do I verify a property owner?</h3>
                <p>
                  We use multiple verification methods including document verification, 
                  phone verification, and address confirmation to ensure property authenticity.
                </p>
              </div>
              <div className="faq-item">
                <h3>What payment methods do you accept?</h3>
                <p>
                  We accept all major credit cards, debit cards, and bank transfers. 
                  All payments are processed securely through our payment partners.
                </p>
              </div>
              <div className="faq-item">
                <h3>How long does it take to get a response?</h3>
                <p>
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please call our support line.
                </p>
              </div>
              <div className="faq-item">
                <h3>Can I cancel a booking?</h3>
                <p>
                  Yes, you can cancel bookings according to our cancellation policy. 
                  Please check the specific terms for your booking or contact support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="locations-section">
          <div className="section-content">
            <h2 className="section-title">Our Office Locations</h2>
            <div className="locations-grid">
              <div className="location-card">
                <div className="location-header">
                  <i className="fas fa-building"></i>
                  <h3>New York</h3>
                </div>
                <div className="location-details">
                  <p><strong>Address:</strong></p>
                  <p>123 Main Street, New York, NY 10001</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Email:</strong> nyc@roomrental.com</p>
                </div>
              </div>
              <div className="location-card">
                <div className="location-header">
                  <i className="fas fa-building"></i>
                  <h3>Los Angeles</h3>
                </div>
                <div className="location-details">
                  <p><strong>Address:</strong></p>
                  <p>456 Sunset Blvd, Los Angeles, CA 90210</p>
                  <p><strong>Phone:</strong> +1 (555) 234-5678</p>
                  <p><strong>Email:</strong> la@roomrental.com</p>
                </div>
              </div>
              <div className="location-card">
                <div className="location-header">
                  <i className="fas fa-building"></i>
                  <h3>Chicago</h3>
                </div>
                <div className="location-details">
                  <p><strong>Address:</strong></p>
                  <p>789 Michigan Ave, Chicago, IL 60601</p>
                  <p><strong>Phone:</strong> +1 (555) 345-6789</p>
                  <p><strong>Email:</strong> chicago@roomrental.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="contact-cta-section">
          <div className="section-content">
            <h2>Still Have Questions?</h2>
            <p>
              Can't find what you're looking for? Our support team is here to help you 
              with any questions or concerns you might have.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">
                <i className="fas fa-headset"></i>
                Live Chat Support
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-phone"></i>
                Call Us Now
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

export default Contact; 