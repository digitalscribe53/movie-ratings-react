import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import MovieCard from '../../components/MovieCard/MovieCard';
import Pagination from '../../components/Pagination/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './Home.css';

const GET_MOVIES = gql`
  query GetMovies($page: Int) {
    movies(page: $page) {
      id
      title
      imageSrc
      averageRating
    }
    totalMovies @client # This will be handled by our server
    totalPages @client
  }
`;

const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!, $page: Int) {
    searchMovies(query: $query, page: $page) {
      movies {
        id
        title
        imageSrc
        averageRating
      }
      totalPages
      totalResults
    }
  }
`;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Query for initial movies
  const { loading: loadingMovies, error: moviesError, data: moviesData } = useQuery(GET_MOVIES, {
    variables: { page: currentPage }
  });

  // Lazy query for search
  const [searchMovies, { loading: searchLoading, error: searchError, data: searchData }] = 
    useLazyQuery(SEARCH_MOVIES);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setCurrentPage(1); // Reset to first page when searching
    setIsSearching(true);
    await searchMovies({ variables: { query: searchTerm.trim(), page: 1 } });
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    if (isSearching) {
      await searchMovies({ 
        variables: { 
          query: searchTerm.trim(),
          page: newPage
        } 
      });
    }
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
  };

  const loading = loadingMovies || searchLoading;
  const error = moviesError || searchError;
  const movies = isSearching ? searchData?.searchMovies.movies : moviesData?.movies;

  return (
    <div className="home-container">
      {/* Hero Section with Search */}
      <div className="hero-banner">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <form onSubmit={handleSearch} className="mb-5">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input 
                      className="input is-medium"
                      type="text"
                      placeholder="Search for movies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="control">
                    <button 
                      type="submit" 
                      className={`button is-primary is-medium ${loading ? 'is-loading' : ''}`}
                      disabled={loading}
                    >
                      Search
                    </button>
                  </div>
                  {isSearching && (
                    <div className="control">
                      <button 
                        type="button" 
                        className="button is-light is-medium"
                        onClick={handleClearSearch}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="container">
        {loading ? (
          <LoadingSpinner message="Loading movies..." />
        ) : error ? (
          <div className="has-text-centered">
            <p>Error loading movies: {error.message}</p>
          </div>
        ) : (
          <>
            {isSearching && searchData?.searchMovies.totalResults === 0 ? (
              <div className="has-text-centered">
                <p>No movies found matching "{searchTerm}"</p>
                <button 
                  className="button is-light mt-4" 
                  onClick={handleClearSearch}
                >
                  Show all movies
                </button>
              </div>
            ) : (
              <>
                {isSearching && (
                  <p className="mb-4">
                    Found {searchData?.searchMovies.totalResults} results for "{searchTerm}"
                  </p>
                )}
                <div className="columns is-multiline">
                  {movies?.map((movie) => (
                    <div key={movie.id} className="column is-one-quarter-desktop is-6-tablet is-12-mobile">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              {/* Pagination */}
              {totalPages > 1 && (
                  <div className="pagination-wrapper mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;