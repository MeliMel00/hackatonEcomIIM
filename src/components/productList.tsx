import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

interface ProductListProps {
  userId: string;
}

export default function ProductList({ userId }: ProductListProps) {
  

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [userId]);

  if (loading) return <p>Chargement des produits...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-sm">
            <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-500 mt-2">Prix: {product.price} €</p>
          </div>
        ))
      )}
    </div>
  );
}
