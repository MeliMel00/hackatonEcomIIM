import { useEffect, useState } from "react";
import { getCartItems, removeFromCart } from "@/services/cartService";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";

export default function Cart() {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getCartItems(user.id).then(setCartItems);
    }
  }, [user]);

  const handleRemove = async (cartItemId: string) => {
    await removeFromCart(cartItemId);
    setCartItems(cartItems.filter((item) => item.id !== cartItemId));
  };

  if (!user) return <p>Veuillez vous connecter pour voir votre panier.</p>;

  return (
    <><Header /><div className="p-4">
          <h2 className="text-2xl font-bold mb-4">🛒 Mon Panier</h2>
          {cartItems.length === 0 ? (
              <p>Votre panier est vide.</p>
          ) : (
              cartItems.map((item) => (
                  <Card key={item.id} className="mb-4">
                      <CardContent className="flex justify-between items-center p-4">
                          <div>
                              <h3 className="font-semibold">{item.product.name}</h3>
                              <p className="text-gray-600">Quantité: {item.quantity}</p>
                          </div>
                          <Button variant="destructive" onClick={() => handleRemove(item.id)}>
                              Retirer
                          </Button>
                      </CardContent>
                  </Card>
              ))
          )}
      </div></>
  );
}
