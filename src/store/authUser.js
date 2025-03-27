import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://movie-rental-backend-0bcb.onrender.com";

export const useAuthStore = create((set, get) => ({
  // Original state
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  isAuthenticated: false,
  isLoading: true,

  // Signup function with backend URL
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, credentials, {
        withCredentials: true, // Ensure cookies (if any) are included
      });
      set({
        user: response.data.user,
        isSigningUp: false,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success("Account Created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      set({
        isSigningUp: false,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Login function with backend URL
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials, {
        withCredentials: true,
      });
      set({
        user: response.data.user,
        isLoggingIn: false,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success("Log In successful");
    } catch (error) {
      set({
        isLoggingIn: false,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  // Logout function with backend URL
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      set({
        user: null,
        isLoggingOut: false,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      set({ isLoggingOut: false });
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // Auth Check function with backend URL
  authCheck: async () => {
    set({ isCheckingAuth: true, isLoading: true });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/authCheck`, { withCredentials: true });
      set({
        user: response.data.user,
        isCheckingAuth: false,
        isAuthenticated: !!response.data.user,
        isLoading: false,
      });
    } catch (error) {
      set({
        isCheckingAuth: false,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  isAdmin: () => get().user?.isAdmin ?? false,
  isVip: () => get().user?.isVip ?? false,

  // Additional helper functions
  setUser: (userData) =>
    set({
      user: userData,
      isAuthenticated: !!userData,
      isLoading: false,
    }),

  updateUser: (updatedUserData) =>
    set((state) => ({
      user: { ...state.user, ...updatedUserData },
    })),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (loadingState) => set({ isLoading: loadingState }),
}));
