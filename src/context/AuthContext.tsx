
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api.service';
import { jwtDecode } from 'jwt-decode';

// JWT token interface
interface JwtPayload {
  Id?: string;
  [key: string]: any;
}

// Authentication response interface
interface AuthResponse {
  token: string;
}

// Auth context interface
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  studentId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Default auth context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  studentId: null,
  login: async () => {},
  logout: () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Extract studentId from JWT token
  const extractStudentIdFromToken = (authToken: string): string | null => {
    try {
      const decodedToken = jwtDecode<JwtPayload>(authToken);
      return decodedToken.Id || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  // Check if there's a token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      // Extract studentId from token
      const extractedStudentId = extractStudentIdFromToken(storedToken);
      
      // Set the token and studentId in state
      setToken(storedToken);
      setStudentId(extractedStudentId);
      setIsAuthenticated(true);
      
      // Update API service auth headers
      updateApiServiceHeaders(storedToken);
    }
    setIsInitialized(true);
  }, []);

  // Set auth token in API service headers
  const updateApiServiceHeaders = (authToken: string | null) => {
    if (authToken) {
      // Set the Authorization header for all future API requests
      apiService.setAuthToken(authToken);
      // Also set the idToken for all future API requests
      // Using the same token as both auth token and idToken
      apiService.setIdToken(authToken);
    } else {
      // Clear the Authorization header
      apiService.clearAuthToken();
      // Clear the idToken
      apiService.clearIdToken();
    }
  };

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
      
      // Extract studentId from token
      const extractedStudentId = extractStudentIdFromToken(token);
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      // Update API service headers
      updateApiServiceHeaders(token);
      
      // Update state
      setToken(token);
      setStudentId(extractedStudentId);
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
    
    // Clear API service auth headers
    updateApiServiceHeaders(null);
    
    // Update state
    setToken(null);
    setStudentId(null);
    setIsAuthenticated(false);
  };

  // Only render children when authentication state is initialized
  if (!isInitialized) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, studentId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
