import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // The navigation is already handled in AuthContext
  };

  return (
    <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <Link to="/" className="navbar-item nav-link">
        Home
      </Link>

      <div className="navbar-brand is-flex-grow-1">
        <div className="navbar-item site-title-container">
          <span className="site-title">Movie Ratings</span>
          <span className="powered-by">POWERED BY</span>
          <img 
            src="/images/static/tmdblogo.svg" 
            alt="TMDB Logo" 
            className="tmdb-logo"
          />
        </div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          {user ? (
            <div className="buttons">
              <Link 
  to={`/profile/${user.id}`} 
  className="button is-light mr-2"
>
  My Profile
</Link>
              <button 
                onClick={handleLogout} 
                className="button is-primary"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="buttons">
              <Link to="/signup" className="button is-primary">
                <strong>Sign up</strong>
              </Link>
              <Link to="/login" className="button is-light">
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;