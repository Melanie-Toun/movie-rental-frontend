// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { ChevronLeft, User } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useAuthStore } from '@/store/authUser';
// import MediaReviews from '../Reviews/MediaReviews';

// const MediaDetail = () => {
//   const user = useAuthStore(state => state.user);
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [mediaItem, setMediaItem] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Extract type from pathname (movies or tvshows)
//   const type = location.pathname.split('/')[1];

//   useEffect(() => {
//     // First try to use the media item passed through location state
//     if (location.state?.media) {
//       setMediaItem(location.state.media);
//       setIsLoading(false);
//       return;
//     }

//     // Otherwise, fetch the media item from the API
//     const fetchMediaDetail = async () => {
//       setIsLoading(true);
//       try {
//         const endpoint = type === 'movies' 
//           ? `/api/admin/movies/${id}` 
//           : `/api/admin/tvshows/${id}`;
        
//         const response = await fetch(endpoint);
//         const data = await response.json();
        
//         if (data.success) {
//           setMediaItem(type === 'movies' ? data.movie : data.tvShow);
//         }
//       } catch (error) {
//         console.error(`Error fetching ${type} details:`, error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMediaDetail();
//   }, [id, type, location.state]);

//   const goBack = () => {
//     navigate(`/${type}`);
//   };

//   const handleRentClick = () => {
//     if (!user) {
//       navigate('/login');
//     } else {
//       // Store the selected media for retrieval after payment
//       localStorage.setItem('lastPaidMedia', JSON.stringify(mediaItem));
//       navigate('/payment', { state: { media: mediaItem } });
//     }
//   };


//   const formatPrice = (price) => {
//     return price ? `₦${Number(price).toFixed(2)}` : '₦0.00';
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
//       </div>
//     );
//   }

//   if (!mediaItem) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <h2 className="text-2xl mb-4">Media not found</h2>
//           <Button variant="outline" onClick={goBack} className="border-gray-500 text-white">
//             <ChevronLeft className="h-5 w-5 mr-2" /> Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Separate cast members by role
//   const directors = mediaItem.cast?.filter(person => person.role.toLowerCase() === 'director') || [];
//   const actors = mediaItem.cast?.filter(person => person.role.toLowerCase() === 'actor') || [];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-8">
//       <div className="container mx-auto px-4">
//         <Button onClick={goBack} className="mb-6 border-gray-500 text-white">
//           <ChevronLeft className="h-5 w-5 mr-2" /> Back to {type === 'movies' ? 'Movies' : 'TV Shows'}
//         </Button>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="md:col-span-1">
//             <div className="rounded-lg overflow-hidden">
//               <img 
//                 src={mediaItem.posterPath || '/placeholder-image.jpg'} 
//                 alt={mediaItem.title} 
//                 className="w-full h-auto object-cover"
//               />
//             </div>
//           </div>
          
//           <div className="md:col-span-2">
//             <h1 className="text-3xl font-bold mb-2">{mediaItem.title}</h1>
            
//             <div className="flex items-center mb-4 text-gray-300">
//               {type === 'movies' ? (
//                 <span>{mediaItem.releaseDate ? new Date(mediaItem.releaseDate).getFullYear() : 'N/A'} {mediaItem.runtime ? `• ${mediaItem.runtime} min` : ''}</span>
//               ) : (
//                 <span>{mediaItem.firstAirDate ? new Date(mediaItem.firstAirDate).getFullYear() : 'N/A'} {mediaItem.numberOfSeasons ? `• ${mediaItem.numberOfSeasons} Season${mediaItem.numberOfSeasons !== 1 ? 's' : ''}` : ''}</span>
//               )}
              
//               {mediaItem.rating && (
//                 <span className="ml-4 bg-yellow-600 text-white px-2 py-1 rounded text-sm">
//                   ★ {mediaItem.rating.toFixed(1)}
//                 </span>
//               )}
//             </div>

//             <div className="mb-6">
//               <p className="text-xl font-semibold text-green-500 mb-2">
//                 Rent for {formatPrice(mediaItem.rentPrice)}
//               </p>
//               <Button 
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 onClick={handleRentClick}
//               >
//                 Rent Now
//               </Button>
//             </div>
            
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold mb-2">Overview</h3>
//               <p className="text-gray-300">{mediaItem.overview}</p>
//             </div>
            
//             {mediaItem.genres && mediaItem.genres.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="text-xl font-semibold mb-2">Genres</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {mediaItem.genres.map((genre, index) => (
//                     <span key={index} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
//                       {genre}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Cast Section - Replaces the Trailer section */}
//             <div className="mt-8">
//               <h3 className="text-xl font-semibold mb-4">Cast & Crew</h3>
              
//               {/* Directors Section */}
//               {directors.length > 0 && (
//                 <div className="mb-6">
//                   <h4 className="text-lg font-medium text-gray-300 mb-3">Director{directors.length > 1 ? 's' : ''}</h4>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                     {directors.map((director, index) => (
//                       <div key={index} className="flex flex-col items-center text-center">
//                         <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-2 overflow-hidden">
//                           {director.profilePath ? (
//                             <img 
//                               src={director.profilePath} 
//                               alt={director.name} 
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <User className="h-8 w-8 text-gray-400" />
//                           )}
//                         </div>
//                         <p className="font-medium">{director.name}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
              
//               {/* Actors Section */}
//               {actors.length > 0 && (
//                 <div>
//                   <h4 className="text-lg font-medium text-gray-300 mb-3">Actors</h4>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                     {actors.map((actor, index) => (
//                       <div key={index} className="flex flex-col items-center text-center">
//                         <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-2 overflow-hidden">
//                           {actor.profilePath ? (
//                             <img 
//                               src={actor.profilePath} 
//                               alt={actor.name} 
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <User className="h-8 w-8 text-gray-400" />
//                           )}
//                         </div>
//                         <p className="font-medium">{actor.name}</p>
//                         {actor.character && (
//                           <p className="text-sm text-gray-400">{actor.character}</p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
              
//               {(!directors.length && !actors.length) && (
//                 <p className="text-gray-400">No cast information available</p>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="mt-16">
//           <MediaReviews 
//             mediaType={type} 
//             mediaId={id} 
//             initialRating={mediaItem.rating || 0} 
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediaDetail;


import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authUser';
import MediaReviews from '../Reviews/MediaReviews';

const MediaDetail = () => {
  const user = useAuthStore(state => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mediaItem, setMediaItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  // Extract type from pathname (movies or tvshows)
  const type = location.pathname.split('/')[1];
  // Convert UI type to API type (movies → movie, tvshows → tvshow)
  const apiMediaType = type === 'movies' ? 'movie' : 'tvshow';

  useEffect(() => {
    // First try to use the media item passed through location state
    if (location.state?.media) {
      setMediaItem(location.state.media);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch the media item from the API
    const fetchMediaDetail = async () => {
      setIsLoading(true);
      try {
        const endpoint = type === 'movies' 
          ? `/api/admin/movies/${id}` 
          : `/api/admin/tvshows/${id}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.success) {
          setMediaItem(type === 'movies' ? data.movie : data.tvShow);
        }
      } catch (error) {
        console.error(`Error fetching ${type} details:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaDetail();
  }, [id, type, location.state]);

  // Check if media is in user's favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !mediaItem) return;

      try {
        const response = await fetch(`/api/favourites/check/${apiMediaType}/${id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [user, mediaItem, id, apiMediaType]);

  const goBack = () => {
    navigate(`/${type}`);
  };

  const handleRentClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      // Store the selected media for retrieval after payment
      localStorage.setItem('lastPaidMedia', JSON.stringify(mediaItem));
      navigate('/payment', { state: { media: mediaItem } });
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favourites/${apiMediaType}/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
          setIsFavorite(false);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favourites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaType: apiMediaType, mediaId: id }),
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price ? `₦${Number(price).toFixed(2)}` : '₦0.00';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  if (!mediaItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Media not found</h2>
          <Button variant="outline" onClick={goBack} className="border-gray-500 text-white">
            <ChevronLeft className="h-5 w-5 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Separate cast members by role
  const directors = mediaItem.cast?.filter(person => person.role.toLowerCase() === 'director') || [];
  const actors = mediaItem.cast?.filter(person => person.role.toLowerCase() === 'actor') || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-8">
      <div className="container mx-auto px-4">
        <Button onClick={goBack} className="mb-6 border-gray-500 text-white">
          <ChevronLeft className="h-5 w-5 mr-2" /> Back to {type === 'movies' ? 'Movies' : 'TV Shows'}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden">
              <img 
                src={mediaItem.posterPath || '/placeholder-image.jpg'} 
                alt={mediaItem.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold">{mediaItem.title}</h1>
              
              {/* Favorite Button */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`rounded-full transition-colors ${isFavorite ? 'text-red-500 hover:text-red-400' : 'text-white hover:text-red-300'}`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <div className="flex items-center mb-4 text-gray-300">
              {type === 'movies' ? (
                <span>{mediaItem.releaseDate ? new Date(mediaItem.releaseDate).getFullYear() : 'N/A'} {mediaItem.runtime ? `• ${mediaItem.runtime} min` : ''}</span>
              ) : (
                <span>{mediaItem.firstAirDate ? new Date(mediaItem.firstAirDate).getFullYear() : 'N/A'} {mediaItem.numberOfSeasons ? `• ${mediaItem.numberOfSeasons} Season${mediaItem.numberOfSeasons !== 1 ? 's' : ''}` : ''}</span>
              )}
              
              {mediaItem.rating && (
                <span className="ml-4 bg-yellow-600 text-white px-2 py-1 rounded text-sm">
                  ★ {mediaItem.rating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-xl font-semibold text-green-500 mb-2">
                Rent for {formatPrice(mediaItem.rentPrice)}
              </p>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleRentClick}
              >
                Rent Now
              </Button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300">{mediaItem.overview}</p>
            </div>
            
            {mediaItem.genres && mediaItem.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {mediaItem.genres.map((genre, index) => (
                    <span key={index} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cast Section - Replaces the Trailer section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Cast & Crew</h3>
              
              {/* Directors Section */}
              {directors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-300 mb-3">Director{directors.length > 1 ? 's' : ''}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {directors.map((director, index) => (
                      <div key={index} className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-2 overflow-hidden">
                          {director.profilePath ? (
                            <img 
                              src={director.profilePath} 
                              alt={director.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <p className="font-medium">{director.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actors Section */}
              {actors.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-300 mb-3">Actors</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {actors.map((actor, index) => (
                      <div key={index} className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-2 overflow-hidden">
                          {actor.profilePath ? (
                            <img 
                              src={actor.profilePath} 
                              alt={actor.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <p className="font-medium">{actor.name}</p>
                        {actor.character && (
                          <p className="text-sm text-gray-400">{actor.character}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(!directors.length && !actors.length) && (
                <p className="text-gray-400">No cast information available</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16">
          <MediaReviews 
            mediaType={type} 
            mediaId={id} 
            initialRating={mediaItem.rating || 0} 
          />
        </div>
      </div>
    </div>
  );
};

export default MediaDetail;