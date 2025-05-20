import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HospitalLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-purple-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            className="h-8 w-auto mr-2"
            src="/assets/images/lifedrop-logo.png"
            alt="LifeDrop Logo"
          />
          <h1 className="text-xl font-bold">LifeDrop Hospital</h1>
        </div>
        <button
          type="button"
          className="text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="flex h-screen overflow-hidden">
        <div className={`${isMobileMenuOpen ? 'block fixed inset-0 z-40' : 'hidden'} lg:block lg:relative lg:flex-shrink-0 bg-purple-900 w-64`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 bg-purple-950">
              <img
                className="h-8 w-auto mr-2"
                src="/assets/images/lifedrop-logo.png"
                alt="LifeDrop Logo"
              />
              <h1 className="text-xl font-bold text-white">LifeDrop Hospital</h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {user && (
                <div className="px-4 py-2 mb-4 border-b border-purple-800">
                  <p className="text-purple-100 text-sm">Logged in as</p>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-purple-200 text-xs">{user.email}</p>
                </div>
              )}
              <nav className="px-2 space-y-1">
                <Link 
                  to="/hospital/dashboard" 
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/hospital/dashboard')}`}
                >
                  <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                
                <Link 
                  to="/hospital/record-donation" 
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/hospital/record-donation')}`}
                >
                  <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Record Donation
                </Link>
                
                <Link 
                  to="/hospital/requests" 
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/hospital/requests')}`}
                >
                  <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Blood Requests
                </Link>
                
                <Link 
                  to="/hospital/inventory" 
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/hospital/inventory')}`}
                >
                  <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Inventory
                </Link>
                
                <Link 
                  to="/hospital/events" 
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/hospital/events')}`}
                >
                  <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Donation Events
                </Link>
              </nav>
            </div>
            
            <div className="p-4 border-t border-purple-800">
              <div className="flex items-center">
                <div>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-purple-100 hover:bg-purple-700"
                  >
                    <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <main className="flex-1 relative pb-8 z-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default HospitalLayout; 