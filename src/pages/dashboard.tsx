import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import withAuth from '../lib/withAuth';

function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">
        Bienvenue {userEmail} sur le tableau de bord
      </h1>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mt-4">
        Se déconnecter
      </button>
    </div>
  );
}

export default withAuth(Dashboard);
