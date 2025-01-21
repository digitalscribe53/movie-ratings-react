import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './MovieCard.css';

// MovieCard.jsx
const MovieCard = ({ movie }) => {
  const { id, title, imageSrc, averageRating } = movie;
  const containerRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  console.log('Movie data received:', { id, title, imageSrc, averageRating });

  useEffect(() => {
    const logWidth = () => {
      if (containerRef.current) {
        console.log('Container width:', containerRef.current.offsetWidth);
        console.log('Image loaded:', !!containerRef.current.querySelector('img'));
      }
    };

    logWidth();
    window.addEventListener('resize', logWidth);
    return () => window.removeEventListener('resize', logWidth);
  }, []);

  return (
    <div className="movie-card-container">
      <Link to={`/movie/${id}`} className="movie-card">
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
              <span>⭐ {averageRating.toFixed(1)}/10</span>
            ) : (
              <span>Not yet rated</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;