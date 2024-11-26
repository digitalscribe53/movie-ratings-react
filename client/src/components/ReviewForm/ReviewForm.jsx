import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import './ReviewForm.css';
import Notification from '../Notification/Notification';

const ADD_REVIEW = gql`
  mutation AddReview($movieId: ID!, $content: String!) {
    addReview(movieId: $movieId, content: $content) {
      id
      content
      user {
        username
      }
    }
  }
`;

const ReviewForm = ({ movieId, onReviewSubmit }) => {
  const [content, setContent] = useState('');
  const [addReview] = useMutation(ADD_REVIEW);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addReview({
        variables: {
          movieId,
          content: content.trim()
        }
      });
      setContent('');
      onReviewSubmit && onReviewSubmit();
      showNotification('Review submitted successfully!', 'success');
    } catch (error) {
      console.error('Error submitting review:', error);
      showNotification('Failed to submit review. Please try again.', 'danger');
    }
  };

  return (
    <div className="review-form">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h3 className="subtitle is-5">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <div className="control">
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              rows="4"
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="button is-primary"
          disabled={!content.trim()}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;