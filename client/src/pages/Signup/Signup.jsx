import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification/Notification';
import './Signup.css';

const ADD_USER = gql`
  mutation AddUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const [addUser] = useMutation(ADD_USER);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formState.password !== formState.confirmPassword) {
      setNotification({
        type: 'danger',
        message: 'Passwords do not match'
      });
      return;
    }

    try {
      const { data } = await addUser({
        variables: {
          username: formState.username,
          password: formState.password
        }
      });

      localStorage.setItem('id_token', data.addUser.token);
      navigate('/');
      
    } catch (error) {
      setNotification({
        type: 'danger',
        message: error.message
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
      
      <div className="columns is-centered" style={{width: '100%'}}>
        <div className="column is-5-tablet is-4-desktop">
          <form onSubmit={handleSubmit} className="box">
            <h1 className="title has-text-centered">Sign Up</h1>
            
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
                  minLength={3}
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
                  minLength={6}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirm Password</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  name="confirmPassword"
                  value={formState.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field mt-5">
              <div className="control">
                <button type="submit" className="button is-primary is-fullwidth">
                  Sign Up
                </button>
              </div>
            </div>

            <p className="has-text-centered mt-4">
              Already have an account?{' '}
              <a href="/login">Log in instead</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;