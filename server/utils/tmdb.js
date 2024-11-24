const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const tmdbAPI = {
  // Get movie details including rating and reviews
  getMovieDetails: async (tmdbId) => {
    try {
      // Get basic movie info including rating
      const movieResponse = await axios.get(
        `${BASE_URL}/movie/${tmdbId}`,
        {
          params: {
            api_key: TMDB_API_KEY,
          }
        }
      );

      // Get reviews
      const reviewsResponse = await axios.get(
        `${BASE_URL}/movie/${tmdbId}/reviews`,
        {
          params: {
            api_key: TMDB_API_KEY,
          }
        }
      );

      return {
        tmdbRating: movieResponse.data.vote_average,
        tmdbReviews: reviewsResponse.data.results,
        voteCount: movieResponse.data.vote_count
      };
    } catch (error) {
      console.error('Error fetching TMDB movie details:', error);
      return {
        tmdbRating: 0,
        tmdbReviews: [],
        voteCount: 0
      };
    }
  },

  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page
        }
      });
      
      return response.data.results.map(movie => ({
        title: movie.title,
        description: movie.overview,
        releaseYear: new Date(movie.release_date).getFullYear(),
        imageSrc: `${IMAGE_BASE_URL}${movie.poster_path}`,
        tmdbId: movie.id,
        averageRating: movie.vote_average / 2, // Convert from TMDB's 10-point to our 5-point scale
        voteCount: movie.vote_count
      }));
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          page
        }
      });

      return response.data.results.map(movie => ({
        title: movie.title,
        description: movie.overview,
        releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        imageSrc: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        tmdbId: movie.id,
        averageRating: movie.vote_average / 2,
        voteCount: movie.vote_count
      }));
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie recommendations
  getRecommendations: async (tmdbId, page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${tmdbId}/recommendations`,
        {
          params: {
            api_key: TMDB_API_KEY,
            page
          }
        }
      );

      return response.data.results.map(movie => ({
        title: movie.title,
        description: movie.overview,
        releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        imageSrc: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        tmdbId: movie.id,
        averageRating: movie.vote_average / 2,
        voteCount: movie.vote_count
      }));
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      return [];
    }
  },

  // Validate if a TMDB ID exists
  validateTMDBId: async (tmdbId) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${tmdbId}`, {
        params: {
          api_key: TMDB_API_KEY,
        }
      });
      return !!response.data.id;
    } catch (error) {
      return false;
    }
  }
};

module.exports = tmdbAPI;