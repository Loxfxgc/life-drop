import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Define types
type User = {
  id: string;
  name: string;
  email: string | null;
  photoURL?: string | null;
  role: string;
};

type AuthContextType = {
  user: User | null;
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User>;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (userData: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  error: string | null;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Convert Firebase user to our app user
        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: 'user', // Default role - in a real app, you'd fetch this from your database
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Login with Google
  const loginWithGoogle = async (): Promise<User> => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Convert Firebase user to our app user
      const appUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: 'user', // Default role - in a real app, you'd fetch this from your database
      };
      
      return appUser;
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
      throw err;
    }
  };

  // Login with email/password
  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    try {
      setError(null);
      const { email, password } = credentials;
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      // Convert Firebase user to our app user
      const appUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: 'user', // Default role - in a real app, you'd fetch this from your database
      };
      
      return appUser;
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  // Register with email/password
  const register = async (userData: { name: string; email: string; password: string }): Promise<User> => {
    try {
      setError(null);
      const { email, password } = userData;
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      // Convert Firebase user to our app user
      const appUser: User = {
        id: firebaseUser.uid,
        name: userData.name, // Use the name provided in registration
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: 'user', // Default role
      };
      
      return appUser;
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      throw err;
    }
  };

  const value = {
    user,
    currentUser: user,
    loading,
    loginWithGoogle,
    login,
    register,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the AuthContext for direct use
export { AuthContext }; 