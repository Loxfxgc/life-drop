import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';

export interface DonorData {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  age: number;
  gender: string;
  weight: number;
  address: string;
  medicalHistory: {
    hasDisease: boolean;
    hasTattoo: boolean;
    hasRecentSurgery: boolean;
    hasAllergies: boolean;
    isMedicated: boolean;
    additionalInfo: string;
  };
  lastDonation?: Date;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface DonationHistory {
  id: string;
  date: Date;
  location: string;
  donorId: string;
  userId: string;
  bloodType: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Collection references
const donorsCollection = collection(db, 'donors');
const donationsCollection = collection(db, 'donations');

export const donorService = {
  // Get all donors
  getAllDonors: async (): Promise<DonorData[]> => {
    try {
      const querySnapshot = await getDocs(donorsCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DonorData));
    } catch (error) {
      console.error("Error getting donors:", error);
      throw error;
    }
  },
  
  // Get donors by blood type
  getDonorsByBloodType: async (bloodType: string): Promise<DonorData[]> => {
    try {
      const q = query(donorsCollection, where("bloodType", "==", bloodType));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DonorData));
    } catch (error) {
      console.error("Error getting donors by blood type:", error);
      throw error;
    }
  },
  
  // Get donor by ID
  getDonorById: async (id: string): Promise<DonorData | null> => {
    try {
      const docRef = doc(db, 'donors', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DonorData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting donor:", error);
      throw error;
    }
  },
  
  // Get donor by user ID
  getDonorByUserId: async (userId: string): Promise<DonorData | null> => {
    try {
      const q = query(donorsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const donorDoc = querySnapshot.docs[0];
        return { id: donorDoc.id, ...donorDoc.data() } as DonorData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting donor by user ID:", error);
      throw error;
    }
  },
  
  // Register new donor
  registerDonor: async (donorData: Omit<DonorData, 'id'>): Promise<string> => {
    try {
      // Add timestamps
      const donorWithTimestamps = {
        ...donorData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(donorsCollection, donorWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error("Error registering donor:", error);
      throw error;
    }
  },
  
  // Update donor information
  updateDonor: async (id: string, donorData: Partial<DonorData>): Promise<void> => {
    try {
      const docRef = doc(db, 'donors', id);
      
      // Add updated timestamp
      const updatedData = {
        ...donorData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error("Error updating donor:", error);
      throw error;
    }
  },
  
  // Delete donor
  deleteDonor: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'donors', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting donor:", error);
      throw error;
    }
  },
  
  // Get donation history for a donor
  getDonorHistory: async (userId: string): Promise<DonationHistory[]> => {
    try {
      // Remove the sorting by date to avoid requiring a composite index
      const q = query(
        donationsCollection, 
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Map and convert dates, then sort in memory
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore timestamp to JavaScript Date
          date: data.date?.toDate() || new Date(),
        } as DonationHistory;
      }).sort((a, b) => {
        // Sort by date in descending order (newest first)
        return b.date.getTime() - a.date.getTime();
      });
    } catch (error) {
      console.error("Error getting donor history:", error);
      throw error;
    }
  },
  
  // Record new donation
  recordDonation: async (donationData: Omit<DonationHistory, 'id'>): Promise<string> => {
    try {
      // Add timestamps
      const donationWithTimestamps = {
        ...donationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(donationsCollection, donationWithTimestamps);
      
      // Update last donation date for the donor
      if (donationData.donorId) {
        const donorRef = doc(db, 'donors', donationData.donorId);
        await updateDoc(donorRef, {
          lastDonation: donationData.date,
          updatedAt: serverTimestamp()
        });
      }
      
      return docRef.id;
    } catch (error) {
      console.error("Error recording donation:", error);
      throw error;
    }
  }
}; 