import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext'; // Adjust the path if needed

const ProtectedRoute = ({ element }) => {
  const { loggedIn } = useContext(AuthContext);

  return loggedIn ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
