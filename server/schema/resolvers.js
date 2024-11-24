const { User, Movie, Rating, Review } = require('../models');
const { AuthenticationError } = require('@apollo/server');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    movies: async (_, { page = 1 }) => {
      const limit = 12;
      const offset = (page - 1) * limit;
      return await Movie.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });
    },
    movie: async (_, { id }) => {
      return await Movie.findByPk(id, {
        include: [
          {
            model: Rating,
            include: [User]
          },
          {
            model: Review,
            include: [User]
          }
        ]
      });
    },
    me: async (_, __, { user }) => {
      if (!user) {
        throw new AuthenticationError('Not logged in');
      }
      return await User.findByPk(user.id);
    }
  },
  Mutation: {
    // We'll add mutations here
  }
};

module.exports = resolvers;