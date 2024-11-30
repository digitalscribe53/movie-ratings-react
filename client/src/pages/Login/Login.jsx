import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import Notification from '../../components/Notification/Notification';
import './Login.css';

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

const Login = () => {
  const [formState, setFormState] = useState({
    username: '',
    password: ''
  });
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect URL from query params
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const [login] = useMutation(LOGIN);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState }
      });

      localStorage.setItem('id_token', data.login.token);
      navigate(redirect);
      
    } catch (error) {
      setNotification({
        type: 'danger',
        message: 'Invalid username or password'
      });
    }
  };

  return (
    <div className="auth-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="columns is-centered">
        <div className="column is-5-tablet is-4-desktop">
          <form onSubmit={handleSubmit} className="box">
            <h1 className="title has-text-centered">Login</h1>
            
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="username"
                  value={formState.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field mt-5">
              <div className="control">
                <button type="submit" className="button is-primary is-fullwidth">
                  Login
                </button>
              </div>
            </div>

            <p className="has-text-centered mt-4">
              Don't have an account?{' '}
              <a href="/signup">Sign up instead</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;