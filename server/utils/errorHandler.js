const { GraphQLError } = require('graphql');

class ErrorHandler {
  static badRequest(message = 'Bad request') {
    return new GraphQLError(message, {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 }
      }
    });
  }

  static unauthorized(message = 'You must be logged in') {
    return new GraphQLError(message, {
      extensions: {
        code: 'UNAUTHORIZED',
        http: { status: 401 }
      }
    });
  }

  static forbidden(message = 'You do not have permission to perform this action') {
    return new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 }
      }
    });
  }

  static notFound(message = 'Resource not found') {
    return new GraphQLError(message, {
      extensions: {
        code: 'NOT_FOUND',
        http: { status: 404 }
      }
    });
  }

  static validationError(message = 'Validation error', errors = {}) {
    return new GraphQLError(message, {
      extensions: {
        code: 'VALIDATION_ERROR',
        http: { status: 422 },
        errors
      }
    });
  }

  static databaseError(message = 'Database error', originalError = null) {
    console.error('Database Error:', originalError);
    return new GraphQLError(message, {
      extensions: {
        code: 'DATABASE_ERROR',
        http: { status: 500 }
      }
    });
  }

  static tmdbError(message = 'TMDB API error', originalError = null) {
    console.error('TMDB API Error:', originalError);
    return new GraphQLError(message, {
      extensions: {
        code: 'TMDB_ERROR',
        http: { status: 502 }
      }
    });
  }
}

module.exports = ErrorHandler;