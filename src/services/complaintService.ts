import axiosInstance from "./axiosInstance";

export interface ComplaintRequest {
  title: string;
  description: string;
  category: string;
}

export interface ComplaintResponse {
  id: number;
  residentId: number;
  residentName: string;
  flatNumber: string;
  title: string;
  description: string;
  category: string;
  status: string;
  assignedTo: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export const complaintService = {
  createComplaint: async (payload: ComplaintRequest) => {
    const response = await axiosInstance.post("/complaints", payload);
    return response.data;
  },

  getMyComplaints: async () => {
    const response = await axiosInstance.get("/complaints/my");
    return response.data;
  },

  getAllComplaints: async () => {
    const response = await axiosInstance.get("/complaints");
    return response.data;
  },

  getComplaintById: async (id: number) => {
    const response = await axiosInstance.get(`/complaints/${id}`);
    return response.data;
  },

  updateComplaint: async (
    id: number,
    payload: { status?: string; assignedTo?: string; resolutionNote?: string },
  ) => {
    const response = await axiosInstance.put(`/complaints/${id}`, payload);
    return response.data;
  },

  deleteComplaint: async (id: number) => {
    const response = await axiosInstance.delete(`/complaints/${id}`);
    return response.data;
  },
};
