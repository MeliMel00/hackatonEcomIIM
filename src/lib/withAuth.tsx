import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthenticatedUser } from '../services/userService';

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const [user, setUser] = useState<any>(null);
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

    if (!user) return null; // Éviter d'afficher le composant tant que l'utilisateur n'est pas défini

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
