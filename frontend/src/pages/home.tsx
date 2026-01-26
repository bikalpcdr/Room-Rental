import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, getUserData } from "../utils/auth.js";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

const Home: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'register'>('login');

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setDefaultTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const userData = getUserData();
  const dashboardLink = userData?.role === 'ADMIN' ? '/admin-dashboard' : 
                      userData?.role === 'OWNER' ? '/owner-dashboard' : 
                      userData?.role === 'RENTER' ? '/renter-dashboard' : '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Find Your Perfect Room</h1>
            <p className="text-xl mb-8">Discover verified rooms, compare prices, and book instantly</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated() ? (
                <Link 
                  to={dashboardLink}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => openAuthModal('register')}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose RoomRental?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Room?</h2>
          <p className="text-xl mb-8">Join thousands of happy renters today</p>
          <Link 
            to="/property-search"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Browse Properties
          </Link>
        </div>
      </section>

      {/* Auth Modal Placeholder */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">
              {defaultTab === 'login' ? 'Sign In' : 'Sign Up'}
            </h3>
            <p className="text-gray-600 mb-6">
              Authentication modal will be implemented here. For now, please use the links below:
            </p>
            <div className="flex gap-4">
              <Link 
                to={defaultTab === 'login' ? '/login' : '/register'}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700 transition"
              >
                {defaultTab === 'login' ? 'Go to Login' : 'Go to Register'}
              </Link>
              <button 
                onClick={closeAuthModal}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
