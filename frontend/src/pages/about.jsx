import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/header";
import Footer from "../components/footer";
import "../style/about.css";
import PropTypes from "prop-types";

const teamMembers = [
  {
    name: "Bikalpa Chaudhary",
    role: "CEO & Founder",
    bio: "Passionate about revolutionizing the rental industry with innovative technology solutions.",
  },
  {
    name: "Arbin Lama",
    role: "CTO",
    bio: "Leading our technical development with expertise in scalable platforms and user experience.",
  },
  {
    name: "Rajib Bikram Shah",
    role: "Head of Operations",
    bio: "Ensuring smooth operations and exceptional customer service across all touchpoints.",
  },
];

const stats = [
  { number: "10,000+", label: "Happy Renters" },
  { number: "5,000+", label: "Property Owners" },
  { number: "15,000+", label: "Rooms Listed" },
  { number: "98%", label: "Satisfaction Rate" },
];

function About() {
  return (
    <>
      <Header />
      <main className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1 className="hero-title">About Room Rental Service</h1>
            <p className="hero-subtitle">
              Connecting people with perfect living spaces since 2024
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="about-section">
          <div className="section-content">
            <h2 className="section-title">Our Story</h2>
            <div className="story-grid">
              <div className="story-text">
                <p>
                  Room Rental Service was born from a simple idea: making room rental 
                  accessible, transparent, and hassle-free for everyone. Founded in 2024, 
                  we recognized the challenges both renters and property owners face in 
                  the traditional rental market.
                </p>
                <p>
                  What started as a small platform has grown into a trusted community 
                  where thousands of people find their perfect living spaces every month. 
                  We believe everyone deserves a place they can call home, and we're 
                  committed to making that journey as smooth as possible.
                </p>
              </div>
              <div className="story-image">
                <div className="image-placeholder">
                  <i className="fas fa-home"></i>
                  <p>Our Journey</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="about-section mission-section">
          <div className="section-content">
            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3>Our Mission</h3>
                <p>
                  To revolutionize the room rental experience by providing a secure, 
                  transparent, and user-friendly platform that connects renters with 
                  quality living spaces while empowering property owners to manage 
                  their rentals efficiently.
                </p>
              </div>
              <div className="mission-card">
                <div className="mission-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h3>Our Vision</h3>
                <p>
                  To become the leading platform for room rentals, creating a world 
                  where finding and managing rental spaces is seamless, trustworthy, 
                  and accessible to everyone, regardless of their background or location.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="about-section">
          <div className="section-content">
            <h2 className="section-title">Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Trust & Security</h3>
                <p>
                  We prioritize the safety and security of our users, implementing 
                  rigorous verification processes and secure payment systems.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <h3>Transparency</h3>
                <p>
                  Clear communication, honest pricing, and open information sharing 
                  are the foundation of every interaction on our platform.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Community</h3>
                <p>
                  We foster a supportive community where renters and property owners 
                  can connect, share experiences, and build lasting relationships.
                </p>
              </div>
              <div className="value-card">
                <div className="value-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3>Innovation</h3>
                <p>
                  We continuously improve our platform with cutting-edge technology 
                  to provide the best possible user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="about-section stats-section">
          <div className="section-content">
            <h2 className="section-title">Our Impact</h2>
            <div className="stats-grid">
              {stats.map((stat, idx) => (
                <div className="stat-card" key={stat.label}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="about-section">
          <div className="section-content">
            <h2 className="section-title">Meet Our Team</h2>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <div className="team-card" key={member.name}>
                  <div className="team-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-section cta-section">
          <div className="section-content">
            <h2>Ready to Join Our Community?</h2>
            <p>
              Whether you're looking for a place to stay or want to list your property, 
              we're here to help you every step of the way.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Get Started Today</button>
              <button className="btn btn-secondary">Contact Us</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

About.propTypes = {};

export default React.memo(About); 