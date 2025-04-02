import { useEffect, useState } from "react";
import { Product } from "@/models/Product";
import { getAllProducts } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import withAuth from "@/lib/withAuth";
import Image from "next/image";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, addToCart } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch {
        setError("Erreur lors du chargement des produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle adding a product to the cart with stock verification
  const handleAddToCart = (product: Product) => {
    const productInCart = cart.find((item) => item.id === product.id);
    const quantityInCart = productInCart ? productInCart.quantity : 0;

    if (quantityInCart < product.quantity) {
      addToCart(product);
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 mt-16">
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
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{product.description || "Pas de description."}</p>
                  <p className="text-green-500 font-bold mt-2">Prix: {product.price} €</p>
                  <p className="text-red-500 mt-2 font-bold">Stock disponible: {product.quantity}</p>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="mt-3 w-full"
                    disabled={product.quantity === 0}
                  >
                    {product.quantity > 0 ? "Ajouter au panier" : "Stock épuisé"}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Dialog for insufficient stock */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock insuffisant</DialogTitle>
            <DialogDescription>
              Vous ne pouvez pas ajouter plus d&apos;unités de ce produit au panier.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setIsDialogOpen(false)} className="mt-4">
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default withAuth(Home);
