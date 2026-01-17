import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import '../style/about.css';
import { FaHome, FaBullseye, FaEye, FaShieldAlt, FaHandshake, FaUsers, FaLightbulb } from 'react-icons/fa';

const teamMembers = [
    {
        id: 1,
        name: 'Bikalpa Chaudhary',
        role: 'CEO & Founder',
        bio: 'Passionate about revolutionizing the rental industry with innovative technology solutions.',
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
        id: 2,
        name: 'Arbin Lama',
        role: 'CTO',
        bio: 'Leading our technical development with expertise in scalable platforms and user experience.',
        image: 'https://randomuser.me/api/portraits/men/44.jpg'
    },
    {
        id: 3,
        name: 'Rajib Bikram Shah',
        role: 'Head of Operations',
        bio: 'Ensuring smooth operations and exceptional customer service across all touchpoints.',
        image: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
];

const stats = [
    { id: 1, number: '10,000+', label: 'Happy Renters' },
    { id: 2, number: '5,000+', label: 'Property Owners' },
    { id: 3, number: '15,000+', label: 'Rooms Listed' },
    { id: 4, number: '98%', label: 'Satisfaction Rate' }
];

const values = [
    {
        id: 1,
        icon: <FaShieldAlt className="feature-icon" />,
        title: 'Trust & Security',
        description: 'We prioritize the safety and security of our users with rigorous verification processes.',
        link: '/trust-safety',
        linkText: 'Learn about safety'
    },
    {
        id: 2,
        icon: <FaHandshake className="feature-icon" />,
        title: 'Transparency',
        description: 'Clear communication, honest pricing, and open information sharing in every interaction.',
        link: '/pricing',
        linkText: 'See pricing'
    },
    {
        id: 3,
        icon: <FaUsers className="feature-icon" />,
        title: 'Community',
        description: 'Fostering a supportive community where renters and property owners connect meaningfully.',
        link: '/community',
        linkText: 'Join community'
    },
    {
        id: 4,
        icon: <FaLightbulb className="feature-icon" />,
        title: 'Innovation',
        description: 'Continuously improving with cutting-edge technology for the best user experience.',
        link: '/features',
        linkText: 'Explore features'
    }
];

function About() {
    const navigate = useNavigate();

    useEffect(() => {
        // Add animation class to elements when component mounts
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        animateElements.forEach(el => observer.observe(el));
        
        return () => {
            animateElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    const handleGetStarted = () => navigate('/register');
    const handleContactUs = () => navigate('/contact');
    const handleListProperty = () => navigate('/list-property');

    return (
        <>
            <Header />
            <main className="about-container">
                {/* Hero Section */}
                <section className="about-section">
                    <div className="container">
                        <div className="row justify-content-center text-center py-5">
                            <div className="col-lg-8">
                                <h1 className="display-3 fw-bold mb-4 animate animate-delay-1">About RoomRent</h1>
                                <p className="lead mb-5 text-white-75 animate animate-delay-2">
                                    Connecting people with perfect living spaces since 2024
                                </p>
                                <div className="d-flex flex-wrap gap-3 justify-content-center animate animate-delay-3">
                                    <button 
                                        onClick={handleGetStarted} 
                                        className="btn btn-light btn-lg px-4 fw-bold pulse"
                                        style={{
                                            background: 'white',
                                            color: 'var(--primary-color)',
                                            border: 'none',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        Get Started
                                    </button>
                                    <button 
                                        onClick={handleContactUs} 
                                        className="btn btn-outline-light btn-lg px-4 fw-bold"
                                        style={{
                                            border: '2px solid white',
                                            backdropFilter: 'blur(5px)',
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Story */}
                <section className="section">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <div className="pe-lg-5">
                                    <h2 className="section-title animate animate-slide-left">Our Story</h2>
                                    <p className="lead mb-4 text-muted animate animate-slide-left animate-delay-1">
                                        RoomRent was created as part of our BCA 5th and 6th semester project,
                                        a vision to build something practical, helpful, and real for students
                                        and everyday people looking for rental spaces.
                                    </p>
                                    <p className="mb-4 text-muted animate animate-slide-left animate-delay-2">
                                        What began as a simple academic idea quickly turned into a working
                                        platform that connects property owners and renters in an easier,
                                        faster, and more transparent way.
                                    </p>
                                    <div className="animate animate-slide-left animate-delay-3">
                                        <Link 
                                            to="/how-it-works" 
                                            className="btn btn-primary px-4 fw-bold"
                                            style={{
                                                background: 'var(--gradient-primary)',
                                                border: 'none',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: '50px',
                                                boxShadow: '0 4px 15px rgba(67, 97, 238, 0.3)'
                                            }}
                                        >
                                            Learn How It Works
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="feature-card p-4 p-lg-5 text-center h-100 animate animate-scale">
                                    <div className="feature-icon mx-auto">
                                        <FaHome className="fs-3" />
                                    </div>
                                    <h3 className="h4 mt-4 mb-3">Our Journey</h3>
                                    <p className="text-muted mb-0">
                                        From classroom project to trusted platform, we're committed to making
                                        room rentals simple, secure, and stress-free for everyone involved.
                                    </p>
                                    <div className="position-absolute bottom-0 start-0 end-0 p-4">
                                        <div className="progress" style={{ height: '4px' }}>
                                            <div 
                                                className="progress-bar" 
                                                role="progressbar" 
                                                style={{
                                                    width: '0%',
                                                    background: 'var(--gradient-primary)',
                                                    transition: 'width 1.5s ease-in-out'
                                                }}
                                                onMouseEnter={(e) => e.target.style.width = '100%'}
                                                onMouseLeave={(e) => e.target.style.width = '0%'}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="section bg-light">
                    <div className="container">
                        <h2 className="section-title text-center mb-5">Our Core</h2>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="feature-card p-4 p-lg-5 h-100 animate animate-slide-left">
                                    <div className="feature-icon mx-auto">
                                        <FaBullseye className="fs-3" />
                                    </div>
                                    <h3 className="h4 text-center mt-4 mb-3">Our Mission</h3>
                                    <p className="text-muted text-center mb-0">
                                        To revolutionize the room rental experience by providing a secure,
                                        transparent, and user-friendly platform that connects renters with
                                        quality living spaces while empowering property owners.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="feature-card p-4 p-lg-5 h-100 animate animate-slide-right">
                                    <div className="feature-icon mx-auto">
                                        <FaEye className="fs-3" />
                                    </div>
                                    <h3 className="h4 text-center mt-4 mb-3">Our Vision</h3>
                                    <p className="text-muted text-center mb-0">
                                        To become the leading platform for room rentals, creating a world
                                        where finding and managing rental spaces is seamless, trustworthy,
                                        and accessible to everyone, regardless of their background.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="section">
                    <div className="container">
                        <h2 className="section-title text-center mb-5">Our Values</h2>
                        <div className="row g-4">
                            {values.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className="col-md-6 col-lg-3"
                                >
                                    <div 
                                        className="feature-card p-4 h-100 animate"
                                        style={{ 
                                            animationDelay: `${index * 0.1}s`,
                                            transition: 'all 0.4s ease',
                                            border: '1px solid rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <div className="text-center mb-4">
                                            {React.cloneElement(item.icon, { 
                                                className: 'feature-icon-item' 
                                            })}
                                        </div>
                                        <h3 className="h5 text-center mb-3 fw-bold">{item.title}</h3>
                                        <p className="text-muted text-center mb-4">{item.description}</p>
                                        <div className="text-center mt-auto">
                                            <Link 
                                                to={item.link} 
                                                className="btn btn-link p-0 text-primary text-decoration-none fw-bold d-inline-flex align-items-center"
                                                style={{
                                                    transition: 'all 0.3s ease',
                                                    color: 'var(--primary-color)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.paddingRight = '5px';
                                                    e.target.querySelector('svg').style.transform = 'translateX(5px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.paddingRight = '0';
                                                    e.target.querySelector('svg').style.transform = 'translateX(0)';
                                                }}
                                            >
                                                {item.linkText}
                                                <svg 
                                                    width="20" 
                                                    height="20" 
                                                    viewBox="0 0 24 24" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    strokeWidth="2" 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round"
                                                    style={{
                                                        marginLeft: '4px',
                                                        transition: 'transform 0.3s ease'
                                                    }}
                                                >
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="stats-section">
                    <div className="container">
                        <h2 className="section-title text-center text-white mb-5">Our Impact</h2>
                        <div className="row g-4">
                            {stats.map((stat, idx) => (
                                <div 
                                    key={stat.id} 
                                    className="col-6 col-md-3 text-center"
                                >
                                    <div 
                                        className="p-3 animate" 
                                        style={{
                                            animationDelay: `${idx * 0.1}s`,
                                            transform: 'translateY(0)'
                                        }}
                                    >
                                        <span 
                                            className="stat-number d-inline-block"
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.1)';
                                                e.target.style.color = 'var(--accent-color)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.color = 'white';
                                            }}
                                        >
                                            {stat.number}
                                        </span>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="section">
                    <div className="container">
                        <h2 className="section-title text-center mb-5">Meet Our Team</h2>
                        <div className="row g-4 justify-content-center">
                            {teamMembers.map((member, index) => (
                                <div 
                                    key={member.id} 
                                    className="col-md-4"
                                >
                                    <div 
                                        className="team-card text-center p-4 animate"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="position-relative">
                                            <div className="team-img-wrapper">
                                                <img 
                                                    src={member.image} 
                                                    alt={member.name}
                                                    className="team-img img-fluid"
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'scale(1.1) rotate(5deg)';
                                                        e.target.style.borderColor = 'var(--accent-color)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'scale(1)';
                                                        e.target.style.borderColor = 'white';
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <h3 className="h5 mb-2 mt-3 fw-bold">{member.name}</h3>
                                        <p 
                                            className="mb-3"
                                            style={{
                                                background: 'var(--gradient-primary)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                fontWeight: '600',
                                                display: 'inline-block'
                                            }}
                                        >
                                            {member.role}
                                        </p>
                                        <p className="text-muted mb-4">{member.bio}</p>
                                        <div className="d-flex justify-content-center gap-2">
                                            {[/* eslint-disable-next-line */
                                                { icon: 'linkedin-in', url: '#' },
                                                { icon: 'twitter', url: '#' },
                                                { icon: 'envelope', url: '#' }
                                            ].map((social, i) => (
                                                <a 
                                                    key={i}
                                                    href={social.url} 
                                                    className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        border: '2px solid',
                                                        borderColor: 'var(--primary-color)',
                                                        color: 'var(--primary-color)',
                                                        transition: 'all 0.3s ease',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = 'var(--gradient-primary)';
                                                        e.target.style.borderColor = 'transparent';
                                                        e.target.style.color = 'white';
                                                        e.target.style.transform = 'translateY(-3px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = 'transparent';
                                                        e.target.style.borderColor = 'var(--primary-color)';
                                                        e.target.style.color = 'var(--primary-color)';
                                                        e.target.style.transform = 'translateY(0)';
                                                    }}
                                                >
                                                    <i className={`fa${social.icon === 'envelope' ? 's' : 'b'} fa-${social.icon}`}></i>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="cta-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 text-center">
                                <h2 className="text-white mb-4 fw-bold display-5">Ready to find your perfect room?</h2>
                                <p className="lead text-white-75 mb-5">Join thousands of happy renters and property owners today.</p>
                                <div className="d-flex flex-wrap justify-content-center gap-4">
                                    <button 
                                        onClick={handleGetStarted} 
                                        className="btn btn-light btn-lg px-5 fw-bold pulse"
                                        style={{
                                            background: 'white',
                                            color: 'var(--accent-color)',
                                            border: 'none',
                                            padding: '0.75rem 2rem',
                                            borderRadius: '50px',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            zIndex: '1'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-3px)';
                                            e.target.style.boxShadow = '0 12px 25px rgba(0,0,0,0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                                        }}
                                    >
                                        Get Started
                                    </button>
                                    <button 
                                        onClick={handleListProperty} 
                                        className="btn btn-outline-light btn-lg px-5 fw-bold"
                                        style={{
                                            border: '2px solid white',
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(5px)',
                                            padding: '0.75rem 2rem',
                                            borderRadius: '50px',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            zIndex: '1'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(255,255,255,0.2)';
                                            e.target.style.transform = 'translateY(-3px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255,255,255,0.1)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        List Your Property
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

export default React.memo(About);
