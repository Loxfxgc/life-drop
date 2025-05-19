import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import { userService } from '../api/userService';
import { donorService, DonationHistory } from '../api/donorService';
import { inventoryService, BloodRequest } from '../api/inventoryService';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  profilePicture?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { showNotification } = useNotification();
  
  // State for user data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for donation history
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [isLoadingDonations, setIsLoadingDonations] = useState(true);
  
  // State for blood requests
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'profile' | 'donations' | 'requests'>('profile');
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        const userData = await userService.getUserProfile(currentUser.id);
        setProfile(userData);
        setEditedProfile(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        showNotification({
          type: 'error',
          message: 'Failed to load profile information'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [currentUser, navigate, showNotification]);
  
  // Fetch donation history
  useEffect(() => {
    const fetchDonations = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoadingDonations(true);
        const donations = await donorService.getDonorHistory(currentUser.id);
        setDonationHistory(donations);
      } catch (error) {
        console.error('Error fetching donation history:', error);
      } finally {
        setIsLoadingDonations(false);
      }
    };
    
    if (activeTab === 'donations') {
      fetchDonations();
    }
  }, [currentUser, activeTab]);
  
  // Fetch blood requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoadingRequests(true);
        const requests = await inventoryService.getAllRequests();
        // Filter requests by the current user's ID
        const userRequests = requests.filter(req => req.userId === currentUser.id);
        setBloodRequests(userRequests);
      } catch (error) {
        console.error('Error fetching blood requests:', error);
      } finally {
        setIsLoadingRequests(false);
      }
    };
    
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [currentUser, activeTab]);
  
  // Handle profile edit form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [name]: value,
      });
    }
  };
  
  // Handle save profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedProfile) return;
    
    setIsSaving(true);
    
    try {
      await userService.updateUserProfile(editedProfile.id, editedProfile);
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      showNotification({
        type: 'success',
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification({
        type: 'error',
        message: 'Failed to update profile'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      showNotification({
        type: 'error',
        message: 'Failed to log out'
      });
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="profile-page">
        <section className="hero-section bg-gradient-to-r from-purple-500 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Loading Profile...</h1>
          </div>
        </section>
      </div>
    );
  }
  
  // Render if no profile found
  if (!profile) {
    return (
      <div className="profile-page">
        <section className="hero-section bg-gradient-to-r from-purple-500 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-xl max-w-3xl mx-auto">
              We couldn't find your profile information. Please try again or contact support.
            </p>
          </div>
        </section>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      {/* Hero section */}
      <section className="hero-section bg-gradient-to-r from-purple-500 to-purple-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full overflow-hidden mr-4 flex-shrink-0">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-200 flex items-center justify-center text-purple-700 text-xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                <div className="flex items-center">
                  <span className="mr-2">
                    <svg className="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </span>
                  <span>{profile.email}</span>
                </div>
                {profile.bloodType && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                    Blood Type: {profile.bloodType}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-purple-800 hover:bg-purple-900 rounded-md text-sm transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </section>
      
      {/* Tabs navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex -mb-px">
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'donations'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('donations')}
            >
              Donation History
            </button>
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              Request History
            </button>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <Card title={isEditing ? 'Edit Profile' : 'Profile Information'}>
              {isEditing ? (
                <form onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editedProfile?.name || ''}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editedProfile?.email || ''}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editedProfile?.phone || ''}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={editedProfile?.dateOfBirth || ''}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={editedProfile?.gender || ''}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Type
                      </label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={editedProfile?.bloodType || ''}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Unknown</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editedProfile?.address || ''}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(profile);
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="mt-1 font-medium">{profile.name}</p>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="mt-1 font-medium">{profile.email}</p>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="mt-1 font-medium">{profile.phone || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <p className="text-sm text-gray-500">Blood Type</p>
                      <p className="mt-1 font-medium">{profile.bloodType || 'Unknown'}</p>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="mt-1 font-medium">{profile.dateOfBirth || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="mt-1 font-medium capitalize">{profile.gender || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 rounded-lg md:col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="mt-1 font-medium">{profile.address || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}
          
          {/* Donation History Tab */}
          {activeTab === 'donations' && (
            <Card title="Donation History">
              {isLoadingDonations ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading donation history...</p>
                </div>
              ) : donationHistory.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No donations yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't made any blood donations yet.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      onClick={() => navigate('/donate')}
                    >
                      Schedule a Donation
                    </button>
                  </div>
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
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blood Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {donationHistory.map((donation) => (
                        <tr key={donation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {donation.date.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donation.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donation.bloodType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              donation.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : donation.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
          
          {/* Blood Request History Tab */}
          {activeTab === 'requests' && (
            <Card title="Blood Request History">
              {isLoadingRequests ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading request history...</p>
                </div>
              ) : bloodRequests.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No blood requests yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't made any blood requests yet.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      onClick={() => navigate('/request')}
                    >
                      Request Blood
                    </button>
                  </div>
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
                          Patient
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blood Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Units
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bloodRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.requestDate?.toDate().toLocaleDateString() || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.patientName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.bloodType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.unitsNeeded}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'fulfilled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage; 