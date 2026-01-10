import React from "react";
import { Link } from "react-router-dom";
import "../style/footer.css";

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
    <footer className="footer  pt-4 pb-3">
      <div className="container">
        <div className="row g-4">
          {/* Company Info */}
          <section className="col-md-6 col-lg-3" aria-label="Company Info">
            <div className="d-flex align-items-center mb-3">
              <div className="fs-2 me-2">🏠</div>
              <h3 className="h5 mb-0">Room Rental Service</h3>
            </div>
            <p className="text-muted small mb-3">
              Your trusted platform for finding and renting rooms. 
              Connect with verified landlords and find your perfect living space.
            </p>
            <nav className="d-flex gap-2" aria-label="Social Media Links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-decoration-none text-dark bg-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{width: '36px', height: '36px'}}
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
          <section className="col-md-6 col-lg-3" aria-label="Quick Links">
            <h4 className="h5 mb-3">Quick Links</h4>
            <ul className="list-unstyled">
              {quickLinks.map((link) => (
                <li key={link.to} className="mb-2">
                  <Link to={link.to} className="text-decoration-none text-muted small">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Services */}
          <section className="col-md-6 col-lg-3" aria-label="Services">
            <h4 className="h5 mb-3">Services</h4>
            <ul className="list-unstyled">
              {services.map((service, idx) => (
                <li key={idx} className="mb-2">
                  <span className="text-muted small">{service.label}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact Info */}
          <section className="col-md-6 col-lg-3" aria-label="Contact Info">
            <h4 className="h5 mb-3">Contact Us</h4>
            <address className="text-muted small">
              {contactInfo.map((item, idx) => (
                <div key={idx} className="d-flex align-items-start mb-2">
                  <span className="me-2">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </address>
          </section>
        </div>
      </div>
      <div className="border-top mt-4 pt-3">
        <div className="container">
          <div className="d-md-flex justify-content-between align-items-center">
            <p className="text-muted small mb-2 mb-md-0">&copy; {currentYear} Room Rental Service. All rights reserved.</p>
            <nav className="d-flex gap-3" aria-label="Footer Policies">
              <Link to="/privacy" className="text-decoration-none text-muted small">Privacy Policy</Link>
              <Link to="/terms" className="text-decoration-none text-muted small">Terms of Service</Link>
              <Link to="/cookies" className="text-decoration-none text-muted small">Cookie Policy</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;