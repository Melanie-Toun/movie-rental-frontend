import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaGrid from './MediaGrid';

const MoviesGrid = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/movies');
      const data = await response.json();
      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return <MediaGrid media={movies} isLoading={isLoading} type="movies" />;
};

export default MoviesGrid;