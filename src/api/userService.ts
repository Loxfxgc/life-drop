import { db } from '../firebase/config';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  profilePicture?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const usersCollection = collection(db, 'users');

export const userService = {
  // Get user profile by user ID
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserProfile;
      } else {
        // Create a default profile if it doesn't exist
        const defaultProfile: Omit<UserProfile, 'id'> = {
          name: 'New User',
          email: '',
          phone: '',
          address: '',
          bloodType: '',
          dateOfBirth: '',
          gender: 'other',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await setDoc(docRef, defaultProfile);
        return { id: userId, ...defaultProfile } as UserProfile;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId: string, profileData: Partial<UserProfile>): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId);
      
      // Add updated timestamp
      const updatedData = {
        ...profileData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Get users by blood type
  getUsersByBloodType: async (bloodType: string): Promise<UserProfile[]> => {
    try {
      const q = query(usersCollection, where('bloodType', '==', bloodType));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserProfile));
    } catch (error) {
      console.error('Error fetching users by blood type:', error);
      throw error;
    }
  }
}; 