const { User, Movie, Rating, Review } = require('../models');
const { AuthenticationError } = require('@apollo/server');
const { signToken } = require('../utils/auth');
const { getMovieDetails } = require('../utils/tmdb');

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not logged in');
      return await User.findByPk(user.id, {
        include: [
          { model: Rating, include: [Movie] },
          { model: Review, include: [Movie] }
        ]
      });
    },
    user: async (_, { id }) => {
      return await User.findByPk(id, {
        include: [
          { model: Rating, include: [Movie] },
          { model: Review, include: [Movie] }
        ]
      });
    },
    users: async () => {
      return await User.findAll({
        include: [
          { model: Rating },
          { model: Review }
        ]
      });
    },
    movie: async (_, { id }) => {
      return await Movie.findByPk(id, {
        include: [
          { model: Rating, include: [User] },
          { model: Review, include: [User] }
        ]
      });
    },
    movies: async (_, { page = 1, limit = 12 }) => {
      const offset = (page - 1) * limit;
      return await Movie.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [Rating, Review]
      });
    },
    moviesByTitle: async (_, { title }) => {
      return await Movie.findAll({
        where: {
          title: {
            [Op.iLike]: `%${title}%`
          }
        },
        include: [Rating, Review]
      });
    },
    tmdbMovieDetails: async (_, { tmdbId }) => {
      return await getMovieDetails(tmdbId);
    }
  },
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.checkPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    addMovie: async (_, args, { user }) => {
      if (!user?.isAdmin) {
        throw new AuthenticationError('Must be an admin to add movies');
      }
      return await Movie.create(args);
    },
    addRating: async (_, { movieId, rating }, { user }) => {
      if (!user) throw new AuthenticationError('Must be logged in to rate movies');
      
      const [ratingRecord, created] = await Rating.findOrCreate({
        where: { userId: user.id, movieId },
        defaults: { rating }
      });

      if (!created) {
        await ratingRecord.update({ rating });
      }

      // Update movie's average rating
      const ratings = await Rating.findAll({ where: { movieId } });
      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      await Movie.update(
        { averageRating: avgRating, voteCount: ratings.length },
        { where: { id: movieId } }
      );

      return ratingRecord;
    },
    addReview: async (_, { movieId, content }, { user }) => {
      if (!user) throw new AuthenticationError('Must be logged in to review movies');
      
      return await Review.create({
        movieId,
        userId: user.id,
        content
      });
    },
    updateReview: async (_, { reviewId, content }, { user }) => {
      if (!user) throw new AuthenticationError('Must be logged in to update reviews');
      
      const review = await Review.findByPk(reviewId);
      if (!review || review.userId !== user.id) {
        throw new AuthenticationError('Cannot update this review');
      }
      
      await review.update({ content });
      return review;
    },
    deleteReview: async (_, { reviewId }, { user }) => {
      if (!user) throw new AuthenticationError('Must be logged in to delete reviews');
      
      const review = await Review.findByPk(reviewId);
      if (!review || review.userId !== user.id) {
        throw new AuthenticationError('Cannot delete this review');
      }
      
      await review.destroy();
      return true;
    }
  }
};

module.exports = resolvers;