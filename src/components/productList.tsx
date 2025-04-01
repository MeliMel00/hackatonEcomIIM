import { useEffect, useState } from 'react';
import { getUserProducts } from '@/services/productService';
import { Product } from '@/models/Product';

interface ProductListProps {
  userId: string;
}

export default function ProductList({ userId }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;

      try {
        const productsData = await getUserProducts(userId);
        setProducts(productsData);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des produits:', err);
        setError("Impossible de récupérer les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId]);

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-sm">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-500 mt-2 font-bold">Prix: {product.price} €</p>
          </div>
        ))
      )}
    </div>
  );
}
