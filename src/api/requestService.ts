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

export interface BloodRequest {
  id?: string;
  userId: string;
  recipientId?: string;
  recipientName: string;
  hospitalId?: string;
  hospitalName?: string;
  bloodType: string;
  unitsRequested: number;
  urgency: 'normal' | 'urgent' | 'emergency';
  reason: string;
  notes?: string;
  responseNotes?: string;
  requestDate?: Timestamp;
  requiredByDate?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const requestsCollection = collection(db, 'bloodRequests');

export const requestService = {
  getAllRequests: async (): Promise<BloodRequest[]> => {
    try {
      const querySnapshot = await getDocs(query(requestsCollection, orderBy('createdAt', 'desc')));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BloodRequest));
    } catch (error) {
      console.error("Error getting all requests:", error);
      throw error;
    }
  },
  
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
      console.error("Error getting request by ID:", error);
      throw error;
    }
  },
  
  getRequestsByUserId: async (userId: string): Promise<BloodRequest[]> => {
    try {
      const q = query(
        requestsCollection, 
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BloodRequest)).sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error("Error getting user requests:", error);
      throw error;
    }
  },
  
  getRequestsForHospital: async (hospitalId: string): Promise<BloodRequest[]> => {
    try {
      const q = query(
        requestsCollection, 
        where("hospitalId", "==", hospitalId)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BloodRequest)).sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error("Error getting hospital requests:", error);
      throw error;
    }
  },
  
  createRequest: async (requestData: Omit<BloodRequest, 'id'>): Promise<string> => {
    try {
      const requestWithTimestamps = {
        ...requestData,
        status: 'pending',
        requestDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(requestsCollection, requestWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error("Error creating blood request:", error);
      throw error;
    }
  },
  
  updateRequest: async (id: string, requestData: Partial<BloodRequest>): Promise<void> => {
    try {
      const docRef = doc(db, 'bloodRequests', id);
      
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
  
  deleteRequest: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'bloodRequests', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting blood request:", error);
      throw error;
    }
  },
  
  updateRequestStatus: async (id: string, status: BloodRequest['status'], notes?: string): Promise<void> => {
    try {
      const docRef = doc(db, 'bloodRequests', id);
      
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };
      
      if (notes) {
        updateData.responseNotes = notes;
      }
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  }
}; 