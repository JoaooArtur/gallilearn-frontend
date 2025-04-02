
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/user.service';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  user: any;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Simple login function
  const login = () => {
    setIsLoading(true);
    
    // Simulate login and fetch profile
    setTimeout(async () => {
      try {
        const studentProfile = await userService.getCurrentStudent();
        
        if (!studentProfile.error) {
          setUser(studentProfile.data);
          setIsAuthenticated(true);
        } else {
          throw new Error(studentProfile.error as string);
        }
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
      // Simulate credential validation
      if (email && password) {
        const studentProfile = await userService.getCurrentStudent();
        
        if (!studentProfile.error) {
          setUser(studentProfile.data);
          setIsAuthenticated(true);
        } else {
          throw new Error(studentProfile.error as string);
        }
      } else {
        throw new Error("Email e senha são obrigatórios");
      }
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

  // Simple logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
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
