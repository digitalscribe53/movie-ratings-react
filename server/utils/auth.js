const { AuthenticationError } = require('@apollo/server');

const checkAuth = (context) => {
  if (!context.user) {
    throw new AuthenticationError('You need to be logged in!');
  }
  return context.user;
};

module.exports = checkAuth;