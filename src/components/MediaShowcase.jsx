import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authUser';
import { ArrowBigLeft, ChevronLeft, ChevronRight, Clapperboard, Play, Tv, X } from 'lucide-react';
// import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const MediaShowcase = () => {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [activeRentals, setActiveRentals] = useState([]);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);

  // Check if coming from a successful payment flow
  useEffect(() => {
    // If redirected from payment success, check if there's stored media
    const paymentSuccessMedia = localStorage.getItem('lastPaidMedia');
    if (paymentSuccessMedia) {
      try {
        const media = JSON.parse(paymentSuccessMedia);
        setSelectedMedia(media);
        setBackgroundImage(media.backdropPath);
        // Remove from storage after using
        localStorage.removeItem('lastPaidMedia');
      } catch (error) {
        console.error('Error parsing saved media:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchMovies(),
        fetchTvShows(),
      ]);
      
      // Fetch user's rentals if logged in
      if (user) {
        await fetchRentals();
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [user]);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/admin/movies');
      const data = await response.json();
      if (data.success) setMovies(data.movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchTvShows = async () => {
    try {
      const response = await fetch('/api/admin/tvshows');
      const data = await response.json();
      if (data.success) setTvShows(data.tvShows);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    }
  };

  const isMediaRented = (media) => {
    if (!user || !activeRentals.length || !media) return false;
    
    // Log for debugging
    console.log('Active rentals:', activeRentals);
    console.log('Checking media:', media.title, media.id);
    
    const isRented = activeRentals.some(rental => {
      // First try to match by ID
      if (rental.mediaId && media.id && rental.mediaId === media.id) {
        return true;
      }
      
      // Then try exact title matching as fallback content
      if (rental.title && rental.title.toLowerCase() === media.title.toLowerCase()) {
        return true;
      }
      
      return false;
    });
    
    console.log(`Media "${media.title}" rental status:`, isRented);
    return isRented;
  };
  
  // Modify fetchRentals to better handle the rental data
  const fetchRentals = async () => {
    try {
      const response = await fetch('/api/payment/rentals', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched rentals:', data.rentals);
        
        // Filter to only include active rentals
        const now = new Date();
        const active = data.rentals.filter(rental => {
          const endDate = new Date(rental.rentalEndDate);
          return now <= endDate;
        });
        
        setActiveRentals(active);
        
        // If we have a selected media, check if its rental status changed
        if (selectedMedia) {
          const isCurrentlyRented = active.some(rental => 
            rental.title.toLowerCase() === selectedMedia.title.toLowerCase() ||
            (rental.mediaId && rental.mediaId === selectedMedia.id)
          );
          
          if (isCurrentlyRented) {
            // Force a re-render by creating a new object
            setSelectedMedia({...selectedMedia});
          }
        }
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };
  
  // Add this effect to refetch rentals when the component becomes visible again
  // This helps when returning from payment flow
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, refreshing rentals');
        fetchRentals();
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Modify your success flow - add this to your PaymentSuccess component
  // Make sure to store the media ID in localStorage during payment flow
  useEffect(() => {
    // Force refresh of rentals on payment success
    const refreshRentals = async () => {
      try {
        const response = await fetch('/api/payment/rentals', { 
          credentials: 'include',
          // Add cache-busting to avoid cached responses
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        // Update localStorage with rental status
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Get the last paid media if available
            const lastPaidMedia = localStorage.getItem('lastPaidMedia');
            if (lastPaidMedia) {
              try {
                const media = JSON.parse(lastPaidMedia);
                
                // Mark this media as rented in localStorage for backup
                const rentedMedia = JSON.parse(localStorage.getItem('rentedMedia') || '[]');
                if (!rentedMedia.some(item => item.id === media.id)) {
                  rentedMedia.push({
                    id: media.id,
                    title: media.title,
                    mediaType: media.numberOfSeasons ? 'tvshow' : 'movie',
                    rentedAt: new Date().toISOString()
                  });
                  localStorage.setItem('rentedMedia', JSON.stringify(rentedMedia));
                }
              } catch (err) {
                console.error('Error processing media data:', err);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error refreshing rentals:', error);
      }
    };
    
    refreshRentals();
  }, []);
  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setBackgroundImage(media.backdropPath);
  };

  const handleRentClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      // Store the selected media for retrieval after payment
      localStorage.setItem('lastPaidMedia', JSON.stringify(selectedMedia));
      navigate('/payment', { state: { media: selectedMedia } });
    }
  };

  const handleWatchClick = () => {
    setIsWatchModalOpen(true);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleGoToMovies = ()=>{
    navigate("/movies")
  }


  const handleGoToTvShow = ()=>{
    navigate("/tvshows")
  }

  // const isMediaRented = (media) => {
  //   if (!user || !activeRentals.length || !media) return false;
    
  //   const isRented = activeRentals.some(rental => {
  //     // Check by comparing title since mediaId might not match directly
  //     const rentalTitle = rental.title;
  //     return rentalTitle === media.title;
  //   });
    
  //   console.log(`Checking if ${media?.title} is rented:`, isRented); // Debug log
    
  //   return isRented;
  // };

  const closeWatchModal = () => {
    setIsWatchModalOpen(false);
  };

  const MediaSlider = ({ items, title }) => {
    const [showArrows, setShowArrows] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const sliderRef = useRef(null);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        const handleMouseDown = (e) => {
            isDown = true;
            slider.classList.add("cursor-grabbing");
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDown = false;
            slider.classList.remove("cursor-grabbing");
        };

        const handleMouseUp = () => {
            isDown = false;
            slider.classList.remove("cursor-grabbing");
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        };

        const handleScroll = () => {
            setCanScrollLeft(slider.scrollLeft > 0);
            setCanScrollRight(slider.scrollLeft + slider.clientWidth < slider.scrollWidth);
        };

        slider.addEventListener("mousedown", handleMouseDown);
        slider.addEventListener("mouseleave", handleMouseLeave);
        slider.addEventListener("mouseup", handleMouseUp);
        slider.addEventListener("mousemove", handleMouseMove);
        slider.addEventListener("scroll", handleScroll);

        handleScroll(); // Ensure correct button state on first render

        return () => {
            slider.removeEventListener("mousedown", handleMouseDown);
            slider.removeEventListener("mouseleave", handleMouseLeave);
            slider.removeEventListener("mouseup", handleMouseUp);
            slider.removeEventListener("mousemove", handleMouseMove);
            slider.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -sliderRef.current.clientWidth, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: sliderRef.current.clientWidth, behavior: "smooth" });
        }
    };

    return (
        <div 
    className="relative py-4 text-white"
    onMouseEnter={() => setShowArrows(true)}
    onMouseLeave={() => setShowArrows(false)}
>
    {/* Horizontally Scrolling Gradient Line */}
    <div 
        className="absolute top-0 left-0 w-full h-0.5 overflow-hidden"
    >
        <div 
            className="
                absolute 
                top-0 
                left-0 
                w-1/2 
                h-full 
                bg-gradient-to-r 
                from-purple-400/30 
                via-purple-600 
                to-purple-400/30 
                animate-scroll-line
            "
        />
    </div>

    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    <div className="relative">
        <div 
            ref={sliderRef} 
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
           {items.map((item) => (
            <div 
                key={item.id} 
                className="min-w-[220px] cursor-pointer transform hover:scale-105 transition-transform duration-200"
                onClick={() => handleMediaClick(item)}
            >
                <div className="relative h-[300px]">
                    <img
                        src={item.posterPath}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-white font-semibold truncate">{item.title}</h3>
                        <p className="text-gray-200 text-sm">{item.rentPrice}</p>
                    </div>
                </div>
            </div>
        ))}
        </div>
        {showArrows && items.length > 0 && (
            <>
                {canScrollLeft && (
                    <button 
                        className="absolute top-1/2 -translate-y-1/2 left-5 flex items-center justify-center size-14 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10 transition-all"
                        onClick={scrollLeft}
                    > 
                        <ChevronLeft size={24}/>
                    </button>
                )}
                {canScrollRight && (
                    <button 
                        className="absolute top-1/2 -translate-y-1/2 right-5 flex items-center justify-center size-14 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10 transition-all"
                        onClick={scrollRight}
                    > 
                        <ChevronRight size={24}/>
                    </button>
                )}
            </>
        )}
    </div>
</div>
    );
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 transition-all duration-700 ease-in-out z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-20 flex w-full max-w-7xl mb-[-3rem] mx-auto p-3 md:p-5 rounded-lg shadow-md">
  {/* Back Button - Sticks to the Extreme Left */}
  <Button 
    className="text-white hover:bg-gray-700 mt-4 shadow-sm px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm rounded-md border border-gray-600"
    onClick={handleBack}
  >
    <ArrowBigLeft className="mr-2"/> Back
  </Button>

  {/* Right-side Buttons - Sticks to the Right */}
  <div className="flex gap-3 md:gap-5 ml-auto">
    <Button 
      className="text-white hover:bg-gray-700 mt-4 shadow-sm px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm rounded-md border border-gray-600"
      onClick={handleGoToMovies}
    >
      <Clapperboard className="mr-2"/> Movie
    </Button>
    <Button 
      className="text-white hover:bg-gray-700 mt-4 shadow-sm px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm rounded-md border border-gray-600"
      onClick={handleGoToTvShow}
    >
      <Tv className="mr-2"/> TvShows
    </Button>
  </div>
</div>





      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
      <div className=""></div>
        <MediaSlider items={movies} title="Movies" />
        <div className="mt-5"></div>
        <MediaSlider items={tvShows} title="TV Shows" />        
      </div>
     
      {/* Media Details Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={(open) => {
        if (!open) setSelectedMedia(null);
      }}>
        <DialogContent className="max-w-2xl bg-gray-900 text-white shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedMedia?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedMedia?.trailer ? (
              <div className="relative w-full aspect-video">
                <video
                  src={selectedMedia.trailer}
                  className="w-full h-full rounded-lg shadow-md"
                  autoPlay
                  muted
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] bg-gray-700 rounded-lg">
                <p className="text-gray-300">No trailer available</p>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                {selectedMedia?.genres?.join(', ')}
              </p>
              
              <p className="text-sm">{selectedMedia?.overview}</p>
              
              <div className="flex items-center justify-between pt-4">
                <p className="text-lg font-semibold text-green-400">
                  {formatPrice(selectedMedia?.rentPrice)}
                </p>
                
                <div className="space-x-2">
                  <Button 
                    onClick={handleWatchClick}
                    className="gap-2 bg-blue-500 hover:bg-blue-600 shadow-md px-4 py-2 text-sm rounded-md"
                    disabled={!isMediaRented(selectedMedia)}
                  >
                    <Play className="w-4 h-4" /> Watch Now
                  </Button>
                  
                  <Button 
                    onClick={handleRentClick} 
                    className="gap-2 bg-blue-500 hover:bg-blue-600 shadow-md px-4 py-2 text-sm rounded-md"
                    disabled={isMediaRented(selectedMedia)}
                  >
                    Rent Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Watch Modal - Full Screen Video Player */}
      <Dialog open={isWatchModalOpen} onOpenChange={setIsWatchModalOpen}>
        <DialogContent className="max-w-6xl w-full h-full max-h-[80vh] bg-black text-white shadow-2xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex justify-between items-center">
              <span>{selectedMedia?.title}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeWatchModal}
                className="rounded-full hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
            <DialogDescription>Enjoy your rental</DialogDescription>
          </DialogHeader>
          
          <div className="w-full h-full flex-1">
            {selectedMedia?.trailer ? (
              <video
                src={selectedMedia.trailer}
                className="w-full h-full rounded-lg shadow-lg"
                controls
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-700 rounded-lg">
                <p className="text-gray-300">Content not available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const formatPrice = (price) => {
  if (price === null || price === undefined) return '₦0.00';
  return `₦${Number(price).toFixed(2)}`;
};

export default MediaShowcase;