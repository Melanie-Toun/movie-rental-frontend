import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Tv, Clock, X, Search, Trash2, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authUser';


const SearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/search/user/search-history');
      
      if (response.data.success) {
        // Sort by most recent searches first
        const sortedHistory = response.data.content.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setSearchHistory(sortedHistory);
      } else {
        setError('Failed to fetch search history');
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
      setError(error.response?.data?.message || 'An error occurred while fetching your search history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`/api/search/user/search-history/${id}`);
      setSearchHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing search history item:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete('/api/search/user/search-history');
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const handleItemClick = (item) => {
    // If the item has results, use the first result to navigate
    if (item.results && item.results.length > 0) {
      const firstResult = item.results[0];
      navigate(`/${firstResult.type}/${firstResult.id}`);
    } else {
      // Or redirect to search with this term pre-filled
      navigate(`/search?q=${encodeURIComponent(item.searchTerm)}`);
    }
  };

  // Format a date relative to now (e.g., "2 hours ago", "Yesterday", etc.)
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHr < 24) {
      return `${diffHr} ${diffHr === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <p>Please log in to view your search history.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button 
          variant="primary" 
          onClick={() => navigate('/')}
          className="text-xs"
          size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />Back
        </Button>
        <CardTitle className="text-xl">Search History</CardTitle>
        {searchHistory.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={handleClearAll}
            className="text-xs"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
          </div>
        ) : searchHistory.length === 0 ? (
          <div className="text-center text-gray-400 p-6">
            <Search className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Your search history will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {searchHistory.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex-shrink-0 bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate font-medium">"{item.searchTerm}"</p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span>{formatRelativeTime(item.timestamp)}</span>
                      
                      {item.results && item.results.length > 0 && (
                        <div className="flex items-center ml-2">
                          <span className="mx-1">•</span>
                          <span>{item.results.length} results</span>
                          
                          {/* Display icons for result types */}
                          <div className="flex ml-2">
                            {item.results.some(r => r.type === 'movies') && (
                              <Film className="h-3 w-3 mr-1" />
                            )}
                            {item.results.some(r => r.type === 'tvshows') && (
                              <Tv className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  className="text-gray-400 hover:text-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchHistory;