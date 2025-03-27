import React, { useState } from 'react';
import StarRating from './StarRating'; 
import Comments from './Comments'; 

const MediaReviews = ({ mediaType, mediaId, initialRating = 0 }) => {
  const [averageRating, setAverageRating] = useState(initialRating);
  
  // Format media type for API calls (lowercase and singular)
  const formattedMediaType = mediaType === 'movies' ? 'movie' : 'tvshow';
  
  // Handler for when rating is updated
  const handleRatingUpdate = (newAverageRating) => {
    setAverageRating(newAverageRating);
  };

  return (
    <div className="bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-white">Rate this {mediaType === 'movies' ? 'Movie' : 'TV Show'}</h3>
                <p className="text-gray-400 text-sm">Share your opinion with other users</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {averageRating > 0 ? averageRating.toFixed(1) : '-'} <span className="text-yellow-400">★</span>
                </div>
                <StarRating 
                  mediaType={formattedMediaType} 
                  mediaId={mediaId} 
                  onRatingUpdate={handleRatingUpdate} 
                />
              </div>
            </div>
          </div>
          
          {/* Comments Section */}
          <Comments mediaType={formattedMediaType} mediaId={mediaId} />
        </div>
      </div>
    </div>
  );
};

export default MediaReviews;