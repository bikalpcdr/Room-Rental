import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { isAuthenticated, getUserData } from "../utils/auth";
import "../style/home.css";

function Home() {
  const userData = getUserData();

  const handleFeatureClick = (feature) => {
    if (!isAuthenticated()) {
      toast.info("Please sign in to access this feature!");
    } else {
      toast.success(`Welcome to ${feature}!`);
    }
  };

  const handleTestimonialClick = () => {
    toast.info("Thank you for your interest! More testimonials coming soon.");
  };

  const handleStatsClick = () => {
    toast.info("These are our current platform statistics!");
  };

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
                  <Link to={`/${userData?.role.toLowerCase() === 'admin' ? 'admin' : userData?.role.toLowerCase()}-dashboard`} className="btn btn-primary">
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
              <div className="feature-card" onClick={() => handleFeatureClick("Secure & Verified Properties")}>
                <div className="feature-icon">🔒</div>
                <h3>Secure & Verified</h3>
                <p>All properties are verified and landlords are background-checked for your safety.</p>
              </div>
              <div className="feature-card" onClick={() => handleFeatureClick("Best Prices")}>
                <div className="feature-icon">💰</div>
                <h3>Best Prices</h3>
                <p>Find rooms at competitive prices with no hidden fees or surprise charges.</p>
              </div>
              <div className="feature-card" onClick={() => handleFeatureClick("Instant Booking")}>
                <div className="feature-icon">⚡</div>
                <h3>Instant Booking</h3>
                <p>Book your room instantly with our streamlined booking process.</p>
              </div>
              <div className="feature-card" onClick={() => handleFeatureClick("24/7 Support")}>
                <div className="feature-icon">📱</div>
                <h3>24/7 Support</h3>
                <p>Get help anytime with our round-the-clock customer support team.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item" onClick={handleStatsClick}>
                <h3>10,000+</h3>
                <p>Rooms Available</p>
              </div>
              <div className="stat-item" onClick={handleStatsClick}>
                <h3>5,000+</h3>
                <p>Happy Renters</p>
              </div>
              <div className="stat-item" onClick={handleStatsClick}>
                <h3>500+</h3>
                <p>Verified Landlords</p>
              </div>
              <div className="stat-item" onClick={handleStatsClick}>
                <h3>50+</h3>
                <p>Cities Covered</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Search</h3>
                <p>Browse through thousands of available rooms in your preferred location.</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Compare</h3>
                <p>Compare prices, amenities, and reviews to find your perfect match.</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Book</h3>
                <p>Book instantly with secure payment and get confirmation immediately.</p>
              </div>
              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Move In</h3>
                <p>Meet your landlord, get keys, and move into your new room hassle-free.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-title">What Our Users Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card" onClick={handleTestimonialClick}>
                <div className="testimonial-content">
                  <p>"Found my perfect room within a day! The process was so smooth and the landlord was very professional."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">👤</div>
                  <div className="author-info">
                    <h4>Sarah Johnson</h4>
                    <p>Student</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card" onClick={handleTestimonialClick}>
                <div className="testimonial-content">
                  <p>"As a landlord, this platform has made it so much easier to find reliable tenants. Highly recommended!"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">👤</div>
                  <div className="author-info">
                    <h4>Mike Chen</h4>
                    <p>Property Owner</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card" onClick={handleTestimonialClick}>
                <div className="testimonial-content">
                  <p>"The verification process gave me peace of mind. I knew exactly what I was getting into before booking."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">👤</div>
                  <div className="author-info">
                    <h4>Emily Davis</h4>
                    <p>Professional</p>
                  </div>
                </div>
              </div>
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

export default Home;
