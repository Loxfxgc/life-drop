import React, { useState, useEffect } from 'react';
import { hospitalService, DonationAlert } from '../../api/hospitalService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface DonationAlertsProps {
  className?: string;
}

const DonationAlerts: React.FC<DonationAlertsProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [alerts, setAlerts] = useState<DonationAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const userAlerts = await hospitalService.getUserAlerts(user.id);
        setAlerts(userAlerts);
      } catch (error) {
        console.error('Error loading donation alerts:', error);
        showNotification({
          type: 'error',
          message: 'Failed to load donation alerts'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAlerts();
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
  
  const markAsRead = async (alertId: string) => {
    try {
      await hospitalService.markAlertAsRead(alertId);
      
      // Update the local state
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'read' } 
          : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
      showNotification({
        type: 'error',
        message: 'Failed to update alert status'
      });
    }
  };
  
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'collection':
        return (
          <div className="flex-shrink-0">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
        );
      case 'status_update':
        return (
          <div className="flex-shrink-0">
            <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          </div>
        );
      case 'usage':
        return (
          <div className="flex-shrink-0">
            <span className="bg-green-100 text-green-600 p-2 rounded-full inline-block">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
      <div className={`donation-alerts ${className}`}>
        <div className="text-center py-4">
          <p className="text-gray-500">Loading donation alerts...</p>
        </div>
      </div>
    );
  }
  
  if (alerts.length === 0) {
    return (
      <div className={`donation-alerts ${className}`}>
        <div className="text-center py-4 border border-gray-200 rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No donation alerts</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any donation alerts at the moment
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`donation-alerts ${className}`}>
      <ul className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <li key={alert.id} className={`py-4 ${alert.status === 'unread' ? 'bg-blue-50' : ''}`}>
            <div className="flex items-start space-x-4">
              {getAlertTypeIcon(alert.type)}
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium text-gray-900 ${alert.status === 'unread' ? 'font-semibold' : ''}`}>
                  {alert.message}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(alert.createdAt)}
                </p>
              </div>
              
              {alert.status === 'unread' && (
                <button
                  onClick={() => markAsRead(alert.id!)}
                  className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-500"
                >
                  Mark as read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationAlerts; 