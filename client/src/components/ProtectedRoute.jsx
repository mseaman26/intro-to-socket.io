import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext'; // Adjust the path if needed
import auth from '../utils/auth';

const ProtectedRoute = ({ element }) => {
  const { token  } = useContext(AuthContext);
  return (token && !auth.isTokenExpired(token)) ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
