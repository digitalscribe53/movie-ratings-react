import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          This product uses the TMDB API but is not endorsed or certified by TMDB. Movie Ratings App was designed in 2024 by Kent Ball.
          <a 
            href="https://spectacular-kitsune-fb2d4e.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Visit my portfolio here
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;