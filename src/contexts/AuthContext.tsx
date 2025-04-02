
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
  isLoading: true,
  login: () => {},
  logout: () => {},
  loginWithCredentials: async () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const {
    isAuthenticated,
    loginWithRedirect,
    loginWithCredentials: auth0LoginWithCredentials,
    logout: auth0Logout,
    user: auth0User,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();
  const [user, setUser] = useState<any>(null);

  // Sync Auth0 user with our backend and update API token
  useEffect(() => {
    if (isAuthenticated && auth0User) {
      const updateUserAndToken = async () => {
        try {
          // Get token and set it in the API service
          const token = await getAccessTokenSilently();
          userService.setAuthToken(token);
          
          // Fetch user profile
          const studentProfile = await userService.getCurrentStudent();
          setUser(studentProfile);
        } catch (error) {
          console.error('Failed to fetch user profile or token:', error);
          toast({
            title: "Erro",
            description: "Falha ao carregar perfil do usuário",
            variant: "destructive",
          });
        }
      };
      
      updateUserAndToken();
    }
  }, [isAuthenticated, auth0User, getAccessTokenSilently, toast]);

  const login = () => {
    loginWithRedirect();
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      await auth0LoginWithCredentials({ username: email, password });
      // The Auth0 useEffect above will handle the token and profile fetching
    } catch (error) {
      console.error("Login credential error:", error);
      throw error;
    }
  };

  const logout = () => {
    auth0Logout({ 
      logoutParams: {
        returnTo: window.location.origin,
      }
    });
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
        user: user || auth0User,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
