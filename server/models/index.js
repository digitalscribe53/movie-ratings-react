const User = require('./User');
const Movie = require('./Movie');

// Set up user-movie relationships through ratings and reviews
// We'll add Rating and Review associations when we create those models

module.exports = {
  User,
  Movie
};