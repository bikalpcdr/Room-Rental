import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import Header from "../components/header";
import Footer from "../components/footer";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaCheckCircle, 
  FaPaperPlane, 
  FaSpinner, 
  FaHeadset,
  FaBuilding
} from "react-icons/fa";
import "../style/contact.css";

const faqs = [
  {
    question: "How do I list my room for rent?",
    answer:
      "Simply create an account, verify your property ownership, and use our easy-to-use listing tool to upload photos and details about your room.",
  },
  {
    question: "What are the fees for using the platform?",
    answer:
      "We charge a small percentage fee only when a successful rental is completed. There are no upfront costs to list your property.",
  },
  {
    question: "How do I verify a property owner?",
    answer:
      "We use multiple verification methods including document verification, phone verification, and address confirmation to ensure property authenticity.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely through our payment partners.",
  },
  {
    question: "How long does it take to get a response?",
    answer:
      "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes, you can cancel bookings according to our cancellation policy. Please check the specific terms for your booking or contact support.",
  },
];

const locations = [
  {
    city: "New York",
    address: "123 Main Street, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "nyc@roomrental.com",
  },
  {
    city: "Los Angeles",
    address: "456 Sunset Blvd, Los Angeles, CA 90210",
    phone: "+1 (555) 234-5678",
    email: "la@roomrental.com",
  },
  {
    city: "Chicago",
    address: "789 Michigan Ave, Chicago, IL 60601",
    phone: "+1 (555) 345-6789",
    email: "chicago@roomrental.com",
  },
];

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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  }, []);

  return (
    <>
      <Header />
      <main className="contact-container">
        {/* Hero Section */}
        <section className="contact-hero d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="display-4 fw-bold mb-4 animate animate-delay-1">Get in Touch</h1>
                <p className="lead mb-5 text-white-75 animate animate-delay-2">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-5">Contact Information</h2>
            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon mx-auto mb-3">
                      <FaMapMarkerAlt className="fs-3" />
                    </div>
                    <h3 className="h5">Our Office</h3>
                    <p className="mb-0">123 Main Street</p>
                    <p className="mb-0">New York, NY 10001</p>
                    <p className="mb-0">United States</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon mx-auto mb-3">
                      <FaPhone className="fs-3" />
                    </div>
                    <h3 className="h5">Phone</h3>
                    <p className="mb-0">+1 (555) 123-4567</p>
                    <p className="mb-0">+1 (555) 987-6543</p>
                    <p className="mb-0">Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon mx-auto mb-3">
                      <FaEnvelope className="fs-3" />
                    </div>
                    <h3 className="h5">Email</h3>
                    <p className="mb-0">info@roomrental.com</p>
                    <p className="mb-0">support@roomrental.com</p>
                    <p className="mb-0">sales@roomrental.com</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon mx-auto mb-3">
                      <FaClock className="fs-3" />
                    </div>
                    <h3 className="h5">Business Hours</h3>
                    <p className="mb-0">Monday - Friday: 9AM-6PM</p>
                    <p className="mb-0">Saturday: 10AM-4PM</p>
                    <p className="mb-0">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow">
                  <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-5">
                      <h2 className="mb-2">Send us a Message</h2>
                      <p className="text-muted">Fill out the form below and we'll get back to you within 24 hours.</p>
                    </div>
                    
                    {submitStatus === 'success' && (
                      <div className="alert alert-success d-flex align-items-center" role="alert">
                        <FaCheckCircle className="flex-shrink-0 me-2" />
                        <div>Thank you! Your message has been sent successfully.</div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label htmlFor="phone" className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="inquiryType" className="form-label">Inquiry Type *</label>
                          <select
                            className="form-select"
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

                      <div className="mb-3">
                        <label htmlFor="subject" className="form-label">Subject *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="Enter message subject"
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="message" className="form-label">Message *</label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Tell us how we can help you..."
                        ></textarea>
                      </div>

                      <div className="form-check mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="terms"
                          required
                        />
                        <label className="form-check-label" htmlFor="terms">
                          I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                        </label>
                      </div>

                      <div className="d-grid">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <FaSpinner className="fa-spin me-2" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="me-2" />
                              Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-5">Frequently Asked Questions</h2>
            <div className="row g-4">
              {faqs.map((faq, idx) => (
                <div className="col-md-6" key={faq.question}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h3 className="h5">{faq.question}</h3>
                      <p className="mb-0 text-muted">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center mb-5">Our Office Locations</h2>
            <div className="row g-4">
              {locations.map((loc) => (
                <div className="col-md-4" key={loc.city}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="feature-icon mx-auto mb-3">
                        <FaBuilding className="fs-3" />
                      </div>
                      <h3 className="h5">{loc.city}</h3>
                      <div className="text-muted">
                        <p className="mb-1"><strong>Address:</strong></p>
                        <p className="mb-2">{loc.address}</p>
                        <p className="mb-1"><strong>Phone:</strong> {loc.phone}</p>
                        <p className="mb-0"><strong>Email:</strong> {loc.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-5  text-white">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="mb-4">Still Have Questions?</h2>
                <p className="lead mb-5 text-white-75">
                  Can't find what you're looking for? Our support team is here to help you 
                  with any questions or concerns you might have.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <button className="btn btn-light btn-lg px-4">
                    <FaHeadset className="me-2" />
                    Live Chat Support
                  </button>
                  <button className="btn btn-outline-light btn-lg px-4">
                    <FaPhone className="me-2" />
                    Call Us Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default React.memo(Contact);