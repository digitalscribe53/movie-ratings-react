const typeDefs = `#graphql
  type Movie {
    id: ID!
    title: String!
    description: String!
    releaseYear: Int!
    imageSrc: String!
    averageRating: Float
    tmdbId: Int
    ratings: [Rating]
    reviews: [Review]
  }

  type User {
    id: ID!
    username: String!
    ratings: [Rating]
    reviews: [Review]
  }

  type Rating {
    id: ID!
    rating: Int!
    userId: ID!
    movieId: ID!
    user: User
    movie: Movie
  }

  type Review {
    id: ID!
    content: String!
    userId: ID!
    movieId: ID!
    user: User
    movie: Movie
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    movies(page: Int): [Movie]
    movie(id: ID!): Movie
    me: User
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    addRating(movieId: ID!, rating: Int!): Rating
    addReview(movieId: ID!, content: String!): Review
    updateReview(reviewId: ID!, content: String!): Review
    deleteReview(reviewId: ID!): Boolean
  }
`;

module.exports = typeDefs;