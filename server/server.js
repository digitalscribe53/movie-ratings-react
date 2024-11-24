const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');
const { authMiddleware } = require('./middleware/auth');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

async function startServer() {
  // Create Apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo server
  await server.start();

  // Middleware
  app.use(cors({
    origin: 'http://localhost:5173', // Vite's default port
    credentials: true
  }));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  

  // Apollo GraphQL endpoint with auth middleware
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Sync database and start server
  db.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
    });
  });
}

startServer();