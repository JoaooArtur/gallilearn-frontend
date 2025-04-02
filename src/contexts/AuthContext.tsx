
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api.service';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';

// User interface
interface User {
  id: string;
  name: string;
  email: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      apiService.setAuthToken(token);
      userService.setAuthToken(token);
      
      // Set basic user info from localStorage if available
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse user info:', error);
          localStorage.removeItem('user_info');
          setUser(null);
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${apiService.baseUrl}/students/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const data = await response.json();
      
      if (data && data.token) {
        // Store token
        localStorage.setItem('auth_token', data.token);
        apiService.setAuthToken(data.token);
        userService.setAuthToken(data.token);
        
        // Create basic user object
        const userData: User = {
          id: userService.CURRENT_STUDENT_ID, // Using the current student ID as default
          name: email.split('@')[0], // Using email as temporary name
          email: email
        };
        
        // Store user info
        localStorage.setItem('user_info', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error('Login failed', { description: errorMessage });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    
    // Reset API service
    apiService.setAuthToken('');
    
    // Reset state
    setUser(null);
    
    // Redirect to login
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
