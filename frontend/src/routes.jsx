import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import App from './App';
import Signup from './pages/signup';
import Admin from './pages/admin';
import AuthMiddleware from './middleware/AuthMiddleware';

// Component to handle root class changes based on route
function RootClassHandler() {
  const location = useLocation();
  
  useEffect(() => {
    const rootElement = document.getElementById('root');
    
    if (location.pathname === '/admin') {
      rootElement.classList.add('admin-page');
    } else {
      rootElement.classList.remove('admin-page');
    }
    
    // Cleanup function to remove class when component unmounts
    return () => {
      rootElement.classList.remove('admin-page');
    };
  }, [location]);
  
  return null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <RootClassHandler />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={
          <AuthMiddleware>
            <Admin />
          </AuthMiddleware>
        } />
      </Routes>
    </BrowserRouter>
  );
}