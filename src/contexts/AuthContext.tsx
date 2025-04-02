
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/user.service';
import { apiService } from '@/services/api.service';
import { useNavigate } from 'react-router-dom';
import { StudentProfile } from '@/services/user.service';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  user: StudentProfile | null;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  loginWithCredentials: async () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<StudentProfile | null>(null);

  // Check for token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiService.setAuthToken(token);
      fetchUserProfile();
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const studentProfile = await userService.getCurrentStudent();
      
      if ('error' in studentProfile) {
        throw new Error(studentProfile.error);
      }
      
      setUser(studentProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Simple login function for demo purposes
  const login = () => {
    setIsLoading(true);
    
    // Simulate login and fetch profile
    setTimeout(async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error('Login error:', error);
        toast({
          title: "Erro ao fazer login",
          description: "Não foi possível autenticar. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  // Credential-based login
  const loginWithCredentials = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Real authentication using the sign-in endpoint
      const response = await fetch(`${apiService.baseUrl}/students/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.token) {
        throw new Error('No token received from server');
      }
      
      // Store token and set it in API service
      localStorage.setItem('auth_token', data.token);
      apiService.setAuthToken(data.token);
      
      // Fetch user profile with the token
      await fetchUserProfile();
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao AstroQuest!",
      });
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error("Login credential error:", error);
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear token from localStorage and API service
    localStorage.removeItem('auth_token');
    apiService.setAuthToken('');
    
    // Reset state
    setIsAuthenticated(false);
    setUser(null);
    
    // Show toast
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        loginWithCredentials,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
