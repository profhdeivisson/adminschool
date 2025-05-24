import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUser } from '../services/getUser';
import { useQuery } from '@tanstack/react-query';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const { isLoading: isAuthLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token || user) return null;

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          throw new Error('Token expirado');
        }

        const response = await getUser(decodedToken.id);
        if (response.error) throw new Error(response.error);

        login({
          id: decodedToken.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        });

        return response.data;
      } catch (error) {
        console.error('Erro de autenticação:', error.message);
        logout();
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', userData.role.toLowerCase());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}