const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
require('dotenv').config();
const sequelize = require('./config/connection');
const syncTables = require('./config/syncTables');
const { setupAssociations } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

async function startServer() {
  try {
    // Create Apollo server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError: (error) => {
        // Log server-side errors
        console.error('GraphQL Error:', error);
        return error;
      },
    });

    // Start Apollo server
    await server.start();
    console.log('Apollo Server started');

    // Security Middleware
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "http://localhost:5173"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "https://image.tmdb.org", "data:", "http://localhost:5173"],
          connectSrc: ["'self'", "http://localhost:5173", "http://localhost:3001"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    app.enable('trust proxy'); 

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per window
      message: 'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });

    // Apply rate limiting to specific routes
    app.use('/graphql', limiter);

    // XSS Protection
    app.use(xss());

    // Global Middleware
    app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? 'https://movie-ratings.onrender.com'  
        : 'http://localhost:5173',
      credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Apollo GraphQL endpoint with auth middleware
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware
    }));

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Server Error:', err.stack);
      res.status(500).send('Something broke!');
    });

    // Set up associations
    setupAssociations();

    // Sync tables in order
    await syncTables();
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 GraphQL available at http://localhost:${PORT}/graphql`);
      console.log(`🔌 Connected to database successfully`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();