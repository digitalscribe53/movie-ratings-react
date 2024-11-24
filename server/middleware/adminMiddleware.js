const { AuthenticationError } = require('@apollo/server');

const adminMiddleware = (next) => (root, args, context, info) => {
  if (!context.user?.isAdmin) {
    throw new AuthenticationError('Must be an admin to perform this action');
  }
  return next(root, args, context, info);
};

module.exports = adminMiddleware;