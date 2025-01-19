const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if running in production 
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

} else {
  // Local development configuration
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: 5432,
      logging: false,
    }
  );
}

  const syncTables = async () => {
    try {
      // Create tables in correct order
      await sequelize.query('DROP TABLE IF EXISTS "review" CASCADE');
      await sequelize.query('DROP TABLE IF EXISTS "rating" CASCADE');
      await sequelize.query('DROP TABLE IF EXISTS "movie" CASCADE');
      await sequelize.query('DROP TABLE IF EXISTS "user" CASCADE');
      
      // Create tables in order
      await User.sync({ force: true });
      await Movie.sync({ force: true });
      await Rating.sync({ force: true });
      await Review.sync({ force: true });
      
      console.log('All tables created successfully');
    } catch (error) {
      console.error('Error syncing tables:', error);
      throw error;
    }
  };



module.exports = {
  sequelize,
  syncTables
};