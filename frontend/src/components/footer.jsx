import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-logo">🏠</div>
              <h3>Room Rental Service</h3>
            </div>
            <p className="footer-description">
              Your trusted platform for finding and renting rooms. 
              Connect with verified landlords and find your perfect living space.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                📘
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                🐦
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                📷
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                💼
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">🏠 Home</Link></li>
              <li><Link to="/about">ℹ️ About Us</Link></li>
              <li><Link to="/contact">📞 Contact</Link></li>
              <li><Link to="/login">🔑 Login</Link></li>
              <li><Link to="/register">📝 Register</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><a href="#">🏠 Room Rentals</a></li>
              <li><a href="#">🏢 Property Management</a></li>
              <li><a href="#">🔍 Room Search</a></li>
              <li><a href="#">📋 Tenant Screening</a></li>
              <li><a href="#">💰 Payment Processing</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section contact-card">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Kirtipur, Kathmandu, Nepal</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>9863261000</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>bikalpcdr43@gmail.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Room Rental Service. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;