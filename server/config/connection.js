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
      },
      // Prefer IPv4
      family: 4
    },
    define: {
      timestamps: true,
      underscored: true, 
      underscoredAll: true
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
      define: {
        timestamps: true, 
        underscored: true,
        underscoredAll: true
      }
    }
  );
}

module.exports = sequelize;