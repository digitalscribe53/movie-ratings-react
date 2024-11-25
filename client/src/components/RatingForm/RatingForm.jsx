import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import './RatingForm.css';

const ADD_RATING = gql`
  mutation AddRating($movieId: ID!, $rating: Int!) {
    addRating(movieId: $movieId, rating: $rating) {
      id
      rating
      movie {
        id
        averageRating
      }
    }
  }
`;

const RatingForm = ({ movieId, currentRating, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [addRating] = useMutation(ADD_RATING);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;

    try {
      await addRating({
        variables: {
          movieId,
          rating
        }
      });
      onRatingSubmit && onRatingSubmit();
      // Could add a success message here
    } catch (error) {
      console.error('Error submitting rating:', error);
      // Could add error handling UI here
    }
  };

  return (
    <div className="rating-form">
      <h3 className="subtitle is-5">Rate this movie</h3>
      <form onSubmit={handleSubmit}>
        <div className="stars-container mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star-button ${star <= (hoveredRating || rating) ? 'active' : ''}`}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
        <button 
          type="submit" 
          className="button is-primary"
          disabled={!rating}
        >
          Submit Rating
        </button>
      </form>
    </div>
  );
};

export default RatingForm;