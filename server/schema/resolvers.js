const { User, Movie, Rating, Review } = require('../models');
const { signToken, checkAuth } = require('../utils/auth');
const { getMovieDetails } = require('../utils/tmdb');
const tmdbAPI = require('../utils/tmdb');
const ErrorHandler = require('../utils/errorHandler');
const { Op } = require('sequelize');

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw ErrorHandler.unauthorized('Not logged in');
      }
      
      try {
        const userData = await User.findByPk(user.id, {
          include: [
            { model: Rating, include: [Movie] },
            { model: Review, include: [Movie] }
          ]
        });

        if (!userData) {
          throw ErrorHandler.notFound('User not found');
        }

        return userData;
      } catch (error) {
        throw ErrorHandler.databaseError('Error fetching user data', error);
      }
    },

    user: async (_, { id }) => {
      try {
        const userData = await User.findByPk(id, {
          include: [
            { model: Rating, include: [Movie] },
            { model: Review, include: [Movie] }
          ]
        });

        if (!userData) {
          throw ErrorHandler.notFound('User not found');
        }

        return userData;
      } catch (error) {
        throw ErrorHandler.databaseError('Error fetching user data', error);
      }
    },

    users: async () => {
      try {
        return await User.findAll({
          include: [
            { model: Rating },
            { model: Review }
          ]
        });
      } catch (error) {
        throw ErrorHandler.databaseError('Error fetching users', error);
      }
    },

    movie: async (_, { id }) => {
      try {
        // If the id starts with 'tmdb-', it's from a search result
        if (id.startsWith('tmdb-')) {
          const tmdbId = parseInt(id.replace('tmdb-', ''));
          
          // First, try to find the movie by tmdbId
          let movie = await Movie.findOne({
            where: { tmdbId },
            include: [
              { model: Rating, include: [User] },
              { model: Review, include: [User] }
            ]
          });
    
          // If movie doesn't exist in our database, fetch from TMDB and create it
          if (!movie) {
            const movieDetails = await tmdbAPI.getMovieDetails(tmdbId);
            if (!movieDetails) {
              throw ErrorHandler.notFound('Movie not found on TMDB');
            }
    
            movie = await Movie.create({
              title: movieDetails.title || '',
              description: movieDetails.overview || '',
              releaseYear: movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : 0,
              imageSrc: movieDetails.poster_path ? `${IMAGE_BASE_URL}${movieDetails.poster_path}` : '/default-movie-poster.jpg',
              averageRating: (movieDetails.vote_average / 2) || 0,
              tmdbId: tmdbId,
              voteCount: movieDetails.vote_count || 0
            });
    
            // Fetch associations after creation
            movie = await Movie.findOne({
              where: { tmdbId },
              include: [
                { model: Rating, include: [User] },
                { model: Review, include: [User] }
              ]
            });
          }
    
          return movie;
        }
    
        // Regular database lookup for seeded movies
        const movie = await Movie.findByPk(id, {
          include: [
            { model: Rating, include: [User] },
            { model: Review, include: [User] }
          ]
        });
    
        if (!movie) {
          throw ErrorHandler.notFound('Movie not found');
        }
    
        return movie;
      } catch (error) {
        console.error('Movie fetch error:', error);
        throw ErrorHandler.databaseError('Error fetching movie', error);
      }
    },

    movies: async (_, { page = 1, limit = 20 }) => {
      /*try {
        if (page < 1) {
          throw ErrorHandler.badRequest('Page number must be greater than 0');
        }

        const offset = (page - 1) * limit;
        return await Movie.findAll({
          limit,
          offset,
          order: [['createdAt', 'DESC']],
          include: [Rating, Review]
        });
      } catch (error) {
        throw ErrorHandler.databaseError('Error fetching movies', error);
      }
    },*/
    try {
      // Fetch popular movies directly from TMDB
      const popularMovies = await tmdbAPI.getPopularMovies(page);
      
      // Map TMDB movies to match our Movie type
      return popularMovies.map(movie => ({
        id: `tmdb-${movie.tmdbId}`,
        title: movie.title,
        description: movie.description,
        releaseYear: movie.releaseYear,
        imageSrc: movie.imageSrc,
        averageRating: movie.averageRating,
        tmdbId: movie.tmdbId,
        voteCount: movie.voteCount
      }));
    } catch (error) {
      throw ErrorHandler.tmdbError('Error fetching popular movies', error);
    }
  },



    moviesByTitle: async (_, { title }) => {
      if (!title.trim()) {
        throw ErrorHandler.badRequest('Search title cannot be empty');
      }

      try {
        return await Movie.findAll({
          where: {
            title: {
              [Op.iLike]: `%${title}%`
            }
          },
          include: [Rating, Review]
        });
      } catch (error) {
        throw ErrorHandler.databaseError('Error searching movies', error);
      }
    },

    tmdbMovieDetails: async (_, { tmdbId }) => {
      try {
        if (!tmdbId) {
          throw ErrorHandler.badRequest('TMDB ID is required');
        }
        return await getMovieDetails(tmdbId);
      } catch (error) {
        throw ErrorHandler.tmdbError('Error fetching TMDB movie details', error);
      }
    },

    searchMovies: async (_, { query, page = 1 }) => {
      if (!query.trim()) {
        throw ErrorHandler.badRequest('Search query cannot be empty');
      }
    
      try {
        const tmdbResults = await tmdbAPI.searchMovies(query, page);
        
        return {
          movies: tmdbResults.results,
          totalPages: tmdbResults.total_pages,
          totalResults: tmdbResults.total_results
        };
      } catch (error) {
        console.error('Search error:', error);
        throw ErrorHandler.tmdbError('Error searching TMDB movies', error);
      }
    },

    getRecommendations: async (_, { tmdbId, page = 1 }) => {
      try {
        if (!tmdbId) {
          throw ErrorHandler.badRequest('TMDB ID is required');
        }
        return await tmdbAPI.getRecommendations(tmdbId, page);
      } catch (error) {
        throw ErrorHandler.tmdbError('Error fetching movie recommendations', error);
      }
    },

    getPopularMovies: async (_, { page = 1 }) => {
      try {
        return await tmdbAPI.getPopularMovies(page);
      } catch (error) {
        throw ErrorHandler.tmdbError('Error fetching popular movies', error);
      }
    }
  },

  User: {
    ratings: async (parent, { page = 1 }, context) => {
      const limit = 12; // Number of ratings per page
      const offset = (page - 1) * limit;

      const ratings = await Rating.findAndCountAll({
        where: { userId: parent.id },
        limit,
        offset,
        include: [
          {
            model: Movie,
            attributes: ['id', 'title', 'imageSrc']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return {
        items: ratings.rows,
        totalPages: Math.ceil(ratings.count / limit),
        currentPage: page
      };
    },

    reviews: async (parent, { page = 1 }, context) => {
      const limit = 10; // Number of reviews per page
      const offset = (page - 1) * limit;

      const reviews = await Review.findAndCountAll({
        where: { userId: parent.id },
        limit,
        offset,
        include: [
          {
            model: Movie,
            attributes: ['id', 'title', 'imageSrc']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return {
        items: reviews.rows,
        totalPages: Math.ceil(reviews.count / limit),
        currentPage: page
      };
    }
  },

  Mutation: {
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
          throw ErrorHandler.unauthorized('Invalid credentials');
        }

        const correctPw = await user.checkPassword(password);
        if (!correctPw) {
          throw ErrorHandler.unauthorized('Invalid credentials');
        }

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        if (error.extensions?.code) throw error;
        throw ErrorHandler.databaseError('Login error', error);
      }
    },

    addUser: async (_, args) => {
      try {
        if (!args.username || !args.password) {
          throw ErrorHandler.validationError('Username and password are required');
        }

        if (args.password.length < 6) {
          throw ErrorHandler.validationError('Password must be at least 6 characters');
        }

        const existingUser = await User.findOne({ where: { username: args.username } });
        if (existingUser) {
          throw ErrorHandler.validationError('Username already exists');
        }

        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        if (error.extensions?.code) throw error;
        throw ErrorHandler.databaseError('Error creating user', error);
      }
    },

    addMovie: async (_, args, { user }) => {
      if (!user?.isAdmin) {
        throw ErrorHandler.forbidden('Must be an admin to add movies');
      }

      try {
        const existingMovie = await Movie.findOne({ where: { title: args.title } });
        if (existingMovie) {
          throw ErrorHandler.validationError('Movie already exists');
        }

        return await Movie.create(args);
      } catch (error) {
        if (error.extensions?.code) throw error;
        throw ErrorHandler.databaseError('Error adding movie', error);
      }
    },

    addRating: async (_, { movieId, rating }, { user }) => {
      if (!user) {
        throw ErrorHandler.unauthorized('Must be logged in to rate movies');
      }

      if (rating < 1 || rating > 10) {
        throw ErrorHandler.validationError('Rating must be between 1 and 10');
      }

      try {
        const movie = await Movie.findByPk(movieId);
        if (!movie) {
          throw ErrorHandler.notFound('Movie not found');
        }

        const [ratingRecord, created] = await Rating.findOrCreate({
          where: { userId: user.id, movieId },
          defaults: { rating }
        });

        if (!created) {
          await ratingRecord.update({ rating });
        }

        const ratings = await Rating.findAll({ where: { movieId } });
        const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        await movie.update({
          averageRating: avgRating,
          voteCount: ratings.length
        });

        return ratingRecord;
      } catch (error) {
        throw ErrorHandler.databaseError('Error adding rating', error);
      }
    },

    addReview: async (_, { movieId, content }, { user }) => {
      if (!user) {
        throw ErrorHandler.unauthorized('Must be logged in to review movies');
      }

      if (!content.trim()) {
        throw ErrorHandler.validationError('Review content cannot be empty');
      }

      try {
        const movie = await Movie.findByPk(movieId);
        if (!movie) {
          throw ErrorHandler.notFound('Movie not found');
        }

        return await Review.create({
          movieId,
          userId: user.id,
          content
        });
      } catch (error) {
        throw ErrorHandler.databaseError('Error adding review', error);
      }
    },

    updateReview: async (_, { reviewId, content }, { user }) => {
      if (!user) {
        throw ErrorHandler.unauthorized('Must be logged in to update reviews');
      }

      if (!content.trim()) {
        throw ErrorHandler.validationError('Review content cannot be empty');
      }

      try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
          throw ErrorHandler.notFound('Review not found');
        }

        if (review.userId !== user.id) {
          throw ErrorHandler.forbidden('Cannot update another user\'s review');
        }

        await review.update({ content });
        return review;
      } catch (error) {
        if (error.extensions?.code) throw error;
        throw ErrorHandler.databaseError('Error updating review', error);
      }
    },

    deleteReview: async (_, { reviewId }, { user }) => {
      if (!user) {
        throw ErrorHandler.unauthorized('Must be logged in to delete reviews');
      }

      try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
          throw ErrorHandler.notFound('Review not found');
        }

        if (review.userId !== user.id) {
          throw ErrorHandler.forbidden('Cannot delete another user\'s review');
        }

        await review.destroy();
        return true;
      } catch (error) {
        if (error.extensions?.code) throw error;
        throw ErrorHandler.databaseError('Error deleting review', error);
      }
    }
  }
};

module.exports = resolvers;