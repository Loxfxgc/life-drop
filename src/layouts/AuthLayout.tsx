import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Notification from '../components/common/Notification';
import { useNotification } from '../hooks/useNotification';
import { ROUTES } from '../constants/routes';

const AuthLayout: React.FC = () => {
  const { notifications } = useNotification();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to={ROUTES.HOME}>
          <div className="flex justify-center">
            <img
              className="h-12 w-auto"
              src="/assets/images/logo.png"
              alt="Blood Bank"
            />
            <span className="ml-2 text-2xl font-bold text-red-600">Blood Bank</span>
          </div>
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 w-full max-w-md">
        {notifications.map(notification => (
          <Notification 
            key={notification.id}
            message={notification.message}
            type={notification.type}
            id={notification.id}
          />
        ))}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
        <div className="mt-6 text-center">
          <Link to={ROUTES.HOME} className="text-sm text-gray-600 hover:text-gray-900">
            Return to home page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 