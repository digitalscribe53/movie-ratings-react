const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Movie extends Model {}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'release_year',
    },
    imageSrc: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'image_src',
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      field: 'average_rating',
    },
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'tmdb_id',
    },
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'vote_count',
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'movie',
  }
);

module.exports = Movie;