// server/utils/auth.js
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('@apollo/server');
require('dotenv').config();

const PUBLIC_OPERATIONS = [
  'GetMovie',
  'movie',
  'GetMovies',
  'SearchMovies',
  'GetPopularMovies',
  'tmdbMovieDetails'
];

const signToken = ({ username, id, isAdmin }) => {
  return jwt.sign({ username, id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
};

const authMiddleware = async ({ req }) => {
  const operationName = req.body?.operationName;

  if (PUBLIC_OPERATIONS.includes(operationName)) {
    return req;
  }

  let token = req.body?.token || req.query?.token || req.headers?.authorization;

  if (req.headers?.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    console.log('Invalid token');
  }

  return req;
};

const checkAuth = (context, operationType) => {
  if (PUBLIC_OPERATIONS.includes(operationType)) {
    return context.user || null;
  }
  
  if (!context.user) {
    throw new AuthenticationError('You need to be logged in!');
  }
  
  return context.user;
};

module.exports = { 
  signToken, 
  authMiddleware, 
  checkAuth 
};