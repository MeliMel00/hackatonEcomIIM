import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import withAuth from '../lib/withAuth';
import Header from '@/components/header';
import ProductList from '@/components/productList';
import { getCurrentUser, logoutUser } from '@/services/userService';
import Footer from '@/components/footer';
import { useUser } from '@/contexts/UserContext';

function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useUser();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserId(user.id);
          setUserEmail(user.email ?? null);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des informations utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      await logout();
      router.push('/login');
    } catch (err) {
      setError("Erreur lors de la déconnexion.");
    }
  };

  const goToAddProduct = () => {
    router.push('/commerce/add-product');
  };

  return (
    <>
      <div className="mt-24 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
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
