import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  
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
        <div className="user-menu-container" ref={dropdownRef}>
          <div 
            className="user-icon-wrapper"
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
          >
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          
          {showDropdown && (
            <div 
              className="dropdown-menu"
              style={{ display: 'block' }}
            >
              {user ? (
                <>
                  <Link to={`/profile/${user.id}`} className="dropdown-item">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="dropdown-item"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item">
                    Log in
                  </Link>
                  <Link to="/signup" className="dropdown-item">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;