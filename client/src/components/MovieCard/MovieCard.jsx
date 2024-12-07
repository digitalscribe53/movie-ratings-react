import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const { id, title, imageSrc, averageRating } = movie;

  return (
    <Link to={`/movie/${id}`}>
      <div className="movie-card">
        <div className="card-image">
          <img 
            src={imageSrc} 
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder-movie.jpg';
            }}
          />
        </div>
        <div className="card-content">
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