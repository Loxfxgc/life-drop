import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Notification from '../components/common/Notification';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

const AdminLayout: React.FC = () => {
  const { notifications } = useNotification();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 text-white transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-16'
          } fixed inset-y-0 left-0 z-30 pt-16 flex flex-col`}
        >
          <div className="flex-grow overflow-y-auto">
            <div className="px-4 py-4 flex items-center">
              {isSidebarOpen && (
                <img
                  className="h-8 w-auto mr-2"
                  src="/assets/images/lifedrop-logo.png"
                  alt="LifeDrop Logo"
                />
              )}
              <button
                onClick={toggleSidebar}
                className={`${isSidebarOpen ? 'ml-auto' : 'w-full'} flex items-center justify-center`}
              >
                <svg
                  className={`w-6 h-6 transition-transform ${
                    isSidebarOpen ? 'rotate-0' : 'rotate-180'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            <nav className="mt-5 px-2">
              <Link
                to={ROUTES.ADMIN}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(ROUTES.ADMIN)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>

              <Link
                to={`${ROUTES.ADMIN}/users`}
                className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(`${ROUTES.ADMIN}/users`)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                {isSidebarOpen && <span>Users</span>}
              </Link>

              <Link
                to={`${ROUTES.ADMIN}/inventory`}
                className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(`${ROUTES.ADMIN}/inventory`)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                {isSidebarOpen && <span>Inventory</span>}
              </Link>

              <Link
                to={`${ROUTES.ADMIN}/donations`}
                className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(`${ROUTES.ADMIN}/donations`)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                  />
                </svg>
                {isSidebarOpen && <span>Donations</span>}
              </Link>

              <Link
                to={`${ROUTES.ADMIN}/requests`}
                className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(`${ROUTES.ADMIN}/requests`)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                {isSidebarOpen && <span>Requests</span>}
              </Link>

              <Link
                to={`${ROUTES.ADMIN}/reports`}
                className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(`${ROUTES.ADMIN}/reports`)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <svg
                  className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {isSidebarOpen && <span>Reports</span>}
              </Link>
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex items-center">
              <div>
                <svg
                  className="h-10 w-10 text-gray-400 rounded-full bg-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <div className="flex items-center">
                    <Link
                      to={ROUTES.PROFILE}
                      className="text-xs font-medium text-gray-300 hover:text-white"
                    >
                      View Profile
                    </Link>
                    <span className="mx-1 text-gray-500">|</span>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-gray-300 hover:text-white"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-16'
          } pt-16`}
        >
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout; 