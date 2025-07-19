import React from "react";
import { Link } from "react-router-dom";

const quickLinks = [
  { to: "/", label: "🏠 Home" },
  { to: "/about", label: "ℹ️ About Us" },
  { to: "/contact", label: "📞 Contact" },
  { to: "/login", label: "🔑 Login" },
  { to: "/register", label: "📝 Register" },
];

const services = [
  { label: "🏠 Room Rentals" },
  { label: "🏢 Property Management" },
  { label: "🔍 Room Search" },
  { label: "📋 Tenant Screening" },
  { label: "💰 Payment Processing" },
];

const socialLinks = [
  { href: "#", label: "Facebook", icon: "📘" },
  { href: "#", label: "Twitter", icon: "🐦" },
  { href: "#", label: "Instagram", icon: "📷" },
  { href: "#", label: "LinkedIn", icon: "💼" },
];

const contactInfo = [
  { icon: "📍", text: "Kirtipur, Kathmandu, Nepal" },
  { icon: "📞", text: "9863261000" },
  { icon: "✉️", text: "bikalpcdr43@gmail.com" },
  { icon: "🕒", text: "24/7 Support Available" },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <section className="footer-section" aria-label="Company Info">
            <div className="footer-brand">
              <div className="footer-logo">🏠</div>
              <h3>Room Rental Service</h3>
            </div>
            <p className="footer-description">
              Your trusted platform for finding and renting rooms. 
              Connect with verified landlords and find your perfect living space.
            </p>
            <nav className="social-links" aria-label="Social Media Links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="social-link"
                  aria-label={link.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.icon}
                </a>
              ))}
            </nav>
          </section>

          {/* Quick Links */}
          <section className="footer-section" aria-label="Quick Links">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </section>

          {/* Services */}
          <section className="footer-section" aria-label="Services">
            <h4>Services</h4>
            <ul className="footer-links">
              {services.map((service, idx) => (
                <li key={idx}><span>{service.label}</span></li>
              ))}
            </ul>
          </section>

          {/* Contact Info */}
          <section className="footer-section contact-card" aria-label="Contact Info">
            <h4>Contact Us</h4>
            <address className="contact-info">
              {contactInfo.map((item, idx) => (
                <div className="contact-item" key={idx}>
                  <span className="contact-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </address>
          </section>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <p>&copy; {currentYear} Room Rental Service. All rights reserved.</p>
          </div>
          <nav className="footer-bottom-links" aria-label="Footer Policies">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;