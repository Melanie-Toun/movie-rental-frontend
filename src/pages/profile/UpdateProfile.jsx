import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authUser';
import moment from 'moment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { Heart, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { uploadMedia } from '@/utils/cloudinary';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const navigate = useNavigate();
  
  const [rentals, setRentals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    image: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarOptions, setAvatarOptions] = useState([
    "/avatar1.png", "/avatar2.png", "/avatar3.png"
  ]);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  
  // Pagination state for favorites
  const [currentPage, setCurrentPage] = useState(1);
  const favoritesPerPage = 6;

  // Pagination states
  const [currentRentalPage, setCurrentRentalPage] = useState(1);
  const [rentalsPerPage] = useState(5);
  
  // Total pages calculation
  const totalRentalPages = Math.ceil(rentals.length / rentalsPerPage);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        image: user.image || ''
      }));
      setSelectedAvatar(user.image || '');
      fetchRentals();
      fetchFavorites();
    }
  }, [user]);

  console.log("goodluck", user)

  const fetchRentals = async () => {
    try {
      const response = await fetch('/api/auth/rentals', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setRentals(data.rentals);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };
  
  const fetchFavorites = async () => {
    try {
      // Changed from /favorites to /favourites as requested
      const response = await fetch('/api/favourites/user', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveFavorite = async (mediaType, mediaId) => {
    try {
      // Changed from /favorites to /favourites as requested
      const response = await fetch(`/api/favourites/${mediaType}/${mediaId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        // Update the favorites list by removing the deleted item
        setFavorites(prevFavorites => 
          prevFavorites.filter(fav => 
            !(fav.mediaType === mediaType && fav.mediaId === mediaId)
          )
        );
        setMessage({ type: 'success', text: 'Removed from favorites' });
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      setMessage({ type: 'error', text: 'Failed to remove from favorites' });
    }
  };
  
  const handleViewMedia = (mediaType, mediaId) => {
    const path = mediaType === 'movie' ? '/movies' : '/tvshows';
    navigate(`${path}/${mediaId}`);
  };
  
  const updateUsername = async () => {
    if (!formData.username.trim()) {
      setMessage({ type: 'error', text: 'Username cannot be empty' });
      return;
    }
  
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username }),
        credentials: 'include'
      });
  
      const data = await response.json();
      
      if (data.success) {
        updateUser({ username: formData.username });
        setMessage({ type: 'success', text: 'Username updated successfully' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update username' });
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating username' });
    }
  };
  
  const updateAvatar = async () => {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: formData.image }),
        credentials: 'include'
      });
  
      const data = await response.json();
      
      if (data.success) {
        updateUser({ image: formData.image });
        setMessage({ type: 'success', text: 'Avatar updated successfully' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update avatar' });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating avatar' });
    }
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }
    
    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }
    
    try {
      setUploading(true);
      setMessage({ type: 'info', text: 'Uploading image...' });
      
      // Upload image to Cloudinary
      const imageUrl = await uploadMedia(file);
      
      // Update formData with the new image URL
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setSelectedAvatar(imageUrl);
      
      // Automatically update the profile with the new image
      await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl }),
        credentials: 'include'
      }).then(res => res.json())
        .then(data => {
          if (data.success) {            
            updateUser({ image: imageUrl });
            setMessage({ type: 'success', text: 'Profile picture updated successfully' });
          } else {
            setMessage({ type: 'error', text: data.message || 'Failed to update profile picture' });
          }
        });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const updatePassword = async () => {
    // Password validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'All password fields are required' });
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
  
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
  
    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentPassword: formData.currentPassword, 
          newPassword: formData.newPassword 
        }),
        credentials: 'include'
      });
  
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating password' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarPath) => {
    setSelectedAvatar(avatarPath);
    setFormData(prev => ({ ...prev, image: avatarPath }));
  };

  const getRentalStatus = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    return now <= end ? 'Active' : 'Expired';
  };
  
  // Updated date formatting function using moment.js instead of date-fns
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      // Use moment to parse and format the date
      const date = moment(dateString);
      if (date.isValid()) {
        return date.format('MMMM YYYY');
      }
      return 'Unknown';
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Unknown';
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  // Pagination logic for favorites
  const indexOfLastFavorite = currentPage * favoritesPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;
  const currentFavorites = favorites.slice(indexOfFirstFavorite, indexOfLastFavorite);
  const totalPages = Math.ceil(favorites.length / favoritesPerPage);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

     // Pagination handlers
     const handleRentalPageChange = (pageNumber) => {
      if (pageNumber < 1 || pageNumber > totalRentalPages) return;
      setCurrentRentalPage(pageNumber);
    };
  
  
    // Get current page items
    const indexOfLastRental = currentRentalPage * rentalsPerPage;
    const indexOfFirstRental = indexOfLastRental - rentalsPerPage;
    const currentRentals = rentals.slice(indexOfFirstRental, indexOfLastRental);
  
  
    // Generate page numbers
    const generatePageNumbers = (currentPage, totalPages) => {
      const pageNumbers = [];
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      
      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      return pageNumbers;
    };
  
    const rentalPageNumbers = generatePageNumbers(currentRentalPage, totalRentalPages);
  
    // Pagination component
    const Pagination = ({ currentPage, totalPages, pageNumbers, onPageChange }) => {
      return (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {pageNumbers.map((number) => (
            <Button 
              key={number}
              variant={currentPage === number ? "default" : "outline"} 
              size="sm"
              onClick={() => onPageChange(number)}
            >
              {number}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      );
    };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <button onClick={handleGoBack} className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Go Back
          </button>
        </div>
        
        {message.text && (
          <div className={`p-4 mb-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 
            message.type === 'info' ? 'bg-blue-100 text-blue-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - User Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={user.image} alt={user.username} />
                  <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user.username}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Favorites Section with Pagination */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Your Favorites</span>
                {favorites.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Heart className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                  <p>You haven't added any favorites yet.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {currentFavorites.map((favorite) => (
                      <div 
                        key={`${favorite.mediaType}-${favorite.mediaId}`}
                        className="relative group overflow-hidden rounded-lg shadow-md bg-gray-100"
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => handleViewMedia(favorite.mediaType, favorite.mediaId)}
                        >
                          <div className="aspect-[2/3] relative">
                            <img 
                              src={favorite.posterPath || '/placeholder-image.jpg'} 
                              alt={favorite.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-center font-medium px-2">{favorite.title}</p>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveFavorite(favorite.mediaType, favorite.mediaId)}
                          aria-label="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                          <span className="text-xs text-white capitalize">
                            {favorite.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={goToPreviousPage} 
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <span className="text-sm">
                        {currentPage} / {totalPages}
                      </span>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={goToNextPage} 
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Rental History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Rental History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRentals.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-gray-500">
                            No rental history
                          </td>
                        </tr>
                      ) : (
                        currentRentals.map((rental) => (
                          <tr key={rental.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{rental.title}</td>
                            <td className="px-4 py-2">
                              <span className="capitalize">{rental.mediaType}</span>
                            </td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                getRentalStatus(rental.rentalEndDate) === 'Active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {getRentalStatus(rental.rentalEndDate)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {totalRentalPages > 1 && (
                    <Pagination 
                      currentPage={currentRentalPage}
                      totalPages={totalRentalPages}
                      pageNumbers={rentalPageNumbers}
                      onPageChange={handleRentalPageChange}
                    />
                  )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - Edit Forms */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Edit Username</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter new username"
                  />
                </div>
                <Button onClick={updateUsername}>Update Username</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Upload Custom Avatar</Label>
                <div className="mt-2 flex flex-col items-center">
                  {selectedAvatar && selectedAvatar.startsWith('http') && (
                    <div className="mb-4">
                      <Avatar className="w-20 h-20 mx-auto mb-2">
                        <AvatarImage src={selectedAvatar} alt="Custom avatar" />
                        <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-center text-gray-500">Current custom avatar</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    onClick={triggerFileInput} 
                    variant="outline" 
                    disabled={uploading}
                    className="w-full mb-4"
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <Label>Or Choose Preset Avatar</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {avatarOptions.map((avatar, index) => (
                    <div 
                      key={index} 
                      className={`cursor-pointer p-2 rounded-md ${selectedAvatar === avatar ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'}`}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      <Avatar className="w-16 h-16 mx-auto">
                        <AvatarImage src={avatar} alt={`Avatar option ${index + 1}`} />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={updateAvatar} 
                disabled={uploading || (selectedAvatar === user.image)}
                className="w-full"
              >
                Update Avatar
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button onClick={updatePassword}>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;