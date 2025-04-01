import { useEffect, useState } from 'react';
import Header from '@/components/header';
import { Product } from '@/models/Product';
import { getAllProducts } from '@/services/productService';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (err: any) {
        setError("Erreur lors du chargement des produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Produits Disponibles</h1>

        {loading && <p>Chargement des produits...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {!loading && !error && products.length === 0 ? (
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
                <p className="text-gray-600">{product.description || 'Pas de description disponible.'}</p>
                <p className="text-green-500 mt-2 font-bold">Prix: {product.price} €</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
