import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      addNotification('Please enter both email and password', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      await login({ email, password });
      addNotification('Login successful!', 'success');
      navigate('/');
    } catch (error: any) {
      addNotification(error.message || 'Failed to login', 'error');
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
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      
      <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
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
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            className="bg-red-600 hover:bg-red-700"
          >
            Sign In
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
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 