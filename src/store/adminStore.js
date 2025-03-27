import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useAdminStore = create((set) => ({
    movies: [],
    tvShows: [],
    isLoading: false,
    error: null,

    fetchMovies: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get('/api/admin/movies');
            set({ movies: response.data.movies, isLoading: false });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching movies');
            set({ error: error.message, isLoading: false });
        }
    },

    addMovie: async (movieData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            for (const [key, value] of Object.entries(movieData)) {
                if (key === 'posterFile' || key === 'backdropFile') {
                    if (value) formData.append(key, value);
                } else {
                    formData.append(key, value);
                }
            }

            const response = await axios.post('/api/admin/movies', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            set((state) => ({
                movies: [...state.movies, response.data.movie],
                isLoading: false
            }));
            toast.success('Movie added successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding movie');
            set({ error: error.message, isLoading: false });
        }
    },

    deleteMovie: async (id) => {
        try {
            await axios.delete(`/api/admin/movies/${id}`);
            set((state) => ({
                movies: state.movies.filter(movie => movie.id !== id)
            }));
            toast.success('Movie deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting movie');
        }
    },

    
    fetchTvShows: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get('/api/admin/tvshows');
            set({ tvShows: response.data.tvShows, isLoading: false });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching TV shows');
            set({ error: error.message, isLoading: false });
        }
    },

    addTvShow: async (tvShowData) => {
        set({ isLoading: true });
        try {
            const formData = new FormData();
            for (const [key, value] of Object.entries(tvShowData)) {
                if (key === 'posterFile' || key === 'backdropFile') {
                    if (value) formData.append(key, value);
                } else {
                    formData.append(key, value);
                }
            }

            const response = await axios.post('/api/admin/tvshows', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            set((state) => ({
                tvShows: [...state.tvShows, response.data.tvShow],
                isLoading: false
            }));
            toast.success('TV Show added successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding TV show');
            set({ error: error.message, isLoading: false });
        }
    },

    deleteTvShow: async (id) => {
        try {
            await axios.delete(`/api/admin/tvshows/${id}`);
            set((state) => ({
                tvShows: state.tvShows.filter(show => show.id !== id)
            }));
            toast.success('TV Show deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting TV show');
        }
    }
}));