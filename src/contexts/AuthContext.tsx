
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/user.service';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const {
    isAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
    user: auth0User,
    isLoading,
  } = useAuth0();
  const [user, setUser] = useState<any>(null);

  // Sync Auth0 user with our backend
  useEffect(() => {
    if (isAuthenticated && auth0User) {
      // Here you would typically call your backend to validate the user
      // and get additional user data or create a new user if they don't exist
      userService.getCurrentStudent()
        .then(studentProfile => {
          setUser(studentProfile);
        })
        .catch(error => {
          console.error('Failed to fetch user profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to load user profile',
            variant: 'destructive',
          });
        });
    }
  }, [isAuthenticated, auth0User, toast]);

  const login = () => {
    loginWithRedirect();
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
        user: user || auth0User,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
