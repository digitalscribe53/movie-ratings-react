const jwt = require('jsonwebtoken');
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
  // Get the operation name from the query
  const operationName = req.body.operationName;

  // Allow public access to certain queries
  if (PUBLIC_OPERATIONS.includes(operationName)) {
    return req;
  }

  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
  } catch (error) {
    console.log('Invalid token');
  }

  return req;
};

module.exports = { authMiddleware, signToken };