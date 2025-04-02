import { useEffect, useState } from "react";
import Header from "@/components/header";
import { Product } from "@/models/Product";
import { getAllProducts } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, addToCart } = useCart();

  console.log("Cart actuel:", cart);

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
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">🛍️ Nos Produits</h1>

        {loading && <p className="text-center">Chargement des produits...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!loading && !error && products.length === 0 ? (
            <p className="text-center col-span-3">Aucun produit trouvé.</p>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="shadow-md">
                <CardHeader>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{product.description || "Pas de description."}</p>
                  <p className="text-green-500 font-bold mt-2">Prix: {product.price} €</p>
                  <Button
                    onClick={() => addToCart(product)}
                    className="mt-3 w-full"
                  >
                    Ajouter au panier
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
