const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Rating extends Model {}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
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
    modelName: 'rating',
  }
);

// Now let's update models/index.js to include the Rating associations:
const User = require('./User');
const Movie = require('./Movie');
const Rating = require('./Rating');

// User-Rating Association
User.hasMany(Rating, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Rating.belongsTo(User, {
  foreignKey: 'userId',
});

// Movie-Rating Association
Movie.hasMany(Rating, {
  foreignKey: 'movieId',
  onDelete: 'CASCADE',
});

Rating.belongsTo(Movie, {
  foreignKey: 'movieId',
});

module.exports = {
  User,
  Movie,
  Rating,
};