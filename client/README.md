# Movie Ratings App
A full-stack web application that allows users to discover, rate, and review movies. Built with React and powered by The Movie Database (TMDB) API.

## Description
Movie Ratings App combines the extensive movie data from TMDB with a personalized rating and review system. Users can explore current popular movies, search for specific titles, and contribute their own ratings and reviews while also viewing TMDB user reviews.

## Technologies Used
### Frontend

React - Chosen for its efficient component-based architecture and virtual DOM, enabling smooth user interactions and state management especially important for the dynamic movie search and rating features.

Apollo Client - Implements GraphQL on the client side, providing robust data management and caching capabilities that enhance the app's performance when fetching and updating movie data.

Bulma CSS Framework - Selected for its modern, responsive design system that doesn't require JavaScript dependencies, allowing for rapid development of a clean, professional UI.

### Backend

Node.js & Express - Provides a robust foundation for the server-side application, handling API requests and database operations efficiently.
Apollo Server - GraphQL implementation that offers a type-safe, single endpoint API solution, making it easier to manage complex data relationships between movies, reviews, and users.
PostgreSQL with Sequelize ORM - Chosen for its robust relational database capabilities, particularly beneficial for managing relationships between users, reviews, and movie ratings.

### Authentication

JSON Web Tokens (JWT) - Implements secure, stateless authentication for protected routes and user-specific features.

### External API Integration

TMDB API - Provides comprehensive movie data, including details, ratings, and reviews from their extensive database.

## Features

User authentication (signup/login)
Browse current popular movies
Search movie database
View detailed movie information
Rate movies on a 1-10 scale
Write and manage movie reviews
View TMDB user reviews
Responsive design for all screen sizes

## Future Enhancements

User profile customization
Advanced movie filtering options
Social features for sharing reviews
Watchlist functionality
Movie recommendations based on user ratings

## Installation

Clone the repository
git clone [repository-url]

Install dependencies for both client and server

cd server
npm install

cd ../client
npm install

Set up environment variables
### In server directory, create .env file with:
TMDB_API_KEY=[your-tmdb-api-key]
DB_NAME=[your-database-name]
DB_USER=[your-database-username]
DB_PASSWORD=[your-database-password]
DB_HOST=localhost
JWT_SECRET=[your-jwt-secret]

Start the development servers

cd server
npm run dev

### Start client in new terminal
cd client
npm run dev

Credits

Movie data provided by The Movie Database (TMDB)
Created by Kent Ball 