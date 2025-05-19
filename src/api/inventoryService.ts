import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  Timestamp,
  serverTimestamp,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { donorService } from './donorService';

// Blood inventory status
export interface BloodInventory {
  bloodType: string;
  available: number;
  requested: number;
  lastUpdated?: Timestamp;
}

// Blood request form
export interface BloodRequest {
  id?: string;
  patientName: string;
  patientAge: number;
  bloodType: string;
  unitsNeeded: number;
  hospitalName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  urgency: 'normal' | 'urgent' | 'critical';
  reason: string;
  status: 'pending' | 'approved' | 'fulfilled' | 'rejected';
  requestDate?: Timestamp;
  updatedAt?: Timestamp;
  userId?: string;
}

// Alias for readable blood types
const BLOOD_TYPE_DISPLAY = {
  'A+': 'A Positive (A+)',
  'A-': 'A Negative (A-)',
  'B+': 'B Positive (B+)',
  'B-': 'B Negative (B-)',
  'AB+': 'AB Positive (AB+)',
  'AB-': 'AB Negative (AB-)',
  'O+': 'O Positive (O+)',
  'O-': 'O Negative (O-)'
};

// Collection reference
const requestsCollection = collection(db, 'bloodRequests');

export const inventoryService = {
  // Get blood availability from donors collection
  getBloodAvailability: async (): Promise<BloodInventory[]> => {
    try {
      // Get all donors grouped by blood type
      const donors = await donorService.getAllDonors();
      
      // Count donors by blood type
      const bloodTypeCounts = donors.reduce((counts, donor) => {
        const type = donor.bloodType;
        if (!counts[type]) {
          counts[type] = 0;
        }
        counts[type]++;
        return counts;
      }, {} as Record<string, number>);
      
      // Get pending requests to calculate net availability
      const requestsSnapshot = await getDocs(
        query(requestsCollection, where('status', '==', 'pending'))
      );
      
      const pendingRequests = requestsSnapshot.docs.map(doc => doc.data() as BloodRequest);
      
      // Count requested units by blood type
      const requestedCounts = pendingRequests.reduce((counts, request) => {
        const type = request.bloodType;
        if (!counts[type]) {
          counts[type] = 0;
        }
        counts[type] += request.unitsNeeded;
        return counts;
      }, {} as Record<string, number>);
      
      // Create inventory items for all blood types
      const inventory: BloodInventory[] = Object.keys(BLOOD_TYPE_DISPLAY).map(type => ({
        bloodType: type,
        available: bloodTypeCounts[type] || 0,
        requested: requestedCounts[type] || 0,
        lastUpdated: Timestamp.now()
      }));
      
      return inventory;
    } catch (error) {
      console.error("Error fetching blood availability:", error);
      throw error;
    }
  },
  
  // Get all blood requests
  getAllRequests: async (): Promise<BloodRequest[]> => {
    try {
      const querySnapshot = await getDocs(
        query(requestsCollection, orderBy('requestDate', 'desc'))
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BloodRequest));
    } catch (error) {
      console.error("Error fetching blood requests:", error);
      throw error;
    }
  },
  
  // Create a blood request
  createRequest: async (requestData: Omit<BloodRequest, 'id'>): Promise<string> => {
    try {
      // Add timestamps
      const requestWithTimestamps = {
        ...requestData,
        status: 'pending',
        requestDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(requestsCollection, requestWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error("Error creating blood request:", error);
      throw error;
    }
  },
  
  // Update a blood request
  updateRequest: async (id: string, requestData: Partial<BloodRequest>): Promise<void> => {
    try {
      const docRef = doc(db, 'bloodRequests', id);
      
      // Add updated timestamp
      const updatedData = {
        ...requestData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error("Error updating blood request:", error);
      throw error;
    }
  },
  
  // Get a specific blood request
  getRequestById: async (id: string): Promise<BloodRequest | null> => {
    try {
      const docRef = doc(db, 'bloodRequests', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BloodRequest;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching blood request:", error);
      throw error;
    }
  },
  
  // Delete a blood request
  deleteRequest: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'bloodRequests', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting blood request:", error);
      throw error;
    }
  },
  
  // Get compatibility chart for blood types
  getCompatibilityChart: () => {
    return {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    };
  },
  
  // Get blood type info for display
  getBloodTypeDisplay: () => BLOOD_TYPE_DISPLAY
}; 