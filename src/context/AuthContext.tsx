
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api.service';

// Authentication response interface
interface AuthResponse {
  token: string;
}

// Auth context interface
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Default auth context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: async () => {},
  logout: () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if there's a token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.post<{ email: string; password: string }, AuthResponse>(
        '/students/sign-in',
        { email, password }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      const { token } = response.data as AuthResponse;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      // Update state
      setToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    
    // Update state
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
