import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Header */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl">Please read these terms carefully before using our service</p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using RoomRental, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-gray-600">
                Permission is granted to temporarily download one copy of the materials on RoomRental for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Property Listings</h2>
              <p className="text-gray-600">
                Property owners are responsible for the accuracy of their listings. RoomRental is not responsible for verifying the authenticity of property descriptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Bookings and Payments</h2>
              <p className="text-gray-600">
                All bookings are subject to availability and confirmation. Payment processing is handled through secure third-party payment gateways.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cancellation Policy</h2>
              <p className="text-gray-600">
                Cancellation policies vary by property and are clearly stated on each property listing. Please review these policies before making a booking.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-600">
                You may not use our service for any illegal or unauthorized purpose. This includes posting fraudulent listings, harassing other users, or attempting to gain unauthorized access to our systems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Privacy</h2>
              <p className="text-gray-600">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600">
                In no event shall RoomRental, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
              <p className="text-gray-600">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at support@roomrental.com
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link 
              to="/"
              className="text-blue-600 hover:text-blue-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Terms;
