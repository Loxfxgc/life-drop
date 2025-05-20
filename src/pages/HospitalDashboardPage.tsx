import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import { hospitalService, HospitalProfile, HospitalBloodInventory, DonationRecord } from '../api/hospitalService';
import { ROUTES } from '../constants/routes';

const HospitalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);

  // State for hospital data
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [inventory, setInventory] = useState<HospitalBloodInventory[]>([]);
  const [recentDonations, setRecentDonations] = useState<DonationRecord[]>([]);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'donations' | 'events'>('overview');

  // Load hospital data on component mount
  useEffect(() => {
    const fetchHospitalData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (user.role !== 'hospital') {
        showNotification({
          type: 'error',
          message: 'You do not have permission to access the hospital dashboard'
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
          navigate('/');
          return;
        }
        
        setHospital(hospitalData);
        
        // Get hospital inventory
        const inventoryData = await hospitalService.getHospitalInventory(hospitalData.id!);
        setInventory(inventoryData);
        
        // Get recent donations
        const donationsData = await hospitalService.getDonationsByHospital(hospitalData.id!);
        setRecentDonations(donationsData.slice(0, 10)); // Show only 10 most recent
      } catch (error) {
        console.error('Error fetching hospital data:', error);
        showNotification({
          type: 'error',
          message: 'Failed to load hospital data'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHospitalData();
  }, [user, navigate, showNotification]);
  
  // Check if hospital is verified
  const isVerified = hospital?.isVerified || false;
  
  // Calculate total available blood units
  const totalBloodUnits = inventory.reduce((sum, item) => sum + item.availableUnits, 0);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handler for creating a donation event
  const handleCreateEvent = () => {
    navigate('/hospital/events/create');
  };
  
  // Handler for updating inventory
  const handleUpdateInventory = () => {
    navigate(ROUTES.HOSPITAL_INVENTORY_MANAGE);
  };
  
  // Handler for recording a donation
  const handleRecordDonation = () => {
    navigate('/hospital/donations/record');
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="hospital-dashboard">
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hospital Dashboard</h1>
            <p className="text-xl">Loading hospital data...</p>
          </div>
        </section>
      </div>
    );
  }
  
  return (
    <div className="hospital-dashboard">
      {/* Header section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold">{hospital?.name}</h1>
              <p className="text-blue-100 mt-1">{hospital?.address}, {hospital?.city}, {hospital?.state}</p>
              {!isVerified && (
                <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium inline-block mt-2">
                  Pending Verification
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Verification banner (if not verified) */}
      {!isVerified && (
        <div className="bg-yellow-50 border-t border-b border-yellow-100 px-4 py-3">
          <div className="container mx-auto flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your hospital account is pending verification. Some features may be limited until verification is complete.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button 
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'inventory' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('inventory')}
            >
              Blood Inventory
            </button>
            <button 
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'donations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('donations')}
            >
              Donation Records
            </button>
            <button 
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'events' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('events')}
            >
              Donation Events
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Available Blood Units</h3>
                      <p className="text-3xl font-bold text-gray-900">{totalBloodUnits}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-500">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Donations</h3>
                      <p className="text-3xl font-bold text-gray-900">{recentDonations.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Blood Types Available</h3>
                      <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <Card title="Quick Actions">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleRecordDonation}
                    className="py-4 px-6 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200"
                    disabled={!isVerified}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Record New Donation
                  </button>
                  
                  <button
                    onClick={handleUpdateInventory}
                    className="py-4 px-6 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 flex items-center justify-center border border-green-200"
                    disabled={!isVerified}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Update Inventory
                  </button>
                  
                  <button
                    onClick={handleCreateEvent}
                    className="py-4 px-6 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200"
                    disabled={!isVerified}
                  >
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Create Donation Event
                  </button>
                </div>
                
                {!isVerified && (
                  <div className="mt-4 text-center text-sm text-yellow-600">
                    You need to be verified to perform these actions.
                  </div>
                )}
              </Card>
              
              {/* Recent Donations */}
              <Card title="Recent Donations">
                {recentDonations.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No donations recorded yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Donor
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Blood Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentDonations.map((donation) => (
                          <tr key={donation.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(donation.donationDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.donorId.slice(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.bloodType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.quantity} units
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  donation.status === 'collected'
                                    ? 'bg-blue-100 text-blue-800'
                                    : donation.status === 'processed'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : donation.status === 'available'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {recentDonations.length > 0 && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setActiveTab('donations')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View All Donations →
                    </button>
                  </div>
                )}
              </Card>
            </div>
          )}
          
          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <Card title="Blood Inventory">
              {inventory.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No inventory items yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blood Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Available Units
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventory.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.bloodType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.availableUnits}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.lastUpdated ? new Date(item.lastUpdated.toDate()).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.availableUnits > 10
                                  ? 'bg-green-100 text-green-800'
                                  : item.availableUnits > 5
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.availableUnits > 10
                                ? 'Sufficient'
                                : item.availableUnits > 5
                                ? 'Low'
                                : 'Critical'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="mt-6">
                <button
                  onClick={handleUpdateInventory}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!isVerified}
                >
                  Update Inventory
                </button>
              </div>
            </Card>
          )}
          
          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <div>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Donation Records</h2>
                <button
                  onClick={handleRecordDonation}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!isVerified}
                >
                  Record New Donation
                </button>
              </div>
              
              {recentDonations.length === 0 ? (
                <Card>
                  <div className="text-center py-6 text-gray-500">
                    No donations recorded yet
                  </div>
                </Card>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Donor ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Blood Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentDonations.map((donation) => (
                          <tr key={donation.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(donation.donationDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.donorId.slice(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.bloodType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {donation.quantity} units
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  donation.status === 'collected'
                                    ? 'bg-blue-100 text-blue-800'
                                    : donation.status === 'processed'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : donation.status === 'available'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                onClick={() => navigate(`/hospital/donations/${donation.id}`)}
                                disabled={!isVerified}
                              >
                                View
                              </button>
                              <button
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => navigate(`/hospital/donations/${donation.id}/update`)}
                                disabled={!isVerified || donation.status === 'used'}
                              >
                                Update Status
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}
          
          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Donation Events</h2>
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!isVerified}
                >
                  Create New Event
                </button>
              </div>
              
              <Card>
                <div className="text-center py-6 text-gray-500">
                  You haven't organized any donation events yet.
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HospitalDashboardPage; 