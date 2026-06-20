import axiosInstance from "./axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "RESIDENT" | "GUARD";
  flatNumber?: string;
  phone: string;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await axiosInstance.post("/auth/login", payload);
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await axiosInstance.post("/auth/register", payload);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post("/auth/refresh-token");
    return response.data;
  },
};
