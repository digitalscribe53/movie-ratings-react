# 🎬 Movie Ratings App

A full-stack web application that allows users to discover, rate, and review movies. Built with React and Node.js, this app integrates with The Movie Database (TMDB) API to provide up-to-date movie information while maintaining a local database of user ratings and reviews.

## 🚀 Live Demo

**[View Live Application](https://movie-ratings.onrender.com/)**

## ✨ Features

- **🎭 Movie Discovery**: Browse popular movies with dynamic loading
- **🔍 Smart Search**: Find specific movies with real-time search functionality
- **👤 User Authentication**: Secure signup and login system
- **⭐ Movie Ratings**: Rate movies on a scale of 1-10
- **📝 Reviews System**: Write, edit, and delete detailed movie reviews
- **📊 Dual Rating Display**: View both TMDB and local user ratings
- **📱 Responsive Design**: Optimized for mobile and desktop viewing
- **👥 User Profiles**: Personal pages showing ratings and reviews history

## 🛠️ Tech Stack

### Frontend
- **React** - Component-based UI library
- **Apollo Client** - GraphQL client for data management
- **Bulma** - Modern CSS framework
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **GraphQL** - Query language and runtime
- **Sequelize ORM** - Database object-relational mapping
- **PostgreSQL** - Relational database
- **TMDB API** - Movie data integration

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- TMDB API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/movie-ratings-app.git
   cd movie-ratings-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   TMDB_API_KEY=your_tmdb_api_key
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run db:setup
   ```

5. **Start the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   # Backend
   npm run server
   
   # Frontend (in another terminal)
   cd client && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend GraphQL Playground: http://localhost:4000/graphql

## 📖 Usage Guide

### Browsing Movies
- The home page displays popular movies from TMDB
- Scroll down for infinite loading of more movies
- Click on any movie poster to view detailed information

### Searching
- Use the search bar in the navigation to find specific movies
- Results update in real-time as you type
- Search covers movie titles, genres, and descriptions

### Rating & Reviewing
1. **Create an account** or log in to access rating features
2. **Click on a movie** to view its detail page
3. **Submit a rating** using the star rating component (1-10 scale)
4. **Write a review** in the text area and submit
5. **Edit or delete** your reviews from your profile page

### Profile Management
- Access your profile to view all your ratings and reviews
- Edit or delete existing reviews
- Track your movie watching history

## 🔧 API Integration

This application integrates with **The Movie Database (TMDB) API** to provide:

- **Popular Movies**: Trending and popular movie listings
- **Search Functionality**: Comprehensive movie search capabilities
- **Movie Details**: Complete movie information including cast, crew, and metadata
- **High-Quality Images**: Movie posters, backdrops, and promotional images

## 🚀 Deployment

The application is deployed on Render with the following configuration:

- **Frontend**: Static site deployment
- **Backend**: Web service with PostgreSQL database
- **Environment**: Production-ready with optimized builds

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[The Movie Database (TMDB)](https://www.themoviedb.org/)** for providing comprehensive movie data
- **React** and **Node.js** communities for excellent documentation and resources
- **Bulma** for the clean and responsive CSS framework

## 📧 Contact

**Email**: digitalscribe53@gmail.com

**Project Link**: [https://github.com/yourusername/movie-ratings-app](https://github.com/yourusername/movie-ratings-app)

---

⭐ If you found this project helpful, please give it a star on GitHub!