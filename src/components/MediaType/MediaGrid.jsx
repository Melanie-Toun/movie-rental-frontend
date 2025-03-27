import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Play, Clapperboard, Monitor, ChevronRight } from 'lucide-react';

const MediaGrid = ({ media = [], isLoading, type }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const totalPages = Math.ceil((media?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = media?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handleMediaClick = (item) => {
    navigate(`/${type}/${item.id}`, { state: { media: item } });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const formatPrice = (price) => {
    return price ? `₦${Number(price).toFixed(2)}` : '₦0.00';
  };

  const handleGoBack = ()=>{
    navigate("/browse")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-8">
      <div className="container mx-auto px-4">
        {/* New Top Section Design */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button 
              onClick={handleGoBack} 
              className="
                bg-transparent 
                border 
                border-gray-700 
                text-white 
                hover:bg-gray-800 
                transition-all 
                duration-300 
                group
              "
            >
              <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
              Back
            </Button>

            <div className="flex items-center space-x-4">
              {type === 'movies' ? (
                <Clapperboard 
                  className="
                    h-12 w-12 
                    text-red-500 
                    bg-red-500/20 
                    p-2 
                    rounded-full 
                    shadow-lg 
                    shadow-red-500/30
                  " 
                />
              ) : (
                <Monitor 
                  className="
                    h-12 w-12 
                    text-blue-500 
                    bg-blue-500/20 
                    p-2 
                    rounded-full 
                    shadow-lg 
                    shadow-blue-500/30
                  " 
                />
              )}
              
              <div>
                <h1 className="
                  text-2xl
                  md:text-4xl 
                  font-extrabold 
                  tracking-tight 
                  text-white 
                  relative
                  inline-block
                ">
                  {type === 'movies' ? 'Movies Collection' : 'TV Shows Collection'}
                  <span 
                    className="
                      absolute 
                      -bottom-2 
                      left-0 
                      w-1/2
                      md:w-full 
                      h-1 
                      bg-gradient-to-r 
                      from-red-500 
                      to-pink-500 
                      rounded-full
                    "
                  />
                </h1>
                <p className="text-gray-400 mt-2 text-sm">
                  {type === 'movies' 
                    ? 'Discover the latest and greatest cinematic experiences' 
                    : 'Explore a world of captivating television series'}
                </p>
              </div>
            </div>
          </div>

          {/* Optional Total Count Indicator */}
          <div className="flex items-center space-x-2 bg-gray-800 px-2 md:px-4 py-1 md:py-2 rounded-md">
            <Play className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300 text-xs md:text-sm">
              Total {type}: {media?.length || 0}
            </span>
          </div>
        </div>

        {/* Rest of the existing component remains exactly the same */}
        {media?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((item) => (
                <Card 
                  key={item.id}
                  className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200"
                  onClick={() => handleMediaClick(item)}
                >
                  <div className="relative h-[300px]">
                    <img src={item.posterPath} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
                      <h3 className="text-white font-semibold truncate">{item.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-300 text-sm">
                          {type === 'movies' ? new Date(item.releaseDate).getFullYear() : new Date(item.firstAirDate).getFullYear()}
                        </p>
                        <p className="text-yellow-400 font-semibold">{formatPrice(item.rentPrice)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 space-x-3">
                <Button 
                  variant="outline" 
                  onClick={prevPage} 
                  disabled={currentPage === 1} 
                  className="
                    px-3 
                    py-1.5 
                    border 
                    border-gray-600 
                    text-white 
                    rounded-md 
                    bg-gray-800 
                    hover:bg-gray-700 
                    transition-colors 
                    duration-200 
                    flex 
                    items-center 
                    text-sm
                    disabled:opacity-50 
                    disabled:cursor-not-allowed
                  "
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> 
                  Prev
                </Button>
                
                <div className="
                  bg-gray-800 
                  px-3 
                  py-1.5 
                  rounded-md 
                  text-gray-300 
                  text-sm 
                  border 
                  border-gray-700
                ">
                  Page {currentPage} of {totalPages}
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages} 
                  className="
                    px-3 
                    py-1.5 
                    border 
                    border-gray-600 
                    text-white 
                    rounded-md 
                    bg-gray-800 
                    hover:bg-gray-700 
                    transition-colors 
                    duration-200 
                    flex 
                    items-center 
                    text-sm
                    disabled:opacity-50 
                    disabled:cursor-not-allowed
                  "
                >
                  Next 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-400">No {type} available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGrid;