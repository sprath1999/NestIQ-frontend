import axios from "axios";

const AUTH_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

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
    const response = await axios.post(`${AUTH_BASE_URL}/auth/login`, payload);
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await axios.post(
      `${AUTH_BASE_URL}/auth/register`,
      payload,
    );
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${AUTH_BASE_URL}/auth/logout`);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axios.post(`${AUTH_BASE_URL}/auth/refresh-token`);
    return response.data;
  },
};
