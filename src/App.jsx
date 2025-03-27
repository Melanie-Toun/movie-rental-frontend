
import {  Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import WatchPage from "./pages/WatchPage";
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import AdminPage from "./pages/admin/AdminPage";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminManagement from "./pages/admin/AdminManagement";
import MediaShowcase from "./components/MediaShowcase";
import Payment from "./pages/payment/Payment";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentVerification from "./pages/payment/PaymentVerification";
// import Admin from "./pages/admin/Admin";
import Footer from "./pages/home/Footer";
import RentalDetails from "./pages/admin/RentalDetails";
import UpdateProfile from "./pages/profile/UpdateProfile";
// import MediaGrid from "./components/MediaType/MediaGrid";
import MoviesGrid from "./components/MediaType/MoviesGrid";
import MediaDetail from "./components/MediaType/MediaDetail";
import TVShowsGrid from "./components/MediaType/TvShowsGrid";
import MediaSearch from "./components/MediaSearch";
import SearchHistory from "./pages/SearchHistory";
import SearchWallpaper from "./components/SearchWallpaper";

function App() {
  const { isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if(isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center h-full bg-black">
          <Loader className="animate-spin text-red-600 size-10"/>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicOnlyRoute>
              <SignUpPage />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <SearchWallpaper>
              <MediaSearch />
              </SearchWallpaper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <SearchHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/watch/:id" 
          element={
            <ProtectedRoute>
              <WatchPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/browse" 
          element={
            <ProtectedRoute>
              <MediaShowcase />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies" 
          element={
            <ProtectedRoute>
              <MoviesGrid />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies/:id" 
          element={
            <ProtectedRoute>
              <MediaDetail />
            </ProtectedRoute>
          } 
        />
        
        {/* TV Shows routes */}
        <Route 
          path="/tvshows" 
          element={
            <ProtectedRoute>
              <TVShowsGrid />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tvshows/:id" 
          element={
            <ProtectedRoute>
              <MediaDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment/success" 
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/verify-payment" 
          element={
            <ProtectedRoute>
              <PaymentVerification />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <AdminRoute>              
              <AdminPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin-panel" 
          element={
            <AdminRoute>              
              <AdminPanel/>
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin-manage" 
          element={
            <AdminRoute>              
              <AdminManagement/>
            </AdminRoute>
          } 
        />
        <Route 
          path="/rental-details" 
          element={
            <AdminRoute>              
              <RentalDetails/>
            </AdminRoute>
          } 
        />
      </Routes>
      <Toaster/>
      <Footer/>
    </>
  )
}

export default App