import './LoadingOverlay.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <LoadingSpinner />
    </div>
  );
};