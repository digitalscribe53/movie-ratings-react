import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import './RatingForm.css';
import Notification from '../Notification/Notification';

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
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [notification, setNotification] = useState(null);
  const [addRating] = useMutation(ADD_RATING);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

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
      showNotification('Rating submitted successfully!', 'success');
    } catch (error) {
      console.error('Error submitting rating:', error);
      showNotification('Failed to submit rating. Please try again.', 'danger');
    }
  };

  return (
    <div className="rating-form">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h3 className="subtitle is-5">Rate this movie</h3>
      <form onSubmit={handleSubmit}>
        <div className="stars-outer-container">
          <div className="stars-row">
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
        <div className="stars-row">
            {[6, 7, 8, 9, 10].map((star) => (
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
        </div>
        <div className="rating-value mb-3">
          {hoveredRating || rating}/10
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