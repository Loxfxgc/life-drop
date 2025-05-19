import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import BloodDrop from '../components/common/BloodDrop';
import BloodTypeBadge from '../components/common/BloodTypeBadge';
import { donorService } from '../api/donorService';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const DonorPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for donor registration form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodType: '',
    lastDonation: '',
    weight: '',
    address: '',
    hasMedicalCondition: false,
    hasTattoo: false,
    hasRecentSurgery: false,
    hasAllergies: false,
    isMedicated: false,
    additionalInfo: '',
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.phone || !formData.gender || !formData.bloodType) {
        throw new Error('Please fill in all required fields');
      }
      
      // Make sure age is valid
      if (!formData.age || isNaN(parseInt(formData.age))) {
        throw new Error('Please enter a valid age');
      }
      
      // Make sure weight is valid
      if (!formData.weight || isNaN(parseInt(formData.weight))) {
        throw new Error('Please enter a valid weight');
      }
      
      // Format the data for Firestore
      const donorData = {
        userId: currentUser?.id || '',
        name: formData.fullName, 
        email: formData.email,
        phone: formData.phone,
        age: parseInt(formData.age),
        gender: formData.gender,
        bloodType: formData.bloodType,
        weight: parseInt(formData.weight),
        address: formData.address,
        medicalHistory: {
          hasDisease: formData.hasMedicalCondition,
          hasTattoo: formData.hasTattoo,
          hasRecentSurgery: formData.hasRecentSurgery,
          hasAllergies: formData.hasAllergies,
          isMedicated: formData.isMedicated,
          additionalInfo: formData.additionalInfo
        },
        lastDonation: formData.lastDonation ? new Date(formData.lastDonation) : undefined
      };
      
      console.log('Submitting donor data:', donorData);
      
      // Save donor data to Firestore
      await donorService.registerDonor(donorData);
      
      // Show success notification
      showNotification({
        type: 'success',
        message: 'Thank you for registering as a donor! Your information has been saved.',
      });
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        bloodType: '',
        lastDonation: '',
        weight: '',
        address: '',
        hasMedicalCondition: false,
        hasTattoo: false,
        hasRecentSurgery: false,
        hasAllergies: false,
        isMedicated: false,
        additionalInfo: '',
      });
      
      // If user is logged in, navigate to dashboard or profile
      if (currentUser) {
        navigate('/profile');
      }
    } catch (error: any) {
      console.error('Error registering donor:', error);
      
      let errorMessage = 'There was an error registering you as a donor. Please try again.';
      
      // Get more specific error message if available
      if (error.message) {
        errorMessage = error.message;
      }
      
      showNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="donor-page">
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="block">Become a</span>
            <span className="text-red-600">LifeDrop Donor Today</span>
          </h1>
          <p className="hero-subtitle">
            Your donation can save up to three lives. Join our community of donors and make a difference.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Eligibility information */}
            <div className="lg:col-span-1">
              <Card title="Eligibility Requirements" className="mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Age between 18-65 years</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Weight at least 50kg (110lbs)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Good general health condition</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>No blood donation in last 3 months</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>No recent major surgery/illness</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                  <p className="font-medium text-yellow-800">Important Note</p>
                  <p className="text-yellow-700">Some medical conditions and medications may disqualify you from donating blood. Our staff will conduct a thorough screening during your appointment.</p>
                </div>
              </Card>

              <Card title="Blood Types We Need">
                <div className="grid grid-cols-2 gap-3">
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                    <div key={type} className="flex flex-col items-center p-3 border rounded-lg hover:border-red-300 transition-colors">
                      <BloodTypeBadge type={type as any} size="lg" className="mb-2" />
                      <span className={`text-sm ${type.includes('O-') || type.includes('AB-') ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                        {type.includes('O-') || type.includes('AB-') ? 'Critically needed' : 'Always welcome'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right side - Registration form */}
            <div className="lg:col-span-2">
              <Card title="Donor Registration">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        placeholder="Your full name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        placeholder="your.email@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        placeholder="(123) 456-7890"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="age" className="form-label">Age</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="18"
                        max="65"
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        placeholder="Your age"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="form-label">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="bloodType" className="form-label">Blood Type</label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="unknown">I don't know</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="weight" className="form-label">Weight</label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="50"
                        max="150"
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        placeholder="Your weight in kg"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        placeholder="Your address"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastDonation" className="form-label">Last Donation Date (if any)</label>
                      <input
                        type="date"
                        id="lastDonation"
                        name="lastDonation"
                        value={formData.lastDonation}
                        onChange={handleChange}
                        className="input-field focus:ring-red-500 focus:border-red-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">Medical Screening</h3>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="hasMedicalCondition"
                          name="hasMedicalCondition"
                          type="checkbox"
                          checked={formData.hasMedicalCondition}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="hasMedicalCondition" className="font-medium text-gray-700">
                          I have no chronic medical conditions that would prevent me from donating blood
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="hasTattoo"
                          name="hasTattoo"
                          type="checkbox"
                          checked={formData.hasTattoo}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="hasTattoo" className="font-medium text-gray-700">
                          I am not currently taking any medications that would prevent me from donating blood
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="hasRecentSurgery"
                          name="hasRecentSurgery"
                          type="checkbox"
                          checked={formData.hasRecentSurgery}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="hasRecentSurgery" className="font-medium text-gray-700">
                          I have not had a recent major surgery or illness
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="hasAllergies"
                          name="hasAllergies"
                          type="checkbox"
                          checked={formData.hasAllergies}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="hasAllergies" className="font-medium text-gray-700">
                          I have no known allergies that would prevent me from donating blood
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="isMedicated"
                          name="isMedicated"
                          type="checkbox"
                          checked={formData.isMedicated}
                          onChange={handleChange}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isMedicated" className="font-medium text-gray-700">
                          I am currently not taking any medications
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="additionalInfo" className="form-label">Additional Information</label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      rows={3}
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      className="input-field focus:ring-red-500 focus:border-red-500"
                      placeholder="Any additional medical information that might be relevant for blood donation"
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      type="submit"
                      className={`btn-primary w-full sm:w-auto ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Register as Donor'}
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      By registering, you agree to our <Link to="/terms" className="text-red-600 hover:text-red-800">Terms of Service</Link> and <Link to="/privacy" className="text-red-600 hover:text-red-800">Privacy Policy</Link>.
                    </p>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Benefits of Donating Blood</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="info-card">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <BloodDrop size="md" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Free Health Screening</h3>
              <p className="text-gray-600 text-center">
                Before donating, you'll receive a mini health check including pulse, blood pressure, and hemoglobin levels.
              </p>
            </div>

            <div className="info-card">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Save Lives</h3>
              <p className="text-gray-600 text-center">
                A single donation can save up to three lives, helping accident victims, surgery patients, and those with medical conditions.
              </p>
            </div>

            <div className="info-card">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Health Benefits</h3>
              <p className="text-gray-600 text-center">
                Reduces risk of heart disease, stimulates blood cell production, and helps maintain iron levels in your body.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 bg-red-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Schedule Your Donation?</h2>
            <p className="text-xl text-red-100 mb-6">
              Book an appointment at one of our donation centers and join the community of lifesavers.
            </p>
            <Link 
              to="/appointment" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 transition duration-300"
            >
              Schedule Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonorPage; 