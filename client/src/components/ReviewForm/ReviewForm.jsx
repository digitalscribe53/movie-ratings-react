import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import './ReviewForm.css';

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
      // Could add a success message here
    } catch (error) {
      console.error('Error submitting review:', error);
      // Could add error handling UI here
    }
  };

  return (
    <div className="review-form">
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