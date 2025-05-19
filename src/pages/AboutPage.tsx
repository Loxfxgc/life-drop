import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero section */}
      <section className="hero-section bg-gradient-to-r from-red-500 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About LifeDrop</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Connecting donors with recipients to save lives through safe, accessible blood donation.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-2">
              <Card title="Our Mission">
                <div className="prose max-w-none">
                  <p className="lead text-lg text-gray-700">
                    LifeDrop was founded with a simple yet powerful mission: to ensure that every patient in need has access to safe, compatible blood when they need it most.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-red-700">What We Do</h3>
                  <p>
                    We connect voluntary blood donors with patients and hospitals in need, creating a reliable and efficient blood supply network. Our digital platform simplifies the donation process and ensures rapid fulfillment of blood requests.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-red-700">Our Values</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Accessibility</strong> - Making blood donation and requests simple for everyone</li>
                    <li><strong>Safety</strong> - Maintaining the highest standards in blood collection and storage</li>
                    <li><strong>Transparency</strong> - Open information about our processes and inventory</li>
                    <li><strong>Community</strong> - Building a network of donors committed to saving lives</li>
                    <li><strong>Innovation</strong> - Using technology to improve blood donation services</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-red-700">Our Story</h3>
                  <p>
                    LifeDrop began in 2023 when a group of healthcare professionals and technology experts recognized the need for a more efficient blood donation system. After witnessing delays in blood availability during emergencies, they set out to create a platform that would streamline the process from donation to distribution.
                  </p>
                  <p>
                    Today, LifeDrop operates in multiple regions, with thousands of registered donors and partnerships with major hospitals and healthcare facilities.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-red-700">Looking Forward</h3>
                  <p>
                    Our vision is to expand LifeDrop's services nationwide, creating a comprehensive network that ensures no patient goes without needed blood products. We're constantly innovating our platform and exploring new ways to make blood donation more accessible and efficient.
                  </p>
                </div>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card title="Impact Statistics">
                <div className="space-y-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-4xl font-bold text-red-700 mb-1">10,000+</div>
                    <div className="text-gray-700">Registered Donors</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-4xl font-bold text-blue-700 mb-1">25,000+</div>
                    <div className="text-gray-700">Units Collected</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-4xl font-bold text-green-700 mb-1">15,000+</div>
                    <div className="text-gray-700">Lives Impacted</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-100 rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-2">Did You Know?</h4>
                  <ul className="text-sm space-y-2">
                    <li>• One donation can save up to three lives</li>
                    <li>• Someone needs blood every two seconds</li>
                    <li>• Only 37% of the population is eligible to donate blood</li>
                    <li>• Red blood cells must be used within 42 days</li>
                    <li>• Platelets must be used within just 5 days</li>
                  </ul>
                </div>
              </Card>
              
              <Card title="Get Involved" className="mt-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Ready to make a difference? Join our community of donors and volunteers.
                  </p>
                  
                  <div className="space-y-2">
                    <Link to="/donor" className="btn-primary block text-center py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700 transition">
                      Register as Donor
                    </Link>
                    <Link to="/contact" className="btn-secondary block text-center py-2 px-4 rounded bg-white border border-red-600 text-red-600 hover:bg-red-50 transition">
                      Volunteer With Us
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Leadership Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team member 1 */}
            <div className="team-member">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-xl font-semibold">Dr. Sarah Chen</h3>
              <p className="text-red-600">Founder & CEO</p>
              <p className="text-sm text-gray-600 mt-2">
                Hematologist with 15+ years of experience in blood banking
              </p>
            </div>
            
            {/* Team member 2 */}
            <div className="team-member">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-xl font-semibold">Michael Rodriguez</h3>
              <p className="text-red-600">CTO</p>
              <p className="text-sm text-gray-600 mt-2">
                Former tech lead at healthcare startups
              </p>
            </div>
            
            {/* Team member 3 */}
            <div className="team-member">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-xl font-semibold">Dr. James Wilson</h3>
              <p className="text-red-600">Medical Director</p>
              <p className="text-sm text-gray-600 mt-2">
                Transfusion medicine specialist
              </p>
            </div>
            
            {/* Team member 4 */}
            <div className="team-member">
              <div className="w-32 h-32 mx-auto rounded-full bg-gray-300 mb-4"></div>
              <h3 className="text-xl font-semibold">Priya Patel</h3>
              <p className="text-red-600">Community Outreach</p>
              <p className="text-sm text-gray-600 mt-2">
                Advocate for healthcare accessibility
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 