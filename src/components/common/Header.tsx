import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ROUTES } from '../../constants/routes';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={ROUTES.HOME} className="flex-shrink-0 flex items-center">
              <img
                className="h-10 w-auto"
                src="/assets/images/logo.png"
                alt="LifeDrop Logo"
              />
              <span className="ml-2 text-xl font-bold text-red-600">LifeDrop</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to={ROUTES.HOME} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Home
              </Link>
              <Link to={ROUTES.ABOUT} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                About
              </Link>
              <Link to={ROUTES.DONOR} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Donate
              </Link>
              <Link to={ROUTES.REQUEST} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Request Blood
              </Link>
              <Link to={ROUTES.CONTACT} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Contact
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <div className="ml-4 relative flex-shrink-0" ref={profileDropdownRef}>
                <div>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    id="user-menu-button"
                    aria-expanded={isProfileDropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.photoURL ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.photoURL}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                </div>

                {isProfileDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to={ROUTES.PROFILE}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to={ROUTES.ADMIN}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-1"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-4 flex-shrink-0 flex items-center">
                <Link
                  to={ROUTES.AUTH}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={toggleMobileMenu}
              className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <Link
              to={ROUTES.HOME}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to={ROUTES.DONOR}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Donate
            </Link>
            <Link
              to={ROUTES.REQUEST}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Request Blood
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1 px-2">
                <div className="flex items-center px-3 py-2">
                  {user.photoURL ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.photoURL}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <Link
                  to={ROUTES.PROFILE}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to={ROUTES.ADMIN}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-2">
                <Link
                  to={ROUTES.AUTH}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-center text-white bg-red-600 hover:bg-red-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 