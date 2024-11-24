import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('id_token'));

  const handleLogout = () => {
    localStorage.removeItem('id_token');
    setIsLoggedIn(false);
    navigate('/');
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
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="nav-link mr-4">
                My Ratings
              </Link>
              <button 
                onClick={handleLogout} 
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;