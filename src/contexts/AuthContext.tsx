import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Define types
type UserRole = 'user' | 'admin' | 'hospital';

type User = {
  id: string;
  name: string;
  email: string | null;
  photoURL?: string | null;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User>;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (userData: { name: string; email: string; password: string }) => Promise<User>;
  registerAsHospital: (userData: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
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

  // Helper function to get user role from Firestore
  const getUserRole = async (uid: string): Promise<UserRole> => {
    try {
      const userRoleDoc = await getDoc(doc(db, 'userRoles', uid));
      if (userRoleDoc.exists()) {
        return userRoleDoc.data().role as UserRole;
      }
      return 'user'; // Default role
    } catch (err) {
      console.error("Error fetching user role:", err);
      return 'user'; // Default role on error
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Get the user's role from Firestore
        const role = await getUserRole(firebaseUser.uid);
        
        // Convert Firebase user to our app user
        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role,
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
      
      // Get or set user role
      let role: UserRole = 'user';
      const userRoleDoc = await getDoc(doc(db, 'userRoles', firebaseUser.uid));
      
      if (userRoleDoc.exists()) {
        role = userRoleDoc.data().role as UserRole;
      } else {
        // Create a new role document if it doesn't exist
        await setDoc(doc(db, 'userRoles', firebaseUser.uid), { role });
      }
      
      // Convert Firebase user to our app user
      const appUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role,
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
      
      // Get user role
      const role = await getUserRole(firebaseUser.uid);
      
      // Convert Firebase user to our app user
      const appUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role,
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
      const { name, email, password } = userData;
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      // Update the user's display name
      await updateProfile(firebaseUser, { displayName: name });
      
      // Set default role as 'user'
      await setDoc(doc(db, 'userRoles', firebaseUser.uid), { role: 'user' });
      
      // Convert Firebase user to our app user
      const appUser: User = {
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: 'user',
      };
      
      return appUser;
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  // Register as hospital
  const registerAsHospital = async (userData: { name: string; email: string; password: string }): Promise<User> => {
    try {
      setError(null);
      const { name, email, password } = userData;
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;
      
      // Update the user's display name
      await updateProfile(firebaseUser, { displayName: name });
      
      // Set role as 'hospital'
      await setDoc(doc(db, 'userRoles', firebaseUser.uid), { role: 'hospital' });
      
      // Convert Firebase user to our app user
      const appUser: User = {
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        role: 'hospital',
      };
      
      return appUser;
    } catch (err: any) {
      setError(err.message || 'Failed to register as hospital');
      throw err;
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, role: UserRole): Promise<void> => {
    try {
      await updateDoc(doc(db, 'userRoles', userId), { role });
      
      // If this is the current user, update the local state
      if (user && user.id === userId) {
        setUser({
          ...user,
          role
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
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
    registerAsHospital,
    logout,
    updateUserRole,
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