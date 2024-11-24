const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 1000], // Minimum 1 character, maximum 1000 characters
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    movieId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'movie',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'review',
  }
);

// Update models/index.js to include Review associations:
const User = require('./User');
const Movie = require('./Movie');
const Rating = require('./Rating');
const Review = require('./Review');

// Existing Rating associations...

// User-Review Association
User.hasMany(Review, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Review.belongsTo(User, {
  foreignKey: 'userId',
});

// Movie-Review Association
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