import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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
    name: "Nabraj Bohora",
    role: "Student"
  },
  {
    content: '"As a landlord, this platform has made it so much easier to find reliable tenants. Highly recommended!"',
    name: "Gharbeti baa",
    role: "Property Owner"
  },
  {
    content: '"The verification process gave me peace of mind. I knew exactly what I was getting into before booking."',
    name: "Hari Chalise",
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
        <section className="hero-section common-section">
          <div className="container">
            <div className="row align-items-center g-4 py-4">
              <div className="col-12 col-lg-9 hero-content">
                <h1 className="hero-title display-4 fw-bold mb-4">
                  Find Your Perfect Room
                  <span className="text-primary"> Anywhere, Anytime</span>
                </h1>
                <p className="hero-subtitle lead mb-4">
                  Discover thousands of rooms for rent from verified landlords.
                  Book instantly with secure payments and 24/7 support.
                </p>
                <div className="hero-buttons d-flex flex-wrap gap-3">
                  {!isAuthenticated() ? (
                    <>
                      <Link 
                        to="/register" 
                        className="btn btn-warning btn-lg fw-bold px-4 py-2"
                      >
                        Get Started
                      </Link>
                      <Link 
                        to="/login" 
                        className="btn btn-outline-light btn-lg px-4 py-2"
                      >
                        Sign In
                      </Link>
                    </>
                  ) : (
                    <div className="welcome-message text-white">
                      <p className="h4 mb-3">Welcome back, {userData?.fullName}!</p>
                      <Link
                        to={userData?.role?.toLowerCase() === 'admin' ? '/admin' : `/${userData?.role?.toLowerCase()}-dashboard`}
                        className="btn btn-light btn-lg"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-lg-3 hero-image">
                <div className="rounded-4 p-2">
                  <div className="ratio ratio-16x9 d-flex align-items-center justify-content-center">
                    <span className="display-1 p-3">🏠</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section common-section py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title display-5 fw-bold mb-3">
                Why Choose Room Hunt?
              </h2>
              <p className="lead text-muted mx-auto" style={{maxWidth: '700px'}}>
                We provide the best platform to find and rent rooms with ease and confidence.
              </p>
            </div>

            <div className="row g-4 features-grid">
              {features.map((f, index) => (
                <div
                  className="col-12 col-md-6 col-lg-3"
                  key={f.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div
                    className="feature-card card h-100 text-center p-4 shadow-sm border-0"
                    onClick={() => handleFeatureClick(f.feature)}
                  >
                    <div className="feature-icon mb-3 fs-1">
                      {f.icon}
                    </div>
                    <h3 className="h5 fw-bold mb-3">
                      {f.title}
                    </h3>
                    <p className="text-muted mb-0">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Statistics Section */}
        <section className="stats-sectionn py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="section-title display-5 fw-bold mb-3">
                Our Impact
              </h2>
              <p className="lead text-muted">
                Join thousands of satisfied users who found their perfect space
              </p>
            </div>
            <div className="row g-4 text-center stats-grid">
              {stats.map((s, index) => (
                <div
                  className="col-sm-12 col-lg-3 col-md-6 "
                  key={s.label}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div
                    className="stat-item p-4 h-100 shadow-sm rounded "
                    onClick={handleStatsClick}
                  >
                    <h3 className="display-4 fw-bold text-primary mb-2">
                      {s.value}
                    </h3>
                    <p className="mb-0 text-muted fw-medium">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* How It Works Section */}
        <section className="how-it-works-section py-5">
          <div className="container">
            <h2 className="section-title text-center mb-5">
              How It Works
            </h2>

            <div className="row g-2 steps-grid">
              {steps.map((step) => (
                <div
                  className="col-12 col-md-6 col-lg-3"
                  key={step.number}
                >
                  <div className="step-card h-100 p-4 text-center">
                    <div className="step-number mb-3">
                      {step.number}
                    </div>

                    <h3 className="h5 fw-bold mb-2">
                      {step.title}
                    </h3>

                    <p className="text-muted mb-0">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Testimonials Section */}
        <section className="testimonials-section py-5">
          <div className="container">
            <h2 className="section-title text-center mb-5">
              What Our Users Say
            </h2>

            <div className="row g-4 testimonials-grid">
              {testimonials.map((t) => (
                <div
                  className="col-12 col-md-6 col-lg-4"
                  key={t.name}
                >
                  <div
                    className="testimonial-card h-100 p-4"
                    onClick={handleTestimonialClick}
                  >
                    <div className="testimonial-content mb-4">
                      <p className="mb-0">
                        “{t.content}”
                      </p>
                    </div>

                    <div className="testimonial-author d-flex align-items-center gap-3">
                      <div className="author-avatar">
                        👤
                      </div>

                      <div className="author-info">
                        <h4 className="mb-0">
                          {t.name}
                        </h4>
                        <p className="mb-0">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="rh-cta-section py-5">
          <div className="container">
            <div className="rh-cta-content text-center">
              <h2 className="rh-cta-title mb-3 fw-bold">
                Ready to Find Your Perfect Room?
              </h2>
              <p className="rh-cta-text mb-4">
                Join thousands of satisfied users who found their ideal living space with us.
              </p>

              {!isAuthenticated() ? (
                <div className="rh-cta-buttons d-flex flex-wrap justify-content-center gap-3">
                  <Link to="/register" className="rh-cta-btn-primary btn-lg">
                    Start Your Search
                  </Link>
                  <Link to="/contact" className="rh-cta-btn-secondary btn-lg">
                    Contact Us
                  </Link>
                </div>
              ) : (
                <div className="rh-cta-buttons d-flex flex-wrap justify-content-center gap-3">
                  <Link
                    to={`/${userData?.role.toLowerCase() === 'admin'
                      ? 'admin'
                      : userData?.role.toLowerCase()
                      }-dashboard`}
                    className="rh-cta-btn-primary btn-lg"
                  >
                    Go to Dashboard
                  </Link>
                  <Link to="/contact" className="rh-cta-btn-secondary btn-lg">
                    Get Support
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>






      </main>
      <Footer />
    </>
  );
}

Home.propTypes = {};

export default React.memo(Home);
