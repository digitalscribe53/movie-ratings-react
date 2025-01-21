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
    
  }
`;

const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!, $page: Int) {
    searchMovies(query: $query, page: $page) {
      movies {
        id
        title
        description
        releaseYear
        imageSrc
        averageRating
        tmdbId
        voteCount
      }
      totalPages
      totalResults
    }
  }
`;

const GET_ME = gql`
  query GetMe {
    me {
      id
      username
    }
  }
`;

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Lazy query for search
  const [searchMovies, { loading: searchLoading, error: searchError, data: searchData }] = 
    useLazyQuery(SEARCH_MOVIES);

  // Query for initial movies
  const { loading: loadingMovies, error: moviesError, data: moviesData } = useQuery(GET_MOVIES, {
    variables: { page: currentPage },
    onError: (error) => console.error('GraphQL Error', error),
    onCompleted: (data) => console.log('Query completed:', data)
  });  

  const loading = loadingMovies || searchLoading;
  const error = moviesError || searchError;
  const movies = isSearching ? searchData?.searchMovies.movies : moviesData?.movies;

  const { data: userData } = useQuery(GET_ME, {
    fetchPolicy: 'network-only'
  });

  console.log('isSearching:', isSearching);
  console.log('moviesData:', moviesData);
  console.log('searchData:', searchData);
  console.log('Final movies array:', movies);

  const totalPages = isSearching 
    ? searchData?.searchMovies.totalPages 
    : 1; // Default to 1 for now since we removed it from GET_MOVIES query


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

  

  return (
    <div className="home-container">
      {/* Hero Section with Search */}
      <div className="hero-banner">
        <div className="container">
          <form onSubmit={handleSearch} className="search-form">
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
                  className={`button is-primary is-small ${loading ? 'is-loading' : ''}`}
                  disabled={loading}
                >
                  Search
                </button>
              </div>
              {isSearching && (
                <div className="control">
                  <button 
                    type="button" 
                    className="button is-light is-small"
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
  
      {/* Movies Grid */}
      <div className="movies-section" style={{ 
  maxWidth: "1200px", 
  margin: "0 auto"
}}>
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
                  <div className="movies-grid-container">
    {movies?.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
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
}
export default Home;