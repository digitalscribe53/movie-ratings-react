import { Link, useLocation } from 'react-router-dom';
import './Error.css';

const Error = () => {
  const location = useLocation();

  return (
    <div className="error-container">
      <div className="content has-text-centered">
        <h1 className="title is-1">404</h1>
        <h2 className="subtitle is-3">Page Not Found</h2>
        <p className="mb-4">
          Sorry, we couldn't find the page: {location.pathname}
        </p>
        <Link to="/" className="button is-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Error;