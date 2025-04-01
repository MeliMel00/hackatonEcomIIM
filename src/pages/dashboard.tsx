import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) router.push('/login');
      else setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">Bienvenue, {user.email}</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 mt-4">Se déconnecter</button>
    </div>
  );
}
