import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Link, Navigate } from 'react-router-dom';
import './UserProfile.css';
import { useState } from 'react';
import Notification from '../../components/Notification/Notification';

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      username
      ratings {
        id
        rating
        createdAt
        movie {
          id
          title
          imageSrc
        }
      }
      reviews {
        id
        content
        createdAt
        updatedAt
        movie {
          id
          title
          imageSrc
        }
      }
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($reviewId: ID!, $content: String!) {
    updateReview(reviewId: $reviewId, content: $content) {
      id
      content
      updatedAt
    }
  }
`;

const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
`;

const DELETE_RATING = gql`
  mutation DeleteRating($ratingId: ID!) {
    deleteRating(ratingId: $ratingId)
  }
`;

const UserProfile = () => {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [notification, setNotification] = useState(null);

  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  const [updateReview] = useMutation(UPDATE_REVIEW);
  const [deleteReview] = useMutation(DELETE_REVIEW);
  const [deleteRating] = useMutation(DELETE_RATING);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const handleEditReview = async (reviewId) => {
    try {
      await updateReview({
        variables: {
          reviewId,
          content: editContent.trim()
        }
      });
      setEditingReviewId(null);
      refetch();
      showNotification('Review updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update review', 'danger');
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
        showNotification('Failed to delete review', 'danger');
      }
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      try {
        await deleteRating({
          variables: { ratingId }
        });
        refetch();
        showNotification('Rating deleted successfully!', 'success');
      } catch (error) {
        showNotification('Failed to delete rating', 'danger');
      }
    }
  };

  // Check if user is logged in
  if (!localStorage.getItem('id_token')) {
    return <Navigate to="/login" />;
  }

  if (loading) return (
    <div className="container has-text-centered">
      <p>Loading profile...</p>
    </div>
  );

  if (error) return (
    <div className="container has-text-centered">
      <p>Error loading profile: {error.message}</p>
    </div>
  );

  const { me: user } = data;

  return (
    <div className="profile-container container">
        {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h1 className="title is-2">{user.username}'s Profile</h1>

      {/* Ratings Section */}
      <section className="section">
        <h2 className="title is-3">My Ratings</h2>
        {user.ratings && user.ratings.length > 0 ? (
          <div className="columns is-multiline">
            {user.ratings.map(({ id, rating, createdAt, movie }) => (
              <div key={id} className="column is-one-quarter-desktop is-half-tablet">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-2by3">
                      <img src={movie.imageSrc} alt={movie.title} />
                    </figure>
                  </div>
                  <div className="card-content">
                    <p className="title is-5">{movie.title}</p>
                    <p className="subtitle is-6">Your Rating: ⭐ {rating}</p>
                    <p className="is-size-7 mb-3">
                      Rated on {new Date(parseInt(createdAt)).toLocaleDateString()}
                    </p>
                    <div className="buttons">
                      <Link to={`/movie/${movie.id}`} className="button is-small is-primary">
                        View Movie
                      </Link>
                      <button 
                        onClick={() => handleDeleteRating(id)}
                        className="button is-small is-danger"
                      >
                        Delete Rating
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't rated any movies yet.</p>
        )}
      </section>

      {/* Reviews Section */}
      <section className="section">
        <h2 className="title is-3">My Reviews</h2>
        {user.reviews && user.reviews.length > 0 ? (
          <div className="reviews-container">
            {user.reviews.map(({ id, content, createdAt, updatedAt, movie }) => (
              <div key={id} className="box review-box">
                <div className="columns">
                  <div className="column is-2">
                    <figure className="image is-2by3">
                      <img src={movie.imageSrc} alt={movie.title} />
                    </figure>
                  </div>
                  <div className="column">
                    <h3 className="title is-4">{movie.title}</h3>
                    {editingReviewId === id ? (
                      <div className="edit-review-form">
                        <textarea
                          className="textarea"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="buttons mt-3">
                          <button
                            className="button is-primary is-small"
                            onClick={() => handleEditReview(id)}
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
                    ) : (
                      <>
                        <p className="review-content">{content}</p>
                        <p className="is-size-7 mb-3">
                          Posted on {new Date(parseInt(createdAt)).toLocaleDateString()}
                          {createdAt !== updatedAt && 
                            ` (Edited on ${new Date(parseInt(updatedAt)).toLocaleDateString()})`
                          }
                        </p>
                        <div className="buttons">
                          <Link to={`/movie/${movie.id}`} className="button is-small is-primary">
                            View Movie
                          </Link>
                          <button
                            onClick={() => {
                              setEditingReviewId(id);
                              setEditContent(content);
                            }}
                            className="button is-small is-info"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(id)}
                            className="button is-small is-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't reviewed any movies yet.</p>
        )}
      </section>
    </div>
  );
};

export default UserProfile;