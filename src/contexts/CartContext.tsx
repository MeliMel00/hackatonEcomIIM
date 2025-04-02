import { createContext, useContext, useState } from 'react';
import { Product } from '@/models/Product';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Ajouter un produit au panier
  const addToCart = (product: Product) => {
    // Vérifier si la quantité demandée est disponible en stock
    const availableStock = product.quantity; 
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // Si le produit existe déjà dans le panier, on vérifie la quantité
      const newQuantity = existingItem.quantity + 1;

      // Si la nouvelle quantité dépasse le stock, on ne fait rien
      if (newQuantity > availableStock) {
        alert('La quantité demandée dépasse le stock disponible.');
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      // Ajouter un nouveau produit si ce n'est pas déjà dans le panier
      if (availableStock > 0) {
        setCart((prevCart) => [
          ...prevCart,
          { ...product, quantity: 1 }
        ]);
      } else {
        alert('Ce produit est en rupture de stock.');
      }
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
