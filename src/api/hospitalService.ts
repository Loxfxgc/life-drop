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
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';

export interface HospitalProfile {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  licenseNumber: string;
  contactPerson: string;
  registrationDate?: Timestamp;
  isVerified: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface HospitalBloodInventory {
  id?: string;
  hospitalId: string;
  bloodType: string;
  availableUnits: number;
  lastUpdated?: Timestamp;
}

export interface BloodDonationEvent {
  id?: string;
  hospitalId: string;
  title: string;
  description: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  targetDonors: number;
  currentRegistered: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface DonationRecord {
  id?: string;
  hospitalId: string;
  donorId: string;
  userId: string;
  donationDate: Date;
  bloodType: string;
  quantity: number; // in units
  status: 'collected' | 'processed' | 'available' | 'used';
  eventId?: string; // optional, if part of an event
  recipientId?: string; // optional, if allocated to a specific recipient
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface DonationAlert {
  id?: string;
  userId: string;
  donorId?: string;
  hospitalId: string;
  donationRecordId: string;
  message: string;
  type: 'collection' | 'status_update' | 'usage';
  status: 'unread' | 'read';
  createdAt?: Timestamp;
}

// Collection references
const hospitalsCollection = collection(db, 'hospitals');
const hospitalInventoryCollection = collection(db, 'hospitalInventory');
const donationEventsCollection = collection(db, 'donationEvents');
const donationRecordsCollection = collection(db, 'donationRecords');
const donationAlertsCollection = collection(db, 'donationAlerts');

export const hospitalService = {
  // Hospital Profile Management
  getHospitalById: async (id: string): Promise<HospitalProfile | null> => {
    try {
      const docRef = doc(db, 'hospitals', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as HospitalProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting hospital profile:", error);
      throw error;
    }
  },
  
  getHospitalByUserId: async (userId: string): Promise<HospitalProfile | null> => {
    try {
      const q = query(hospitalsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const hospitalDoc = querySnapshot.docs[0];
        return { id: hospitalDoc.id, ...hospitalDoc.data() } as HospitalProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting hospital by user ID:", error);
      throw error;
    }
  },
  
  getAllHospitals: async (): Promise<HospitalProfile[]> => {
    try {
      const querySnapshot = await getDocs(hospitalsCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as HospitalProfile));
    } catch (error) {
      console.error("Error getting all hospitals:", error);
      throw error;
    }
  },
  
  registerHospital: async (hospitalData: Omit<HospitalProfile, 'id'>): Promise<string> => {
    try {
      // Add timestamps and set verification to false by default
      const hospitalWithTimestamps = {
        ...hospitalData,
        isVerified: false,
        registrationDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(hospitalsCollection, hospitalWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error("Error registering hospital:", error);
      throw error;
    }
  },
  
  updateHospitalProfile: async (id: string, hospitalData: Partial<HospitalProfile>): Promise<void> => {
    try {
      const docRef = doc(db, 'hospitals', id);
      
      const updatedData = {
        ...hospitalData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error("Error updating hospital profile:", error);
      throw error;
    }
  },
  
  // Hospital Blood Inventory Management
  getHospitalInventory: async (hospitalId: string): Promise<HospitalBloodInventory[]> => {
    try {
      const q = query(
        hospitalInventoryCollection, 
        where("hospitalId", "==", hospitalId)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as HospitalBloodInventory));
    } catch (error) {
      console.error("Error getting hospital inventory:", error);
      throw error;
    }
  },
  
  updateInventoryItem: async (id: string, data: Partial<HospitalBloodInventory>): Promise<void> => {
    try {
      const docRef = doc(db, 'hospitalInventory', id);
      
      const updatedData = {
        ...data,
        lastUpdated: serverTimestamp()
      };
      
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error("Error updating inventory item:", error);
      throw error;
    }
  },
  
  deleteInventoryItem: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'hospitalInventory', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      throw error;
    }
  },
  
  // Blood Donation Events
  createDonationEvent: async (eventData: Omit<BloodDonationEvent, 'id'>): Promise<string> => {
    try {
      const eventWithTimestamps = {
        ...eventData,
        currentRegistered: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(donationEventsCollection, eventWithTimestamps);
      return docRef.id;
    } catch (error) {
      console.error("Error creating donation event:", error);
      throw error;
    }
  },
  
  getHospitalEvents: async (hospitalId: string): Promise<BloodDonationEvent[]> => {
    try {
      // Remove the sorting by eventDate to avoid requiring a composite index
      const q = query(
        donationEventsCollection, 
        where("hospitalId", "==", hospitalId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Map the data and sort in memory
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          eventDate: data.eventDate?.toDate() || new Date(),
        } as BloodDonationEvent;
      }).sort((a, b) => {
        // Sort by eventDate in descending order (newest first)
        return b.eventDate.getTime() - a.eventDate.getTime();
      });
    } catch (error) {
      console.error("Error getting hospital events:", error);
      throw error;
    }
  },
  
  getUpcomingEvents: async (): Promise<BloodDonationEvent[]> => {
    try {
      const now = new Date();
      
      // Remove the sorting by eventDate to avoid requiring a composite index
      const q = query(
        donationEventsCollection, 
        where("status", "in", ["upcoming", "active"])
      );
      
      const querySnapshot = await getDocs(q);
      
      // Map, filter, and sort the data in memory
      return querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            eventDate: data.eventDate?.toDate() || new Date(),
          } as BloodDonationEvent;
        })
        .filter(event => event.eventDate >= now)
        .sort((a, b) => {
          // Sort by eventDate in ascending order (closest upcoming first)
          return a.eventDate.getTime() - b.eventDate.getTime();
        });
    } catch (error) {
      console.error("Error getting upcoming events:", error);
      throw error;
    }
  },
  
  // Donation Records
  recordDonation: async (donationData: Omit<DonationRecord, 'id'>): Promise<string> => {
    try {
      const donationWithTimestamps = {
        ...donationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(donationRecordsCollection, donationWithTimestamps);
      
      // Create alert for the donor
      await addDoc(donationAlertsCollection, {
        userId: donationData.userId,
        donorId: donationData.donorId,
        hospitalId: donationData.hospitalId,
        donationRecordId: docRef.id,
        message: `Your blood donation was received by ${donationData.hospitalId}`,
        type: 'collection',
        status: 'unread',
        createdAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error recording donation:", error);
      throw error;
    }
  },
  
  getDonationsByHospital: async (hospitalId: string): Promise<DonationRecord[]> => {
    try {
      // Remove the sorting by donationDate to avoid requiring a composite index
      const q = query(
        donationRecordsCollection, 
        where("hospitalId", "==", hospitalId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Map the data and sort in memory
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          donationDate: data.donationDate?.toDate() || new Date(),
        } as DonationRecord;
      }).sort((a, b) => {
        // Sort by donationDate in descending order (newest first)
        return b.donationDate.getTime() - a.donationDate.getTime();
      });
    } catch (error) {
      console.error("Error getting hospital donations:", error);
      throw error;
    }
  },
  
  getDonationsByDonor: async (donorId: string): Promise<DonationRecord[]> => {
    try {
      // Remove the sorting by donationDate to avoid requiring a composite index
      const q = query(
        donationRecordsCollection, 
        where("donorId", "==", donorId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Map the data and sort in memory
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          donationDate: data.donationDate?.toDate() || new Date(),
        } as DonationRecord;
      }).sort((a, b) => {
        // Sort by donationDate in descending order (newest first)
        return b.donationDate.getTime() - a.donationDate.getTime();
      });
    } catch (error) {
      console.error("Error getting donor donations:", error);
      throw error;
    }
  },
  
  updateDonationStatus: async (id: string, status: DonationRecord['status'], notes?: string): Promise<void> => {
    try {
      const docRef = doc(db, 'donationRecords', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error("Donation record not found");
      }
      
      const donationData = docSnap.data() as DonationRecord;
      
      await updateDoc(docRef, {
        status,
        notes: notes || donationData.notes,
        updatedAt: serverTimestamp()
      });
      
      // Create alert for the donor about status update
      await addDoc(donationAlertsCollection, {
        userId: donationData.userId,
        donorId: donationData.donorId,
        hospitalId: donationData.hospitalId,
        donationRecordId: id,
        message: `Your blood donation status has been updated to: ${status}`,
        type: 'status_update',
        status: 'unread',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating donation status:", error);
      throw error;
    }
  },
  
  // User Alerts
  getUserAlerts: async (userId: string): Promise<DonationAlert[]> => {
    try {
      // Remove the sorting by createdAt to avoid requiring a composite index
      const q = query(
        donationAlertsCollection, 
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Sort the results in memory
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DonationAlert)).sort((a, b) => {
        // Sort by createdAt in descending order (newest first)
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error("Error getting user alerts:", error);
      throw error;
    }
  },
  
  markAlertAsRead: async (alertId: string): Promise<void> => {
    try {
      const docRef = doc(db, 'donationAlerts', alertId);
      await updateDoc(docRef, {
        status: 'read'
      });
    } catch (error) {
      console.error("Error marking alert as read:", error);
      throw error;
    }
  }
}; 