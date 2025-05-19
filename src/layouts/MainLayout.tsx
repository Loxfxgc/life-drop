import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Notification from '../components/common/Notification';
import { useNotification } from '../hooks/useNotification';

const MainLayout: React.FC = () => {
  const { notifications } = useNotification();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
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
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout; 