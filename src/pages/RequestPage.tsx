import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import BloodAvailability from '../components/blood/BloodAvailability';
import { inventoryService, BloodInventory, BloodRequest } from '../api/inventoryService';

const RequestPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  
  // State for blood inventory data
  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBloodType, setSelectedBloodType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Omit<BloodRequest, 'id' | 'status' | 'requestDate' | 'updatedAt'>>({
    patientName: '',
    patientAge: 0,
    bloodType: '',
    unitsNeeded: 1,
    hospitalName: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    urgency: 'normal',
    reason: '',
    userId: currentUser?.id
  });
  
  // Fetch blood inventory data on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await inventoryService.getBloodAvailability();
        setInventory(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blood inventory:', err);
        setError('Failed to load blood availability data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventory();
  }, []);
  
  // Handle blood type selection
  const handleSelectBloodType = (bloodType: string) => {
    setSelectedBloodType(bloodType);
    setFormData(prev => ({ ...prev, bloodType }));
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bloodType) {
      showNotification({
        type: 'error',
        message: 'Please select a blood type before submitting your request.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit blood request - add status property to match expected type
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const requestId = await inventoryService.createRequest({
        ...formData,
        status: 'pending'
      });
      
      showNotification({
        type: 'success',
        message: 'Blood request submitted successfully!'
      });
      
      // Reset form
      setFormData({
        patientName: '',
        patientAge: 0,
        bloodType: '',
        unitsNeeded: 1,
        hospitalName: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        urgency: 'normal',
        reason: '',
        userId: currentUser?.id
      });
      
      setSelectedBloodType('');
      
      // Refresh inventory data
      const updatedInventory = await inventoryService.getBloodAvailability();
      setInventory(updatedInventory);
      
    } catch (err) {
      console.error('Error submitting blood request:', err);
      showNotification({
        type: 'error',
        message: 'Failed to submit blood request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getCompatibilityInfo = (bloodType: string) => {
    if (!bloodType) return null;
    
    const compatibilityChart = inventoryService.getCompatibilityChart();
    const compatibleTypes = compatibilityChart[bloodType as keyof typeof compatibilityChart];
    
    return (
      <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-sm">
        <p className="font-medium text-blue-800">Compatibility Information</p>
        <p className="text-blue-700">
          Blood type {bloodType} can receive from: {compatibleTypes.join(', ')}
        </p>
      </div>
    );
  };
  
  return (
    <div className="request-page">
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="block">Request</span>
            <span className="text-blue-600">Blood Donation</span>
          </h1>
          <p className="hero-subtitle">
            Request blood for patients in need. Check availability and submit your request below.
          </p>
        </div>
      </section>
      
      {/* Main content */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Blood availability */}
            <div className="lg:col-span-1">
              <Card title="Current Blood Availability">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-pulse rounded-md bg-gray-200 h-32 w-full"></div>
                    <p className="mt-4 text-gray-500">Loading availability data...</p>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-500">
                    {error}
                  </div>
                ) : (
                  <>
                    <p className="mb-4 text-sm text-gray-600">
                      Select a blood type to request. Available units are based on registered donors.
                    </p>
                    <BloodAvailability 
                      inventory={inventory} 
                      onSelectBloodType={handleSelectBloodType}
                      selectedBloodType={selectedBloodType}
                    />
                    {selectedBloodType && getCompatibilityInfo(selectedBloodType)}
                  </>
                )}
              </Card>
              
              <Card title="Important Information" className="mt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Requests are processed based on urgency and availability.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>You'll be notified when your request is approved.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>For emergencies, please contact the hospital directly.</span>
                  </li>
                </ul>
              </Card>
            </div>
            
            {/* Right side - Request form */}
            <div className="lg:col-span-2">
              <Card title="Blood Request Form">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Patient Information */}
                  <div>
                    <h3 className="text-lg font-medium border-b pb-2 mb-4">Patient Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="patientName" className="form-label">Patient Name</label>
                        <input
                          type="text"
                          id="patientName"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="patientAge" className="form-label">Patient Age</label>
                        <input
                          type="number"
                          id="patientAge"
                          name="patientAge"
                          value={formData.patientAge || ''}
                          onChange={handleInputChange}
                          className="input-field"
                          min="0"
                          max="120"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Blood Request Details */}
                  <div>
                    <h3 className="text-lg font-medium border-b pb-2 mb-4">Blood Request Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="bloodType" className="form-label">Blood Type</label>
                        <select
                          id="bloodType"
                          name="bloodType"
                          value={formData.bloodType}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                          disabled={isSubmitting || selectedBloodType !== ''}
                        >
                          <option value="">Select Blood Type</option>
                          {inventory.map(item => (
                            <option key={item.bloodType} value={item.bloodType}>
                              {item.bloodType} ({item.available} units available)
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedBloodType ? 'Blood type selected from availability table.' : 'Or select from the table on the left.'}
                        </p>
                      </div>
                      <div>
                        <label htmlFor="unitsNeeded" className="form-label">Units Needed</label>
                        <input
                          type="number"
                          id="unitsNeeded"
                          name="unitsNeeded"
                          value={formData.unitsNeeded}
                          onChange={handleInputChange}
                          className="input-field"
                          min="1"
                          max="10"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="hospitalName" className="form-label">Hospital Name</label>
                        <input
                          type="text"
                          id="hospitalName"
                          name="hospitalName"
                          value={formData.hospitalName}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="urgency" className="form-label">Urgency Level</label>
                        <select
                          id="urgency"
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                          disabled={isSubmitting}
                        >
                          <option value="normal">Normal</option>
                          <option value="urgent">Urgent</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="reason" className="form-label">Reason for Request</label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={3}
                        className="input-field"
                        required
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium border-b pb-2 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="contactName" className="form-label">Contact Person</label>
                        <input
                          type="text"
                          id="contactName"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="contactPhone" className="form-label">Contact Phone</label>
                        <input
                          type="tel"
                          id="contactPhone"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="contactEmail" className="form-label">Contact Email</label>
                        <input
                          type="email"
                          id="contactEmail"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <button
                      type="submit"
                      className={`px-6 py-3 bg-blue-600 text-white rounded-md shadow-md transition duration-300 hover:bg-blue-700 hover:shadow-lg w-full sm:w-auto
                        ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Blood Request'}
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      By submitting this request, you confirm that all information provided is accurate.
                    </p>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestPage; 