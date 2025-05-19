import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import AuthPage from '../pages/AuthPage';
import DonorPage from '../pages/DonorPage';
import RecipientPage from '../pages/RecipientPage';
import InventoryPage from '../pages/InventoryPage';
import RequestPage from '../pages/RequestPage';
import AppointmentPage from '../pages/AppointmentPage';
import AdminPage from '../pages/AdminPage';
import ProfilePage from '../pages/ProfilePage';
import FAQPage from '../pages/FAQPage';
import ContactPage from '../pages/ContactPage';

// Create placeholder component for admin sections
import PlaceholderPage from '../components/common/PlaceholderPage';

const AppRouter: React.FC = () => {
  const { loading } = useAuth();
  
  // Display a loading indicator while checking auth status
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>
      
      {/* Protected Routes - User */}
      <Route 
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/donor" element={<DonorPage />} />
        <Route path="/recipient" element={<RecipientPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
      </Route>
      
      {/* Protected Routes - Admin */}
      <Route 
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users" element={<PlaceholderPage title="Admin - Users" />} />
        <Route path="/admin/inventory" element={<PlaceholderPage title="Admin - Inventory" />} />
        <Route path="/admin/donations" element={<PlaceholderPage title="Admin - Donations" />} />
        <Route path="/admin/requests" element={<PlaceholderPage title="Admin - Requests" />} />
        <Route path="/admin/reports" element={<PlaceholderPage title="Admin - Reports" />} />
      </Route>
      
      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Helper components for protected routes
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const RequireAdmin: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default AppRouter; 