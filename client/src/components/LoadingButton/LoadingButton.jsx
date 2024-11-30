import './LoadingButton.css';

const LoadingButton = ({ 
  isLoading, 
  children, 
  className = 'button is-primary', 
  ...props 
}) => {
  return (
    <button 
      className={`${className} ${isLoading ? 'is-loading' : ''}`}
      disabled={isLoading}
      {...props}
    >
      {children}
    </button>
  );
};

export default LoadingButton;