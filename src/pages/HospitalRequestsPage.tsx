import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { hospitalService } from '../api/hospitalService';
import HospitalRequestsTable from '../components/hospital/HospitalRequestsTable';

const HospitalRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [hospital, setHospital] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const hospitalProfile = await hospitalService.getHospitalByUserId(user.id);
        setHospital(hospitalProfile);
      } catch (error) {
        console.error('Error fetching hospital profile:', error);
        showNotification({
          type: 'error',
          message: 'Failed to load hospital profile'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHospitalProfile();
  }, [user, showNotification]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Hospital Profile Not Found</h2>
          <p className="mt-2 text-gray-600">
            Please register your hospital profile first before accessing this page.
          </p>
          <div className="mt-6">
            <a 
              href="/hospital/register" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register Hospital
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Blood Requests Management</h1>
          <p className="text-gray-600 mt-1">Manage blood requests sent to your hospital</p>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Pending Requests</h2>
            <HospitalRequestsTable hospitalId={hospital.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRequestsPage; 