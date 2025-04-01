import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import withAuth from '../lib/withAuth';
import Header from '@/components/header';
import ProductList from '@/components/productList';

function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const goToAddProduct = () => {
    router.push('/commerce/add-product');
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bienvenue, <span className="text-blue-600">{userEmail || 'Utilisateur'}</span>!
        </h1>
        <p className="text-gray-600 mb-6">
          Gérez vos produits et explorez les fonctionnalités de votre tableau de bord.
        </p>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={goToAddProduct}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Ajouter un produit
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 bg-gray-50 shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mes Produits</h2>
        {userId ? <ProductList userId={userId} /> : <p className="text-gray-600">Chargement...</p>}
      </div>
    </>
  );
}

export default withAuth(Dashboard);
