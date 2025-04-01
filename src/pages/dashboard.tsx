import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import withAuth from '../lib/withAuth';
import Header from '@/components/header';

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
    <>
      <Header />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bienvenue, <span className="text-blue-600">{userEmail}</span>!
        </h1>
        <p className="text-gray-600 mb-6">
          Vous êtes connecté à votre tableau de bord. Gérez vos informations et explorez les fonctionnalités.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Se déconnecter
        </button>
      </div>
    </>
  );
}

export default withAuth(Dashboard);
