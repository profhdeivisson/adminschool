import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Signup from './pages/signup';
import Admin from './pages/admin';
import Professor from './pages/professor';
import Student from './pages/student';
import AuthMiddleware from './middleware/AuthMiddleware';
import { useAuth } from './context/AuthContext';

function RoleBasedRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  const roleRoutes = {
    ADMIN: '/admin',
    PROFESSOR: '/professor',
    ALUNO: '/student'
  };

  const correctPath = roleRoutes[user.role];
  const currentPath = window.location.pathname;

  if (currentPath !== correctPath) {
    return <Navigate to={correctPath} />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={
          <AuthMiddleware>
            <RoleBasedRoute>
              <Admin />
            </RoleBasedRoute>
          </AuthMiddleware>
        } />
        <Route path="/professor" element={
          <AuthMiddleware>
            <RoleBasedRoute>
              <Professor />
            </RoleBasedRoute>
          </AuthMiddleware>
        } />
        <Route path="/student" element={
          <AuthMiddleware>
            <RoleBasedRoute>
              <Student />
            </RoleBasedRoute>
          </AuthMiddleware>
        } />
      </Routes>
    </BrowserRouter>
  );
}