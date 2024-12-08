import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // The navigation is already handled in AuthContext
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/" className="site-title-container">
          <span className="site-title">Movie Ratings</span>
          <span className="powered-by">POWERED BY</span>
          <img 
            src="/images/static/tmdblogo.svg" 
            alt="TMDB Logo" 
            className="tmdb-logo"
          />
        </Link>
      </div>

      <div className="auth-links">
        {user ? (
          <>
            <Link to={`/profile/${user.id}`} className="nav-link">
              Profile
            </Link>
            <button 
              onClick={logout} 
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Log Out
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            Log in or Sign up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;