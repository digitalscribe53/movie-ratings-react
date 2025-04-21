const sequelize = require('./connection');
const { User, Movie, Rating, Review } = require('../models');

const syncTables = async () => {
    try {
      // Only drop tables in development mode
      if (process.env.NODE_ENV === 'development') {
        await sequelize.query('DROP TABLE IF EXISTS "review" CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS "rating" CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS "movie" CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS "user" CASCADE');
        
        await User.sync({ force: true });
        await Movie.sync({ force: true });
        await Rating.sync({ force: true });
        await Review.sync({ force: true });
      } else {
        // In production, just sync tables without dropping
        await User.sync({ alter: true });
        await Movie.sync({ alter: true });
        await Rating.sync({ alter: true });
        await Review.sync({ alter: true });
      }
      
      console.log('All tables created/updated successfully');
    } catch (error) {
      console.error('Error syncing tables:', error);
      throw error;
    }
  };

module.exports = syncTables;