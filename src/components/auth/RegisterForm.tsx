import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';
import { validateEmail, validatePassword } from '../../utils/validators';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name) {
      addNotification('Please enter your name', 'error');
      return false;
    }
    
    if (!email || !validateEmail(email)) {
      addNotification('Please enter a valid email', 'error');
      return false;
    }
    
    if (!password || !validatePassword(password)) {
      addNotification('Password must be at least 8 characters with one uppercase, one lowercase, and one number', 'error');
      return false;
    }
    
    if (password !== confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      await register({ name, email, password });
      addNotification('Registration successful!', 'success');
      navigate('/');
    } catch (error: any) {
      addNotification(error.message || 'Failed to register', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      addNotification('Login successful!', 'success');
      navigate('/');
    } catch (error: any) {
      addNotification(error.message || 'Failed to login with Google', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Full name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Email address"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Password"
          />
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters with one uppercase, one lowercase, and one number
          </p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Confirm password"
          />
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            className="bg-red-600 hover:bg-red-700"
          >
            Create Account
          </Button>
        </div>
      </form>
      
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            isLoading={isLoading}
            fullWidth
            className="border-gray-300"
            leftIcon={
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                />
              </svg>
            }
          >
            Sign up with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 