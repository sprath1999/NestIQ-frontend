import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RESIDENT" | "GUARD";
  flatNumber?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const loadFromStorage = (): Partial<AuthState> => {
  try {
    const user = localStorage.getItem("nestiq_user");
    const accessToken = localStorage.getItem("nestiq_token");
    if (user && accessToken) {
      return {
        user: JSON.parse(user),
        accessToken,
        isAuthenticated: true,
      };
    }
  } catch (e) {}
  return {};
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  ...loadFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("nestiq_user", JSON.stringify(action.payload.user));
      localStorage.setItem("nestiq_token", action.payload.accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("nestiq_user");
      localStorage.removeItem("nestiq_token");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
