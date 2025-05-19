import axiosInstance from './axios';

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  quantity: number;
  requestDate: string;
  requiredDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled';
  hospitalName: string;
  contactPerson: string;
  contactNumber: string;
  reason: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  userId: string;
}

export const requestService = {
  getAllRequests: async (): Promise<BloodRequest[]> => {
    return await axiosInstance.get('/requests');
  },
  
  getRequestById: async (id: string): Promise<BloodRequest> => {
    return await axiosInstance.get(`/requests/${id}`);
  },
  
  createRequest: async (requestData: Omit<BloodRequest, 'id' | 'requestDate' | 'status'>): Promise<BloodRequest> => {
    return await axiosInstance.post('/requests', requestData);
  },
  
  updateRequest: async (id: string, requestData: Partial<BloodRequest>): Promise<BloodRequest> => {
    return await axiosInstance.put(`/requests/${id}`, requestData);
  },
  
  deleteRequest: async (id: string): Promise<void> => {
    return await axiosInstance.delete(`/requests/${id}`);
  },
  
  approveRequest: async (id: string): Promise<BloodRequest> => {
    return await axiosInstance.put(`/requests/${id}/approve`);
  },
  
  rejectRequest: async (id: string, reason: string): Promise<BloodRequest> => {
    return await axiosInstance.put(`/requests/${id}/reject`, { reason });
  },
  
  fulfillRequest: async (id: string): Promise<BloodRequest> => {
    return await axiosInstance.put(`/requests/${id}/fulfill`);
  },
  
  cancelRequest: async (id: string, reason: string): Promise<BloodRequest> => {
    return await axiosInstance.put(`/requests/${id}/cancel`, { reason });
  }
}; 