import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import { hospitalService, HospitalProfile } from '../api/hospitalService';
import { donorService, DonorData } from '../api/donorService';

const RecordDonationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [donors, setDonors] = useState<DonorData[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    donorId: '',
    donorUserId: '',
    bloodType: '',
    quantity: 1,
    donationDate: new Date().toISOString().split('T')[0],
    status: 'collected',
    notes: ''
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DonorData[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<DonorData | null>(null);
  
  // Load necessary data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (user.role !== 'hospital') {
        showNotification({
          type: 'error',
          message: 'You do not have permission to access this page'
        });
        navigate('/');
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get hospital profile
        const hospitalData = await hospitalService.getHospitalByUserId(user.id);
        
        if (!hospitalData) {
          showNotification({
            type: 'error',
            message: 'Hospital profile not found'
          });
          navigate('/hospital/dashboard');
          return;
        }
        
        if (!hospitalData.isVerified) {
          showNotification({
            type: 'warning',
            message: 'Your hospital account is not verified yet'
          });
          navigate('/hospital/dashboard');
          return;
        }
        
        setHospital(hospitalData);
        
        // Get all donors
        const allDonors = await donorService.getAllDonors();
        setDonors(allDonors);
      } catch (error) {
        console.error('Error loading data:', error);
        showNotification({
          type: 'error',
          message: 'Failed to load necessary data'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [user, navigate, showNotification]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle donor search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Search donors by name, email, phone or blood type
    const results = donors.filter(donor => 
      donor.name.toLowerCase().includes(query) ||
      donor.email.toLowerCase().includes(query) ||
      donor.phone.includes(query) ||
      donor.bloodType.toLowerCase().includes(query)
    );
    
    setSearchResults(results.slice(0, 5)); // Limit to 5 results for dropdown
  };
  
  // Handle donor selection
  const selectDonor = (donor: DonorData) => {
    setSelectedDonor(donor);
    setSearchQuery(`${donor.name} (${donor.bloodType})`);
    setSearchResults([]);
    
    // Update form data
    setFormData({
      ...formData,
      donorId: donor.id || '',
      donorUserId: donor.userId,
      bloodType: donor.bloodType
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDonor) {
      showNotification({
        type: 'error',
        message: 'Please select a donor'
      });
      return;
    }
    
    if (!hospital || !hospital.id) {
      showNotification({
        type: 'error',
        message: 'Hospital information is missing'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Record the donation
      const donationId = await hospitalService.recordDonation({
        hospitalId: hospital.id,
        donorId: formData.donorId,
        userId: formData.donorUserId,
        donationDate: new Date(formData.donationDate),
        bloodType: formData.bloodType,
        quantity: Number(formData.quantity),
        status: 'collected',
        notes: formData.notes
      });
      
      showNotification({
        type: 'success',
        message: 'Donation recorded successfully!'
      });
      
      // Navigate to view the donation details
      navigate(`/hospital/donations/${donationId}`);
    } catch (error) {
      console.error('Error recording donation:', error);
      showNotification({
        type: 'error',
        message: 'Failed to record donation'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="record-donation-page">
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold">Record Blood Donation</h1>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <p>Loading...</p>
          </div>
        </section>
      </div>
    );
  }
  
  return (
    <div className="record-donation-page">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Record Blood Donation</h1>
          <p className="mt-2 text-blue-100">
            Record a new blood donation from a donor
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card title="Donation Information">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Donor Selection */}
              <div>
                <label htmlFor="donorSearch" className="block text-sm font-medium text-gray-700">
                  Search Donor *
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    id="donorSearch"
                    name="donorSearch"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by name, email, phone or blood type"
                    required
                    disabled={isSubmitting}
                  />
                  
                  {/* Search results dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto">
                      {searchResults.map((donor) => (
                        <div
                          key={donor.id}
                          onClick={() => selectDonor(donor)}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <span className="font-medium block truncate">{donor.name}</span>
                            <span className="ml-2 text-gray-500 block truncate">{donor.bloodType}</span>
                          </div>
                          <div className="text-sm text-gray-500 pl-1">
                            {donor.email} • {donor.phone}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Search for the donor by name, email, phone number, or blood type
                </p>
              </div>
              
              {/* Selected Donor Information */}
              {selectedDonor && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h3 className="text-md font-medium text-blue-800">Selected Donor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-600">Name:</p>
                      <p className="font-medium">{selectedDonor.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Blood Type:</p>
                      <p className="font-medium">{selectedDonor.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact:</p>
                      <p className="font-medium">{selectedDonor.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Donation:</p>
                      <p className="font-medium">
                        {selectedDonor.lastDonation 
                          ? formatDate(selectedDonor.lastDonation.toString()) 
                          : 'No previous donation'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Donation date */}
                <div>
                  <label htmlFor="donationDate" className="block text-sm font-medium text-gray-700">
                    Donation Date *
                  </label>
                  <input
                    type="date"
                    id="donationDate"
                    name="donationDate"
                    value={formData.donationDate}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                    disabled={isSubmitting}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                    min="1"
                    max="10"
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Standard unit is approximately 450-500ml
                  </p>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add any additional information about this donation"
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              {/* Submit buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/hospital/dashboard')}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting || !selectedDonor}
                >
                  {isSubmitting ? 'Saving...' : 'Record Donation'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default RecordDonationPage; 