import React from 'react';
import './index.css'; // Import the main CSS file that imports all styles

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Notifications from './components/common/Notifications';

// Router
import AppRouter from './router/AppRouter';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppRouter />
          <Notifications />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
