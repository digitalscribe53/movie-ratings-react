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
    },
    imageSrc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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