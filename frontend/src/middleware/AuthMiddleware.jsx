import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AuthMiddleware = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Set a message in localStorage that the login page will check for
    localStorage.setItem('authRedirectMessage', 'Você precisa fazer login para acessar esta página');
    
    // Redirect to login page
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AuthMiddleware;