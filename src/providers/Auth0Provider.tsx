
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode;
}

export const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderWithNavigateProps) => {
  const navigate = useNavigate();

  const domain = "dev-3nm4vadwgq6pajxd.us.auth0.com";
  const clientId = "NWnYMDMRXC29zksxd00y9IqeUzvBTIck";
  const redirectUri = window.location.origin;

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || '/dashboard');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        connection: "GallilearnStudent",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
