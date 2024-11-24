const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to create tokens
const signToken = ({ username, id, isAdmin }) => {
  return jwt.sign({ username, id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });
};

// Middleware to verify tokens
const authMiddleware = async ({ req }) => {
  // Allow token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If token is in authorization header, separate "Bearer" from token
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    // Verify token and extract user data
    const { data } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
  } catch (error) {
    console.log('Invalid token');
  }

  return req;
};

module.exports = { authMiddleware, signToken };