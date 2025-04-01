import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Erreur chargement produits:', error);
      else setProducts(data);
    }
    fetchProducts();
  }, []);

  const getImageUrl = (path: string) => {
    return `https://kkgnyprkgaxrnwwvmnfh.supabase.co/storage/v1/object/public/${path}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produits Disponibles</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-md">
            <img 
              src={getImageUrl(product.image_url)} 
              alt={product.name} 
              className="w-full h-32 object-cover rounded"
            />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
