import React, { createContext, useContext, useState, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationOptions {
  type: NotificationType;
  message: string;
  duration?: number;
}

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType) => number;
  removeNotification: (id: number) => void;
  showNotification: (options: NotificationOptions) => number;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: NotificationType = 'info') => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);

    return id;
  };

  const showNotification = ({ message, type = 'info', duration = 5000 }: NotificationOptions) => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);

    // Auto remove after specified duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Export the NotificationContext for direct use
export { NotificationContext }; 