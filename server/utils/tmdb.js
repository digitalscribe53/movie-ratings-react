const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const tmdbAPI = {
  // Get movie details including rating and reviews
  getMovieDetails: async (tmdbId) => {
    try {
      const [movieResponse, reviewsResponse] = await Promise.all([
        axios.get(`${BASE_URL}/movie/${tmdbId}`, {
          params: { api_key: TMDB_API_KEY }
        }),
        axios.get(`${BASE_URL}/movie/${tmdbId}/reviews`, {
          params: { 
            api_key: TMDB_API_KEY,
            language: 'en-US',
            page: 1
          }
        })
      ]);

      console.log('TMDB Reviews Response:', JSON.stringify(reviewsResponse.data, null, 2));
  
      const reviews = reviewsResponse.data.results.map(review => ({
        author: review.author,
        content: review.content,
        createdAt: review.created_at
      })).slice(0, 5); // Limit to 5 reviews
  
      return {
        ...movieResponse.data,
        tmdbRating: movieResponse.data.vote_average,
        tmdbReviews: reviews.map(review => ({
          author: review.author,
          content: review.content
        })),  
        voteCount: movieResponse.data.vote_count
      };
    } catch (error) {
      console.error('Error fetching TMDB movie details:', error);
      throw error;
    }
  },

  // Get popular movies
  getPopularMovies: async (page = 1) => {
    try {
      // Calculate the two pages we need to fetch
      const firstPage = page * 2 - 1;
      const secondPage = page * 2;
  
      // Make both API calls simultaneously
      const [response1, response2] = await Promise.all([
        axios.get(`${BASE_URL}/movie/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            page: firstPage
          }
        }),
        axios.get(`${BASE_URL}/movie/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            page: secondPage
          }
        })
      ]);
      
      // Combine and map the results
      const combinedResults = [
        ...response1.data.results,
        ...response2.data.results
      ].map(movie => ({
        title: movie.title,
        description: movie.overview,
        releaseYear: new Date(movie.release_date).getFullYear(),
        imageSrc: `${IMAGE_BASE_URL}${movie.poster_path}`,
        tmdbId: movie.id,
        averageRating: movie.vote_average,
        voteCount: movie.vote_count
      }));
  
      return combinedResults;
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
  
      return {
        results: response.data.results.map(movie => ({
          id: `tmdb-${movie.id}`, // Add this
          title: movie.title,
          description: movie.overview || '',
          releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
          imageSrc: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/default-movie-poster.jpg',
          averageRating: (movie.vote_average / 2) || 0,
          tmdbId: movie.id,
          voteCount: movie.vote_count || 0
        })),
        total_pages: response.data.total_pages,
        total_results: response.data.total_results
      };
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