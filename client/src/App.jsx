import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import client from './utils/apolloClient';
import Navbar from './components/Layout/Navbar/Navbar';
import Footer from './components/Layout/Footer/Footer';
import Home from './pages/Home/Home';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import UserProfile from './pages/UserProfile/UserProfile';
import Error from './pages/Error/Error';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<Error />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;