import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthMiddleware = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    localStorage.setItem('authRedirectMessage', 'Você precisa fazer login para acessar esta página');
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AuthMiddleware;