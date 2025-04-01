import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from './supabaseClient';

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) router.push('/login');
        else setUser(user);
      };

      fetchUser();
    }, []);

    if (!user) return <p>Chargement...</p>;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
