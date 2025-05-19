import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import Notification from './Notification';

const Notifications: React.FC = () => {
  const { notifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-md">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </div>
  );
};

export default Notifications; 