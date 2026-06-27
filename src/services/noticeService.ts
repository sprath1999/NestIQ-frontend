import axiosInstance from "./axiosInstance";

export const noticeService = {
  getAllNotices: async () => {
    const response = await axiosInstance.get("/notices");
    return response.data;
  },

  createNotice: async (payload: {
    title: string;
    content: string;
    category: string;
    pinned: boolean;
  }) => {
    const response = await axiosInstance.post("/notices", payload);
    return response.data;
  },

  updateNotice: async (
    id: number,
    payload: {
      title: string;
      content: string;
      category: string;
      pinned: boolean;
    },
  ) => {
    const response = await axiosInstance.put(`/notices/${id}`, payload);
    return response.data;
  },

  deleteNotice: async (id: number) => {
    const response = await axiosInstance.delete(`/notices/${id}`);
    return response.data;
  },
};
