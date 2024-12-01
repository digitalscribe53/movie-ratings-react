import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const AuthContext = createContext(null);

const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      isAdmin
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { data, refetch } = useQuery(GET_ME, {
    skip: !localStorage.getItem('id_token'),
  });

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
    setLoading(false);
  }, [data]);

  const login = (token, userData) => {
    localStorage.setItem('id_token', token);
    setUser(userData);
    refetch();
  };

  const logout = () => {
    localStorage.removeItem('id_token');
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isLoggedIn: !!user,
    isAdmin: user?.isAdmin || false,
    refetchUser: refetch
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};