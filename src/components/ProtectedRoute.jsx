import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

// this is your protected route for logged-in users
export const ProtectedRoute = ({ children }) => {
    const user = useAuthStore(state => state.user);
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

// This is your protected route specifically for admin users
export const AdminRoute = ({ children }) => {
    const user = useAuthStore(state => state.user);
    const isAdmin = useAuthStore(state => state.isAdmin());
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    // Check if user is either admin or VIP
    if (!isAdmin && !user.isVip) {
        return <Navigate to="/" />;
    }
    
    return children;
};

// Route for admin users only (keeping strict admin-only route if needed)
export const StrictAdminRoute = ({ children }) => {
    const user = useAuthStore(state => state.user);
    const isAdmin = useAuthStore(state => state.isAdmin());
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (!isAdmin) {
        return <Navigate to="/" />;
    }
    
    return children;
};


export const PublicOnlyRoute = ({ children }) => {
    const user = useAuthStore(state => state.user);
    
    if (user) {
        return <Navigate to="/" />;
    }
    
    return children;
};