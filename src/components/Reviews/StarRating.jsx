import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authUser';

const StarRating = ({ mediaType, mediaId, onRatingUpdate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userRated, setUserRated] = useState(false);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUserRating();
    }
  }, [user, mediaId, mediaType, isAuthenticated]);

  const fetchUserRating = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/reviews/ratings/user/${mediaType}/${mediaId}`
      );
      
      if (response.data.rating) {
        setRating(response.data.rating.value);
        setUserRated(true);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (value) => {
    if (!user) {
      toast.error('Please login to rate');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        '/api/reviews/ratings',
        {
          mediaType,
          mediaId,
          value
        }
      );
      
      setRating(value);
      setUserRated(true);
      
      // Notify parent component of rating update
      if (onRatingUpdate) {
        onRatingUpdate(response.data.averageRating);
      }
      
      toast.success('Rating submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting rating');
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRating = async () => {
    if (!userRated) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(
        `/api/reviews/ratings/${mediaType}/${mediaId}`
      );
      
      setRating(0);
      setUserRated(false);
      
      // Notify parent component of rating update
      if (onRatingUpdate) {
        onRatingUpdate(response.data.averageRating);
      }
      
      toast.success('Rating removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing rating');
      console.error('Error removing rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              type="button"
              key={index}
              className={`bg-transparent border-none cursor-pointer text-2xl transition-colors duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => !loading && handleRating(ratingValue)}
              onMouseEnter={() => !loading && setHover(ratingValue)}
              onMouseLeave={() => !loading && setHover(0)}
              disabled={loading}
            >
              {ratingValue <= (hover || rating) ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-yellow-400" />
              )}
            </button>
          );
        })}
      </div>
      
      {userRated && (
        <button
          onClick={handleRemoveRating}
          disabled={loading}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Remove rating
        </button>
      )}
      
      {!user && (
        <p className="text-sm text-gray-400 mt-1">Login to rate</p>
      )}
    </div>
  );
};

export default StarRating;