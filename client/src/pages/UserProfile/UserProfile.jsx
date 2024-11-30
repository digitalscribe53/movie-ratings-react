import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Notification from '../../components/Notification/Notification';
import Pagination from '../../components/Pagination/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './UserProfile.css';


const GET_USER_PROFILE = gql`
  query GetUserProfile($ratingsPage: Int, $reviewsPage: Int) {
    me {
      id
      username
      ratings(page: $ratingsPage) {
        items {
          id
          rating
          createdAt
          movie {
            id
            title
            imageSrc
          }
        }
        totalPages
        currentPage
      }
      reviews(page: $reviewsPage) {
        items {
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
        totalPages
        currentPage
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
  const [ratingsPage, setRatingsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [notification, setNotification] = useState(null);
  
  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { ratingsPage, reviewsPage }
  });
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

  const handleRatingsPageChange = (newPage) => {
    setRatingsPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewsPageChange = (newPage) => {
    setReviewsPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if user is logged in
  if (!localStorage.getItem('id_token')) {
    return <Navigate to="/login" />;
  }

  if (loading) return <LoadingSpinner message="Loading profile..." />;

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
        {user.ratings?.items && user.ratings.items.length > 0 ? (
          <>
            <div className="columns is-multiline">
              {user.ratings.items.map(({ id, rating, createdAt, movie }) => (
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
            {user.ratings.totalPages > 1 && (
              <div className="pagination-wrapper mt-6">
                <Pagination
                  currentPage={user.ratings.currentPage}
                  totalPages={user.ratings.totalPages}
                  onPageChange={handleRatingsPageChange}
                />
              </div>
            )}
          </>
        ) : (
          <p>You haven't rated any movies yet.</p>
        )}
      </section>

      {/* Reviews Section */}
      <section className="section">
        <h2 className="title is-3">My Reviews</h2>
        {user.reviews?.items && user.reviews.items.length > 0 ? (
          <>
            <div className="reviews-container">
              {user.reviews.items.map(({ id, content, createdAt, updatedAt, movie }) => (
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
            {user.reviews.totalPages > 1 && (
              <div className="pagination-wrapper mt-6">
                <Pagination
                  currentPage={user.reviews.currentPage}
                  totalPages={user.reviews.totalPages}
                  onPageChange={handleReviewsPageChange}
                />
              </div>
            )}
          </>
        ) : (
          <p>You haven't reviewed any movies yet.</p>
        )}
      </section>
    </div>
  );
};

export default UserProfile;