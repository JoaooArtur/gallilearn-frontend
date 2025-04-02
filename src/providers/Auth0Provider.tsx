
import React from 'react';

interface SimpleAuthProviderProps {
  children: React.ReactNode;
}

export const Auth0ProviderWithNavigate = ({ children }: SimpleAuthProviderProps) => {
  return <>{children}</>;
};
