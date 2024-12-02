const { AuthenticationError } = require('@apollo/server');

const PUBLIC_OPERATIONS = [
  'GetMovie',
  'movie',
  'GetMovies',
  'SearchMovies',
  'GetPopularMovies',
  'tmdbMovieDetails'
];

const checkAuth = (context, operationType) => {
  if (PUBLIC_OPERATIONS.includes(operationType)) {
    return context.user || null;
  }
  
  if (!context.user) {
    throw new AuthenticationError('You need to be logged in!');
  }
  
  return context.user;
};

module.exports = checkAuth;