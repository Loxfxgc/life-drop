import React from 'react';
import { Link } from 'react-router-dom';
import BloodStockOverview from '../components/dashboard/BloodStockOverview';
import BloodDrop from '../components/common/BloodDrop';
import { ROUTES } from '../constants/routes';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="block">Save Lives with</span>
            <span className="text-red-600">LifeDrop</span>
          </h1>
          <p className="hero-subtitle">
            Connect with blood recipients, track your donations, and help save lives 
            in your community through our integrated blood donation platform.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link 
              to={ROUTES.DONOR} 
              className="action-button"
            >
              Become a Donor
            </Link>
            <Link 
              to={ROUTES.REQUEST} 
              className="inline-flex items-center justify-center px-6 py-3 border border-red-600 text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
            >
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Our platform connects blood donors with recipients in need, making the donation 
            process simple, transparent, and life-saving.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="icon-feature">
              <div className="icon-feature-img">
                <BloodDrop size="lg" color="red-600" animate />
              </div>
              <h3 className="icon-feature-title">Register as Donor</h3>
              <p className="icon-feature-description">
                Create an account and provide your blood type and health information to join our donor network.
              </p>
            </div>
            
            <div className="icon-feature">
              <div className="icon-feature-img">
                <svg className="h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="icon-feature-title">Schedule Donation</h3>
              <p className="icon-feature-description">
                Book your appointment at a convenient time and location from our network of blood banks.
              </p>
            </div>
            
            <div className="icon-feature">
              <div className="icon-feature-img">
                <svg className="h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="icon-feature-title">Save Lives</h3>
              <p className="icon-feature-description">
                Your donation can save up to three lives and contribute to better healthcare in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Inventory Overview */}
      <section className="section">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Current Blood Inventory</h2>
          <p className="section-subtitle">
            Monitor our current blood supply levels and see where your donation is most needed.
          </p>
          
          <div className="mt-8">
            <BloodStockOverview />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Join thousands of donors who have already helped save lives in their community.
            Every donation counts!
          </p>
          <Link 
            to={ROUTES.AUTH} 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200 transition-all duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 