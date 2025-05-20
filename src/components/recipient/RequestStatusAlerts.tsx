import React, { useState, useEffect } from 'react';
import { requestService, BloodRequest } from '../../api/requestService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface RequestStatusAlertsProps {
  className?: string;
}

const RequestStatusAlerts: React.FC<RequestStatusAlertsProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const userRequests = await requestService.getRequestsByUserId(user.id);
        setRequests(userRequests);
      } catch (error) {
        console.error('Error loading request status alerts:', error);
        showNotification({
          type: 'error',
          message: 'Failed to load request status updates'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRequests();
  }, [user, showNotification]);
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'fulfilled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex-shrink-0">
            <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex-shrink-0">
            <span className="bg-green-100 text-green-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex-shrink-0">
            <span className="bg-red-100 text-red-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        );
      case 'fulfilled':
        return (
          <div className="flex-shrink-0">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex-shrink-0">
            <span className="bg-gray-100 text-gray-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0">
            <span className="bg-gray-100 text-gray-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className={`request-status-alerts ${className}`}>
        <div className="text-center py-4">
          <p className="text-gray-500">Loading request statuses...</p>
        </div>
      </div>
    );
  }
  
  if (requests.length === 0) {
    return (
      <div className={`request-status-alerts ${className}`}>
        <div className="text-center py-4 border border-gray-200 rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No blood requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't made any blood requests yet
          </p>
        </div>
      </div>
    );
  }
  
  // Sort by most recent changes first
  const sortedRequests = [...requests].sort((a, b) => {
    const aTime = a.updatedAt?.toMillis() || a.createdAt?.toMillis() || 0;
    const bTime = b.updatedAt?.toMillis() || b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  });
  
  return (
    <div className={`request-status-alerts ${className}`}>
      <ul className="divide-y divide-gray-200">
        {sortedRequests.map((request) => (
          <li key={request.id} className="py-4">
            <div className="flex items-start space-x-4">
              {getStatusIcon(request.status)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Blood Request: {request.bloodType} ({request.unitsRequested} units)
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Hospital: {request.hospitalName || 'Any Available Hospital'}
                </p>
                <p className="text-sm text-gray-500">
                  Requested: {formatDate(request.requestDate || request.createdAt)}
                </p>
                {request.responseNotes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-700">
                    <p className="font-medium">Hospital response:</p>
                    <p>{request.responseNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestStatusAlerts; 