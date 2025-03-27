import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaGrid from './MediaGrid';

const TVShowsGrid = () => {
  const [tvShows, setTvShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTVShows();
  }, []);

  const fetchTVShows = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/tvshows');
      const data = await response.json();
      if (data.success) {
        setTvShows(data.tvShows);
      }
    } catch (error) {
      console.error('Error fetching TV Shows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return <MediaGrid media={tvShows} isLoading={isLoading} type="tvshows" />;
};

export default TVShowsGrid;