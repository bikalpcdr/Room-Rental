import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { isAuthenticated, getUserData } from "../utils/auth";
import "../style/home.css";
import PropTypes from "prop-types";

const features = [
  {
    icon: "🔒",
    title: "Secure & Verified",
    desc: "All properties are verified and landlords are background-checked for your safety.",
    feature: "Secure & Verified Properties"
  },
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Find rooms at competitive prices with no hidden fees or surprise charges.",
    feature: "Best Prices"
  },
  {
    icon: "⚡",
    title: "Instant Booking",
    desc: "Book your room instantly with our streamlined booking process.",
    feature: "Instant Booking"
  },
  {
    icon: "📱",
    title: "24/7 Support",
    desc: "Get help anytime with our round-the-clock customer support team.",
    feature: "24/7 Support"
  }
];

const stats = [
  { value: "10,000+", label: "Rooms Available" },
  { value: "5,000+", label: "Happy Renters" },
  { value: "500+", label: "Verified Landlords" },
  { value: "50+", label: "Cities Covered" }
];

const steps = [
  { number: 1, title: "Search", desc: "Browse through thousands of available rooms in your preferred location." },
  { number: 2, title: "Compare", desc: "Compare prices, amenities, and reviews to find your perfect match." },
  { number: 3, title: "Book", desc: "Book instantly with secure payment and get confirmation immediately." },
  { number: 4, title: "Move In", desc: "Meet your landlord, get keys, and move into your new room hassle-free." }
];

const testimonials = [
  {
    content: '"Found my perfect room within a day! The process was so smooth and the landlord was very professional."',
    name: "Sarah Johnson",
    role: "Student"
  },
  {
    content: '"As a landlord, this platform has made it so much easier to find reliable tenants. Highly recommended!"',
    name: "Mike Chen",
    role: "Property Owner"
  },
  {
    content: '"The verification process gave me peace of mind. I knew exactly what I was getting into before booking."',
    name: "Emily Davis",
    role: "Professional"
  }
];

function Home() {
  const userData = getUserData();

  const handleFeatureClick = useCallback((feature) => {
    if (!isAuthenticated()) {
      toast.info("Please sign in to access this feature!");
    } else {
      toast.success(`Welcome to ${feature}!`);
    }
  }, []);

  const handleTestimonialClick = useCallback(() => {
    toast.info("Thank you for your interest! More testimonials coming soon.");
  }, []);

  const handleStatsClick = useCallback(() => {
    toast.info("These are our current platform statistics!");
  }, []);

  return (
    <>
      <Header />
      <main className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Perfect Room
              <span className="highlight"> Anywhere, Anytime</span>
            </h1>
            <p className="hero-subtitle">
              Discover thousands of rooms for rent from verified landlords. 
              Book instantly with secure payments and 24/7 support.
            </p>
            <div className="hero-buttons">
              {!isAuthenticated() ? (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                </>
              ) : (
                <div className="welcome-message">
                  <p>Welcome back, {userData?.fullName}!</p>
                  <Link
                    to={
                      userData?.role?.toLowerCase() === 'admin' ? '/admin' : `/${userData?.role?.toLowerCase()}-dashboard`
                    }
                    className="btn btn-primary"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <span>🏠</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose Room Rental Service?</h2>
            <div className="features-grid">
              {features.map((f) => (
                <div className="feature-card" key={f.title} onClick={() => handleFeatureClick(f.feature)}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((s) => (
                <div className="stat-item" key={s.label} onClick={handleStatsClick}>
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              {steps.map((step) => (
                <div className="step-card" key={step.number}>
                  <div className="step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-title">What Our Users Say</h2>
            <div className="testimonials-grid">
              {testimonials.map((t) => (
                <div className="testimonial-card" key={t.name} onClick={handleTestimonialClick}>
                  <div className="testimonial-content">
                    <p>{t.content}</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">👤</div>
                    <div className="author-info">
                      <h4>{t.name}</h4>
                      <p>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Find Your Perfect Room?</h2>
              <p>Join thousands of satisfied users who found their ideal living space with us.</p>
              {!isAuthenticated() ? (
                <div className="cta-buttons">
                  <Link to="/register" className="btn btn-primary btn-large">
                    Start Your Search
                  </Link>
                  <Link to="/contact" className="btn btn-secondary btn-large">
                    Contact Us
                  </Link>
                </div>
              ) : (
                <div className="cta-buttons">
                  <Link to={`/${userData?.role.toLowerCase() === 'admin' ? 'admin' : userData?.role.toLowerCase()}-dashboard`} className="btn btn-primary btn-large">
                    Go to Dashboard
                  </Link>
                  <Link to="/contact" className="btn btn-secondary btn-large">
                    Get Support
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

Home.propTypes = {};

export default React.memo(Home);
