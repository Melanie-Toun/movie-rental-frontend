import axios from 'axios';
import toast from 'react-hot-toast';
import {create} from 'zustand';

export const useAuthStore = create((set, get) => ({
    // Original state
    user: null,
    isSigningUp: false,
    isCheckingAuth: true,
    isLoggingOut: false,
    isLoggingIn: false,
    isAuthenticated: false,
    isLoading: true,
    
    // Original functions
    signup: async (credentials) => {
        set({isSigningUp: true});
        try {
            const response = await axios.post("/api/auth/signup", credentials);
            set({
                user: response.data.user, 
                isSigningUp: false,
                isAuthenticated: true,
                isLoading: false
            });
            toast.success("Account Created successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Signup failed");
            set({
                isSigningUp: false, 
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },
    
    login: async (credentials) => {
        set({isLoggingIn: true});
        try {
            const response = await axios.post("/api/auth/login", credentials);
            set({
                user: response.data.user, 
                isLoggingIn: false,
                isAuthenticated: true,
                isLoading: false
            });
            toast.success("Log In successful");
        } catch (error) {
            set({
                isLoggingIn: false, 
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
            toast.error(error.response.data.message || "Login failed");
        }
    },
    
    logout: async () => {
        set({isLoggingOut: true});
        try {
            await axios.post("/api/auth/logout");
            set({
                user: null, 
                isLoggingOut: false,
                isAuthenticated: false,
                isLoading: false
            });
            toast.success("Logged out successfully");
            
        } catch (error) {
            set({isLoggingOut: false});
            toast.error(error.response.data.message || "Logout failed");
        }
    },
    
    authCheck: async () => {
        set({isCheckingAuth: true, isLoading: true});
        try {
            const response = await axios.get("/api/auth/authCheck");
            set({
                user: response.data.user, 
                isCheckingAuth: false,
                isAuthenticated: !!response.data.user,
                isLoading: false
            });
        } catch (error) {
            set({
                isCheckingAuth: false, 
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },
    
    isAdmin: () => get().user?.isAdmin ?? false,
    isVip: () => get().user?.isVip ?? false,
    
    // New functions from option 2
    setUser: (userData) => set({ 
        user: userData, 
        isAuthenticated: !!userData,
        isLoading: false 
    }),
    
    updateUser: (updatedUserData) => set((state) => ({
        user: { ...state.user, ...updatedUserData }
    })),
    
    clearUser: () => set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
    }),
    
    setLoading: (loadingState) => set({ 
        isLoading: loadingState 
    })
}));