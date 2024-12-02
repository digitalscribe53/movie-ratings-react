const typeDefs = `#graphql

  type PaginatedRatings {
    items: [Rating]!
    totalPages: Int!
    currentPage: Int!
  }

  type PaginatedReviews {
    items: [Review]!
    totalPages: Int!
    currentPage: Int!
  }

  type User {
    id: ID!
    username: String!
    isAdmin: Boolean
    ratings(page: Int): PaginatedRatings
    reviews(page: Int): PaginatedReviews
  }

  type Movie {
    id: ID!
    title: String!
    description: String!
    releaseYear: Int!
    imageSrc: String!
    averageRating: Float
    tmdbId: Int
    voteCount: Int
    ratings: [Rating]
    reviews: [Review]
  }

  type SearchResult {
    movies: [Movie]!
    totalPages: Int!
    totalResults: Int!
  }

  type Rating {
    id: ID!
    rating: Int!
    userId: ID!
    movieId: ID!
    user: User
    movie: Movie
    createdAt: String
  }

  type Review {
    id: ID!
    content: String!
    userId: ID!
    movieId: ID!
    user: User
    movie: Movie
    createdAt: String
  }

  type Auth {
    token: String!
    user: User!
  }

  type TMDBMovie {
    tmdbRating: Float
    tmdbReviews: [TMDBReview]
    voteCount: Int
  }

  type TMDBReview {
    id: ID!
    author: String
    content: String
  }

  type Query {
    me: User
    user(id: ID!): User
    users: [User]
    movie(id: ID!): Movie
    movies(page: Int, limit: Int): [Movie]
    moviesByTitle(title: String!): [Movie]
    tmdbMovieDetails(tmdbId: Int): TMDBMovie
    searchMovies(query: String!, page: Int): SearchResult!
    getRecommendations(tmdbId: Int!, page: Int): [Movie]!
    getPopularMovies(page: Int): [Movie]!
  }

  type Mutation {
    # Auth mutations
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    
    # Movie mutations
    addMovie(
      title: String!
      description: String!
      releaseYear: Int!
      imageSrc: String!
      tmdbId: Int
    ): Movie
    
    # Rating mutations
    addRating(movieId: ID!, rating: Int!): Rating
    updateRating(ratingId: ID!, rating: Int!): Rating
    deleteRating(ratingId: ID!): Boolean
    
    # Review mutations
    addReview(movieId: ID!, content: String!): Review
    updateReview(reviewId: ID!, content: String!): Review
    deleteReview(reviewId: ID!): Boolean
  }
`;

module.exports = typeDefs;