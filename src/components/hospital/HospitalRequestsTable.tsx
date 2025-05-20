import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { hospitalService } from '../../api/hospitalService';
import { requestService } from '../../api/requestService';

interface HospitalRequestsTableProps {
  hospitalId: string;
  className?: string;
}

const HospitalRequestsTable: React.FC<HospitalRequestsTableProps> = ({ 
  hospitalId,
  className = ''
}) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hospitalProfile, setHospitalProfile] = useState<any>(null);

  useEffect(() => {
    const loadRequests = async () => {
      if (!hospitalId) return;
      
      setIsLoading(true);
      try {
        // Get hospital information for metadata
        const hospitalData = await hospitalService.getHospitalById(hospitalId);
        setHospitalProfile(hospitalData);
        
        // Get hospital requests
        const hospitalRequests = await requestService.getRequestsForHospital(hospitalId);
        setRequests(hospitalRequests);
      } catch (error) {
        console.error('Error loading blood requests:', error);
        showNotification({
          type: 'error',
          message: 'Failed to load blood requests'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRequests();
  }, [hospitalId, showNotification]);

  const handleResponseClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setResponseNotes('');
    setShowResponseModal(true);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case 'fulfilled':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Fulfilled
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const updateRequestStatus = async (status: 'approved' | 'rejected' | 'fulfilled') => {
    if (!selectedRequestId || !user) return;
    
    try {
      // Add responder information from user
      const responderInfo = {
        responderId: user.id,
        responderName: user.name,
        responderRole: user.role
      };
      
      await requestService.updateRequestStatus(selectedRequestId, status, responseNotes);
      
      // Update local state
      setRequests(requests.map(request => 
        request.id === selectedRequestId 
          ? { 
              ...request, 
              status, 
              responseNotes,
              ...responderInfo,
              hospitalName: hospitalProfile?.name || 'Unknown Hospital'
            } 
          : request
      ));
      
      showNotification({
        type: 'success',
        message: `Request ${status} successfully`
      });
      
      setShowResponseModal(false);
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      showNotification({
        type: 'error',
        message: `Failed to ${status} request`
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`hospital-requests-table ${className}`}>
        <div className="text-center py-4">
          <p className="text-gray-500">Loading blood requests...</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className={`hospital-requests-table ${className}`}>
        <div className="text-center py-4 border border-gray-200 rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No blood requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no blood requests for your hospital at the moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`hospital-requests-table ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Units
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.recipientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.bloodType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.unitsRequested}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(request.requestDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleResponseClick(request.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Respond
                    </button>
                  )}
                  {request.status === 'approved' && (
                    <button
                      onClick={() => handleResponseClick(request.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Mark Fulfilled
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Respond to Blood Request
                    </h3>
                    <div className="mt-2">
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes (optional)
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Add any notes about this request..."
                            value={responseNotes}
                            onChange={(e) => setResponseNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {requests.find(r => r.id === selectedRequestId)?.status === 'approved' ? (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => updateRequestStatus('fulfilled')}
                  >
                    Mark as Fulfilled
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => updateRequestStatus('approved')}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => updateRequestStatus('rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowResponseModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalRequestsTable; 