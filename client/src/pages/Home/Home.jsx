import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import MovieCard from '../../components/MovieCard/MovieCard';
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

const Home = () => {
  const { loading, error, data } = useQuery(GET_MOVIES, {
    variables: { page: 1 }
  });

  if (loading) return (
    <div className="container has-text-centered">
      <p>Loading movies...</p>
    </div>
  );

  if (error) return (
    <div className="container has-text-centered">
      <p>Error loading movies: {error.message}</p>
    </div>
  );

  return (
    <div className="home-container">
      {/* Hero Section with Search */}
      <div className="hero-banner">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <form id="search-form" className="mb-5">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input 
                      className="input is-medium" 
                      type="text" 
                      placeholder="Search for movies..."
                    />
                  </div>
                  <div className="control">
                    <button className="button is-primary is-medium">
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="container">
        <div className="columns is-multiline">
          {data?.movies.map((movie) => (
            <div key={movie.id} className="column is-one-quarter-desktop is-6-tablet is-12-mobile">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;