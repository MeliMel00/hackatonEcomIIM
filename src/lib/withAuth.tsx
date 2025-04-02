import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthenticatedUser } from '../services/userService';

import { FC } from 'react';

const withAuth = <P extends object>(WrappedComponent: FC<P>) => {
  const AuthenticatedComponent: FC<P> = (props) => {
    const [, setUser] = useState<object | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const authenticatedUser = await getAuthenticatedUser();
        
        if (!authenticatedUser) {
          router.push('/login');
        } else {
          setUser(authenticatedUser);
        }
        
        setLoading(false);
      };

      checkAuth();
    }, [router]);

    if (loading) return <p>Chargement...</p>;

    return <WrappedComponent {...(props as P)} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthenticatedComponent;
};

export default withAuth;
