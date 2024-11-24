import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const { id, title, imageSrc, averageRating } = movie;

  return (
    <Link to={`/movie/${id}`} className="movie-link">
      <div className="card movie-card">
        <div className="card-image">
          <figure className="image is-2by3">
            <img 
              src={imageSrc} 
              alt={title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder-movie.jpg'; // Fallback image
              }}
            />
          </figure>
        </div>
        <div className="card-content has-text-centered">
          <p className="title is-5">{title}</p>
          <div className="rating">
            {averageRating > 0 ? (
              <span>⭐ {averageRating.toFixed(1)}</span>
            ) : (
              <span>Not yet rated</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;