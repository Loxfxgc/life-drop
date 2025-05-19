import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'login'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('login')}
        >
          Sign In
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'register'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('register')}
        >
          Create Account
        </button>
      </div>
      
      {/* Form content */}
      <div className="mt-4">
        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage; 