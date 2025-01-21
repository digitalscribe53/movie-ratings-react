import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false); 
  const handleLogout = () => {
    logout(); // The navigation is already handled in AuthContext
    setShowDropdown(false); 
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
        <div className="user-menu-container">
          <div 
            className="user-icon-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <img
              src="/images/static/images111.png"
              alt="User Menu"
              className="user-icon"
            />
            {showDropdown && (
              <div className="dropdown-menu">
                {user ? (
                  <>
                    <Link 
                      to={`/profile/${user.id}`} 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Log in
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;