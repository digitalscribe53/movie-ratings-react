import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useState } from 'react'; 
import './MovieDetails.css';
import RatingForm from '../../components/RatingForm/RatingForm';
import ReviewForm from '../../components/ReviewForm/ReviewForm';
import Notification from '../../components/Notification/Notification';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';


const GET_MOVIE_DETAILS = gql`
  query GetMovie($id: ID!, $tmdbId: Int) {
    movie(id: $id) {
      id
      title
      description
      releaseYear
      imageSrc
      averageRating
      tmdbId
      ratings {
        id
        rating
        user {
          username
        }
      }
      reviews {
        id
        content
        user {
          username
        }
      }
    }
    tmdbMovieDetails(tmdbId: $tmdbId) @skip(if: true) {
      tmdbRating
      voteCount
      tmdbReviews {
        author
        content
      }
    }
  }
`;

const GET_ME = gql`
  query GetMe {
    me @optional {
      id
      username
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $content: String!) {
    updateReview(reviewId: $reviewId, content: $content) {
      id
      content
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
`;

const MovieDetails = () => {
  const { id } = useParams();
  

  // Hooks
  
  const [updateReview] = useMutation(UPDATE_REVIEW);
  const [deleteReview] = useMutation(DELETE_REVIEW);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [notification, setNotification] = useState(null);
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Get current user
  const { data: userData, error: userError } = useQuery(GET_ME, {
    onError: () => {} // Ignore auth errors
  });
  const currentUser = userData?.me;
  const isLoggedIn = !!currentUser;

  const { loading, error, data, refetch } = useQuery(GET_MOVIE_DETAILS, {
    variables: { 
      id,
      tmdbId: null // Initialize as null, update after we have movie data
    },
    onCompleted: (movieData) => {
      if (movieData?.movie?.tmdbId) {
        // Refetch with tmdbId once we have it
        refetch({ id, tmdbId: movieData.movie.tmdbId });
      }
    }
  });

  // Handler functions
  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditContent(review.content);
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      await updateReview({
        variables: {
          reviewId,
          content: editContent.trim()
        }
      });
      setEditingReviewId(null);
      setEditContent('');
      refetch();
      showNotification('Review updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating review:', error);
      showNotification('Failed to update review. Please try again.', 'danger');
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview({
          variables: { reviewId }
        });
        refetch();
        showNotification('Review deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting review:', error);
        showNotification('Failed to delete review. Please try again.', 'danger');
      }
    }
  };

  // RenderReview function
  const renderReview = (review) => {
    const isEditing = editingReviewId === review.id;
    const isAuthor = review.user.username === currentUser?.username;

    if (isEditing) {
      return (
        <div key={review.id} className="box">
          <textarea
            className="textarea mb-3"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="buttons">
            <button
              className="button is-primary is-small"
              onClick={() => handleUpdateReview(review.id)}
            >
              Save
            </button>
            <button
              className="button is-light is-small"
              onClick={() => setEditingReviewId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={review.id} className="box">
        <p className="review-content">{review.content}</p>
        <div className="review-footer">
          <p className="review-author is-size-7">
            - {review.user.username}
          </p>
          {isAuthor && (
            <div className="review-actions">
              <button
                className="button is-info is-small mr-2"
                onClick={() => handleEditClick(review)}
              >
                Edit
              </button>
              <button
                className="button is-danger is-small"
                onClick={() => handleDeleteReview(review.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  

  if (loading) return <LoadingSpinner message="Loading movie details..." />;

  if (error) return (
    <div className="container has-text-centered">
      <p>Error loading movie details: {error.message}</p>
    </div>
  );

  const { movie } = data;

  return (
    <div className="movie-details container">
      {notification && (
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(null)}
      />
    )}
      <div className="columns">
        {/* Movie Poster */}
        <div className="column is-one-quarter">
          <div className="card">
            <div className="card-image">
              <figure className="image is-2by3">
                <img 
                  src={movie.imageSrc} 
                  alt={movie.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder-movie.jpg';
                  }}
                />
              </figure>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="column">
          <h1 className="title is-2">{movie.title}</h1>
          
          {/* Ratings Section */}
          <div className="ratings-section mb-4">
            <h2 className="subtitle is-4">Ratings</h2>
            <div className="ratings-container">
              <div className="local-rating">
                <p className="is-size-5">
                  Movie Ratings App: ⭐ {movie.averageRating?.toFixed(1) || 'Not rated'}
                </p>
              </div>
              {data.tmdbMovieDetails && (
                <div className="tmdb-rating">
                  <p className="is-size-5">
                    TMDB Rating: ⭐ {data.tmdbMovieDetails.tmdbRating?.toFixed(1)}
                    <span className="is-size-6"> ({data.tmdbMovieDetails.voteCount} votes)</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-5">
            <h2 className="subtitle is-4">Release Year</h2>
            <p>{movie.releaseYear}</p>
          </div>

          <div className="mb-5">
            <h2 className="subtitle is-4">Description</h2>
            <p>{movie.description}</p>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2 className="subtitle is-3">Reviews</h2>
            
            {/* Local Reviews */}
            <div className="local-reviews mb-5">
  <h3 className="subtitle is-4">Movie Ratings App Reviews</h3>
  {movie.reviews && movie.reviews.length > 0 ? (
    <div className="reviews-list">
      {movie.reviews.map(review => renderReview(review))}
    </div>
  ) : (
    <p>No reviews yet. Be the first to review!</p>
  )}
</div>

            {/* TMDB Reviews */}
            {data.tmdbMovieDetails?.tmdbReviews && (
              <div className="tmdb-reviews">
                <h3 className="subtitle is-4">TMDB Reviews</h3>
                <div className="reviews-list">
                  {data.tmdbMovieDetails.tmdbReviews.map((review, index) => (
                    <div key={index} className="box">
                      <p className="review-content">{review.content}</p>
                      <p className="review-author is-size-7 mt-2">
                        - {review.author}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating and Review Forms for logged-in users */}
            
            {isLoggedIn && (
  <div className="user-interaction mb-5">
    <div className="columns">
      <div className="column is-half">
        <RatingForm 
          movieId={movie.id} 
          onRatingSubmit={() => {
            // Refetch the movie query to update ratings
            refetch();
          }}
        />
      </div>
    </div>
    <div className="columns">
      <div className="column">
        <ReviewForm 
          movieId={movie.id}
          onReviewSubmit={() => {
            // Refetch the movie query to update reviews
            refetch();
          }}
        />
      </div>
    </div>
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;