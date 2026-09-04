import axiosInstance from "./axiosInstance";

export const flatService = {
  lookupFlat: async (flatNumber: string) => {
    const response = await axiosInstance.get(`/flats/lookup/${flatNumber}`);
    return response.data;
  },

  getAllFlats: async () => {
    const response = await axiosInstance.get("/flats");
    return response.data;
  },

  createFlat: async (payload: {
    flatNumber: string;
    block: string;
    type: string;
    residentId?: number;
    residentName?: string;
    residentEmail?: string;
    residentPhone?: string;
  }) => {
    const response = await axiosInstance.post("/flats", payload);
    return response.data;
  },

  updateFlat: async (id: number, payload: any) => {
    const response = await axiosInstance.put(`/flats/${id}`, payload);
    return response.data;
  },

  deleteFlat: async (id: number) => {
    const response = await axiosInstance.delete(`/flats/${id}`);
    return response.data;
  },
};
