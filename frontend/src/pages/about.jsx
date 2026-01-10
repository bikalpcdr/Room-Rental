import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import '../style/about.css';

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
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/register");
    };

    const handleContactUs = () => {
        navigate("/contact");
    };

    const handleListProperty = () => {
        navigate("/list-property");
    };

    return (
        <>
            <Header />
            <main className="about-container">
                {/* Hero Section */}
                <section className="about-hero py-5">
                    <div className="container py-5">
                        <div className="row justify-content-center text-center">
                            <div className="col-lg-8">
                                <h1 className="display-4 fw-bold mb-3">About RoomRent</h1>
                                <p className="lead">
                                    Connecting people with perfect living spaces since 2024
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Story */}
                <section className="py-5">
                    <div className="container">
                        <h2 className="text-center mb-5">Our Story</h2>
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-4 mb-lg-0">
                                <p className="lead mb-4">
                                    RoomRent was created as part of our BCA 5th and 6th semester project,
                                    a vision to build something practical, helpful, and real for students
                                    and everyday people looking for rental spaces.
                                </p>
                                <p className="mb-4">
                                    What began as a simple academic idea quickly turned into a working
                                    platform that connects property owners and renters in an easier,
                                    faster, and more transparent way. Through this project, we learned how
                                    technology can simplify real-life problems and bring real impact.
                                </p>
                                <Link to="/how-it-works" className="btn btn-outline-primary">
                                    Learn How It Works
                                </Link>
                            </div>
                            <div className="col-lg-6">
                                <div className="image-placeholder rounded-3 p-5 text-white text-center" style={{background: 'linear-gradient(135deg, #4a90e2 0%, #63b3ed 100%)'}}>
                                    <i className="fas fa-home fa-4x mb-3"></i>
                                    <p className="h5 mb-0">Our Journey</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm p-4">
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{width: '80px', height: '80px'}}>
                                            <i className="fas fa-bullseye fa-2x"></i>
                                        </div>
                                    </div>
                                    <h3 className="text-center mb-3">Our Mission</h3>
                                    <p className="text-muted text-center">
                                        To revolutionize the room rental experience by providing a secure,
                                        transparent, and user-friendly platform that connects renters with
                                        quality living spaces while empowering property owners to manage
                                        their rentals efficiently.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm p-4">
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{width: '80px', height: '80px'}}>
                                            <i className="fas fa-eye fa-2x"></i>
                                        </div>
                                    </div>
                                    <h3 className="text-center mb-3">Our Vision</h3>
                                    <p className="text-muted text-center">
                                        To become the leading platform for room rentals, creating a world
                                        where finding and managing rental spaces is seamless, trustworthy,
                                        and accessible to everyone, regardless of their background or location.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-5">
                    <div className="container">
                        <h2 className="text-center mb-5">Our Values</h2>
                        <div className="row g-4">
                            {[
                                {
                                    icon: 'shield-alt',
                                    title: 'Trust & Security',
                                    description: 'We prioritize the safety and security of our users with rigorous verification processes and secure payment systems.',
                                    link: '/trust-safety',
                                    linkText: 'Learn about our safety measures'
                                },
                                {
                                    icon: 'handshake',
                                    title: 'Transparency',
                                    description: 'Clear communication, honest pricing, and open information sharing are the foundation of every interaction on our platform.',
                                    link: '/pricing',
                                    linkText: 'See our transparent pricing'
                                },
                                {
                                    icon: 'users',
                                    title: 'Community',
                                    description: 'We foster a supportive community where renters and property owners can connect and build lasting relationships.',
                                    link: '/community',
                                    linkText: 'Join our community'
                                },
                                {
                                    icon: 'lightbulb',
                                    title: 'Innovation',
                                    description: 'We continuously improve our platform with cutting-edge technology to provide the best possible user experience.',
                                    link: '/features',
                                    linkText: 'Explore our features'
                                }
                            ].map((item, index) => (
                                <div key={index} className="col-md-6 col-lg-3">
                                    <div className="card h-100 border-0 shadow-sm p-4">
                                        <div className="text-center mb-4">
                                            <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{width: '70px', height: '70px'}}>
                                                <i className={`fas fa-${item.icon} fa-2x`}></i>
                                            </div>
                                        </div>
                                        <h3 className="h5 text-center mb-3">{item.title}</h3>
                                        <p className="text-muted text-center mb-4">{item.description}</p>
                                        <div className="text-center mt-auto">
                                            <Link to={item.link} className="btn btn-link p-0 text-decoration-none">
                                                {item.linkText} →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="py-5 bg-dark text-white">
                    <div className="container">
                        <h2 className="text-center mb-5">Our Impact</h2>
                        <div className="row g-4 text-center">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="col-6 col-md-3 mb-4">
                                    <div className="p-4">
                                        <div className="display-4 fw-bold text-warning mb-2">{stat.number}</div>
                                        <div className="h5 text-white-50">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-4">
                            <p className="lead mb-4">Join thousands of satisfied users today</p>
                            <button className="btn btn-light" onClick={handleGetStarted}>
                                Start Your Journey
                            </button>
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-5">
                    <div className="container">
                        <h2 className="text-center mb-5">Meet Our Team</h2>
                        <div className="row g-4">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="col-md-4">
                                    <div className="card h-100 border-0 shadow-sm p-4 text-center">
                                        <div className="mx-auto mb-4">
                                            <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{width: '120px', height: '120px'}}>
                                                <i className="fas fa-user fa-3x"></i>
                                            </div>
                                        </div>
                                        <h3 className="h4 mb-2">{member.name}</h3>
                                        <p className="text-primary fw-bold mb-3">{member.role}</p>
                                        <p className="text-muted mb-4">{member.bio}</p>
                                        <div className="d-flex justify-content-center gap-3 mt-auto">
                                            <a href="#" className="btn btn-sm btn-outline-primary rounded-circle p-2">
                                                <i className="fab fa-linkedin-in"></i>
                                            </a>
                                            <a href="#" className="btn btn-sm btn-outline-primary rounded-circle p-2">
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                            <a href="#" className="btn btn-sm btn-outline-primary rounded-circle p-2">
                                                <i className="fas fa-envelope"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-5 bg-primary text-white">
                    <div className="container text-center">
                        <h2 className="mb-4">Ready to Join Our Community?</h2>
                        <p className="lead mb-5">
                            Whether you're looking for a place to stay or want to list your property,
                            we're here to help you every step of the way.
                        </p>
                        <div className="d-flex flex-wrap justify-content-center gap-3">
                            <button className="btn btn-light text-primary fw-bold" onClick={handleGetStarted}>
                                <i className="fas fa-rocket me-2"></i>
                                Get Started Today
                            </button>
                            <button className="btn btn-outline-light fw-bold" onClick={handleContactUs}>
                                <i className="fas fa-envelope me-2"></i>
                                Contact Us
                            </button>
                            <button className="btn btn-outline-light fw-bold" onClick={handleListProperty}>
                                <i className="fas fa-plus me-2"></i>
                                List Your Property
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default React.memo(About);