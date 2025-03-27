import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, User, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuthStore } from '@/store/authUser';


const MediaSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all'); 
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); 
  const [lastSearchResults, setLastSearchResults] = useState([]); // Store last search results
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType, activeTab]);

  const performSearch = async (isExplicitSearch = false) => {
    if (!searchTerm.trim()) return;
  
    setIsSearching(true);
    setShowResults(true);
  
    try {
      const params = new URLSearchParams({
        query: searchTerm,
        type: searchType,
        mediaType: activeTab === 'all' ? 'all' : activeTab,
      });
  
      const response = await axios.get(`/api/search/media/search?${params}`);
      const data = response.data;
  
      if (data.success) {
        const processedResults = [];
  
        if (data.movies) {
          const movieResults = data.movies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            type: 'movies',
            posterPath: movie.posterPath,
            releaseDate: movie.releaseDate,
            matchType: determineMatchType(movie, searchTerm, searchType),
            matchDetails: getMatchDetails(movie, searchTerm, searchType),
          }));
          processedResults.push(...movieResults);
        }
  
        if (data.tvShows) {
          const tvShowResults = data.tvShows.map((tvShow) => ({
            id: tvShow.id,
            title: tvShow.title,
            type: 'tvshows',
            posterPath: tvShow.posterPath,
            releaseDate: tvShow.firstAirDate,
            matchType: determineMatchType(tvShow, searchTerm, searchType),
            matchDetails: getMatchDetails(tvShow, searchTerm, searchType),
          }));
          processedResults.push(...tvShowResults);
        }
  
        const filteredResults =
          activeTab === 'all'
            ? processedResults
            : processedResults.filter((result) => result.type === activeTab);
  
        setSearchResults(filteredResults);
        setLastSearchResults(filteredResults);
  
        // Save search history only if explicitly searched
        if (user && isExplicitSearch && filteredResults.length > 0) {
          saveSearchToHistory(searchTerm, filteredResults);
        }
      }
    } catch (error) {
      console.error('Error searching media:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleResultClick = (result) => {
    setShowResults(false);
    navigate(`/${result.type}/${result.id}`, { state: { media: result } });
  
    // Save search history when clicking a result
    if (user && lastSearchResults.length > 0) {
      saveSearchToHistory(searchTerm, lastSearchResults);
    }
  };

  // Helper function to determine the type of match (title, genre, actor, etc.)
  const determineMatchType = (item, query, searchType) => {
    query = query.toLowerCase();
    
    if (searchType !== 'all') {
      return searchType;
    }
    
    if (item.title.toLowerCase().includes(query)) {
      return 'title';
    } 
    
    if (item.overview.toLowerCase().includes(query)) {
      return 'overview';
    }
    
    const genreMatch = item.genres.find(genre => 
      genre.toLowerCase().includes(query)
    );
    if (genreMatch) {
      return 'genre';
    }
    
    const castMatch = item.cast?.find(member => 
      member.name.toLowerCase().includes(query)
    );
    if (castMatch) {
      return castMatch.role.toLowerCase() === 'director' ? 'director' : 'actor';
    }
    
    return 'other';
  };
  
  // Get more detailed match information
  const getMatchDetails = (item, query, searchType) => {
    query = query.toLowerCase();
    
    if (searchType === 'actor' || searchType === 'director' || searchType === 'all') {
      const castMatches = item.cast?.filter(member => 
        member.name.toLowerCase().includes(query)
      );
      
      if (castMatches && castMatches.length > 0) {
        return castMatches.map(member => 
          `${member.role}: ${member.name}${member.character ? ` as ${member.character}` : ''}`
        ).join(', ');
      }
    }
    
    if (searchType === 'genre' || searchType === 'all') {
      const genreMatches = item.genres.filter(genre => 
        genre.toLowerCase().includes(query)
      );
      
      if (genreMatches.length > 0) {
        return `Genres: ${genreMatches.join(', ')}`;
      }
    }
    
    return null;
  };

  // Save search to user history
  const saveSearchToHistory = async (term, results) => {
    try {
      await axios.post('/api/search/user/search-history', {
        searchTerm: term,
        results: results.slice(0, 3) // Save only top 3 results for efficiency
      });
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  // const handleResultClick = (result) => {
  //   setShowResults(false);
  //   navigate(`/${result.type}/${result.id}`, { state: { media: result } });
  // };

  // Filter options for search type
  const searchTypeOptions = [
    { value: 'all', label: 'All', icon: <Search className="h-4 w-4" /> },
    { value: 'title', label: 'Title', icon: <Film className="h-4 w-4" /> },
    { value: 'actor', label: 'Actor', icon: <User className="h-4 w-4" /> },
    { value: 'director', label: 'Director', icon: <User className="h-4 w-4" /> },
    { value: 'genre', label: 'Genre', icon: <Tag className="h-4 w-4" /> }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4" ref={searchRef}>
      <div className="relative">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {/* Search Type Dropdown */}
          <div className="relative group">
            <button className="h-full px-3 py-2 bg-gray-700 text-white flex items-center space-x-1">
              <span>{searchTypeOptions.find(option => option.value === searchType)?.icon}</span>
              <span className="hidden sm:inline">{searchTypeOptions.find(option => option.value === searchType)?.label}</span>
            </button>
            
            <div className="absolute left-0 top-full mt-1 bg-gray-800 rounded-md shadow-lg z-50 hidden group-hover:block">
              {searchTypeOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
                  onClick={() => setSearchType(option.value)}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 bg-gray-800 text-white outline-none placeholder-gray-400"
              placeholder={`Search by ${searchType === 'all' ? 'anything' : searchType}...`}
              onFocus={() => searchTerm && setShowResults(true)}
            />
            
            {searchTerm && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={clearSearch}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Search Button */}
          <button 
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 flex items-center"
            onClick={performSearch}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        
        {/* Media Type Tabs */}
        <div className="flex mt-2 border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'movies' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300'}`}
            onClick={() => setActiveTab('movies')}
          >
            Movies
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'tvshows' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-300'}`}
            onClick={() => setActiveTab('tvshows')}
          >
            TV Shows
          </button>
        </div>
        
        {/* Search Results */}
        {showResults && (
          <div className="absolute left-0 right-0 bg-gray-800 mt-1 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="flex justify-center items-center p-6">
                <Loader2 className="h-6 w-6 text-red-500 animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((result) => (
                  <div 
                    key={`${result.type}-${result.id}`}
                    className="flex items-start p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-12 h-16 bg-gray-700 rounded overflow-hidden mr-3">
                      {result.posterPath ? (
                        <img 
                          src={result.posterPath} 
                          alt={result.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {result.type === 'movies' ? <Film className="h-6 w-6 text-gray-400" /> : <Tv className="h-6 w-6 text-gray-400" />}
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{result.title}</h4>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="capitalize bg-gray-700 px-2 py-0.5 rounded text-xs">
                          {result.type === 'movies' ? 'Movie' : 'TV Show'}
                        </span>
                        
                        {result.releaseDate && (
                          <span className="ml-2">
                            {new Date(result.releaseDate).getFullYear()}
                          </span>
                        )}
                        
                        {result.matchType && (
                          <span className="ml-2">
                            {searchType === 'all' && `Matched: ${result.matchType}`}
                          </span>
                        )}
                      </div>
                      
                      {/* Additional match details */}
                      {result.matchDetails && (
                        <p className="text-xs text-gray-400 mt-1">
                          {result.matchDetails}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="p-6 text-center text-gray-400">
                No results found for "{searchTerm}"
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSearch;