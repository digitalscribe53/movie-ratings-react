const User = require('./User');
const Movie = require('./Movie');
const Rating = require('./Rating');
const Review = require('./Review');

// User-Rating Associations
User.hasMany(Rating, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Rating.belongsTo(User, {
  foreignKey: 'userId',
});

// Movie-Rating Associations
Movie.hasMany(Rating, {
  foreignKey: 'movieId',
  onDelete: 'CASCADE',
});

Rating.belongsTo(Movie, {
  foreignKey: 'movieId',
});

// User-Review Associations
User.hasMany(Review, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Review.belongsTo(User, {
  foreignKey: 'userId',
});

// Movie-Review Associations
Movie.hasMany(Review, {
  foreignKey: 'movieId',
  onDelete: 'CASCADE',
});

Review.belongsTo(Movie, {
  foreignKey: 'movieId',
});

module.exports = {
  User,
  Movie,
  Rating,
  Review,
};