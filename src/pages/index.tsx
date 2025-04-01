import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error(error);
      else setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Nos Produits</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4">
            <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover" />
            <h2 className="text-lg">{product.name}</h2>
            <p className="text-gray-700">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
