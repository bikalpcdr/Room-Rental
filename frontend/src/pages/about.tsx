import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">About RoomRental</h1>
          <p className="text-xl">Your trusted platform for finding the perfect room</p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              RoomRental was founded with a simple mission: to make finding the perfect room easier, 
              safer, and more affordable for everyone. We understand the challenges of finding suitable 
              accommodation, whether you're a student, young professional, or someone looking to relocate.
            </p>
            <p className="text-gray-600 mb-4">
              Our platform connects renters with verified property owners, ensuring a transparent and 
              secure rental experience for all parties involved.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To revolutionize the room rental experience by providing a secure, user-friendly platform 
                that connects quality renters with verified property owners.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the most trusted room rental platform globally, known for our commitment to 
                safety, transparency, and customer satisfaction.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xl font-semibold mb-2">Trust & Safety</h4>
                <p className="text-gray-600">We verify all properties and conduct background checks on landlords.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Transparency</h4>
                <p className="text-gray-600">No hidden fees, clear pricing, and honest property descriptions.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Customer First</h4>
                <p className="text-gray-600">24/7 support and a commitment to resolving issues quickly.</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Innovation</h4>
                <p className="text-gray-600">Continuously improving our platform with new features and technology.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
              >
                Get in Touch
              </Link>
              <Link 
                to="/"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
