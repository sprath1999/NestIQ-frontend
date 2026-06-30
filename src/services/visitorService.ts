import axiosInstance from "./axiosInstance";

export const visitorService = {
  preApproveVisitor: async (payload: any) => {
    const response = await axiosInstance.post("/visitors/pre-approve", payload);
    return response.data;
  },

  logEntry: async (payload: any) => {
    const response = await axiosInstance.post("/visitors/entry", payload);
    return response.data;
  },

  logExit: async (id: number) => {
    const response = await axiosInstance.put(`/visitors/${id}/exit`);
    return response.data;
  },

  getMyVisitors: async () => {
    const response = await axiosInstance.get("/visitors/my");
    return response.data;
  },

  getAllVisitors: async () => {
    const response = await axiosInstance.get("/visitors");
    return response.data;
  },

  getVisitorsInside: async () => {
    const response = await axiosInstance.get("/visitors/inside");
    return response.data;
  },

  getPreApprovedVisitors: async () => {
    const response = await axiosInstance.get("/visitors/pre-approved");
    return response.data;
  },

  logParcel: async (payload: any) => {
    const response = await axiosInstance.post("/visitors/parcels", payload);
    return response.data;
  },

  getMyParcels: async () => {
    const response = await axiosInstance.get("/visitors/parcels/my");
    return response.data;
  },

  getAllParcels: async () => {
    const response = await axiosInstance.get("/visitors/parcels");
    return response.data;
  },

  getUncollectedParcels: async () => {
    const response = await axiosInstance.get("/visitors/parcels/uncollected");
    return response.data;
  },

  markParcelCollected: async (id: number) => {
    const response = await axiosInstance.put(`/visitors/parcels/${id}/collect`);
    return response.data;
  },
};
