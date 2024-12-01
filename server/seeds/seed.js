// server/seeds/seed.js
const { Movie, User, Rating, Review } = require('../models');
const tmdbAPI = require('../utils/tmdb');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

async function seedDatabase() {
  try {
    // Force sync all tables
    console.log('Syncing database...');
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // Create test user
    console.log('Creating test user...');
    const testUser = await User.create({
      username: 'testuser',
      password: await bcrypt.hash('password123', 10),
    });

    // Fetch popular movies from TMDB
    console.log('Fetching movies from TMDB...');
    const movies = await tmdbAPI.getPopularMovies(1);
    
    // Add movies to database
    console.log('Adding movies to database...');
    const createdMovies = await Movie.bulkCreate(movies);

    // Add some test ratings and reviews
    console.log('Creating test ratings and reviews...');
    for (let i = 0; i < 3; i++) {
      await Rating.create({
        userId: testUser.id,
        movieId: createdMovies[i].id,
        rating: Math.floor(Math.random() * 5) + 1,
      });

      await Review.create({
        userId: testUser.id,
        movieId: createdMovies[i].id,
        content: `Test review for ${createdMovies[i].title}`,
      });
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}


module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase();
}