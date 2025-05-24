import { Navigate } from 'react-router-dom';

const AuthMiddleware = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    localStorage.setItem('authRedirectMessage', 'Você precisa fazer login para acessar esta página');
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AuthMiddleware;