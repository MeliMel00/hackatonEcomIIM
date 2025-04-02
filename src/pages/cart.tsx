import Header from "@/components/header";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/models/Product";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  return (
    <><Header /><div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-center">🛒 Votre Panier</h1>

          {cart.length === 0 ? (
              <p className="text-center">Votre panier est vide.</p>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {cart.map((product: Product) => (
                      <div key={product.id} className="border p-4 rounded-lg shadow-sm">
                          <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-lg mb-4" />
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p className="text-gray-600 text-sm">{product.description || "Pas de description."}</p>
                            <p className="text-green-500 font-bold mt-2">Prix: {product.price} €</p>
                            <p className="mt-2">Quantité: {product.quantity}</p>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                          >
                              Retirer du panier
                          </button>
                      </div>
                  ))}
              </div>
          )}
      </div></>
  );
}
