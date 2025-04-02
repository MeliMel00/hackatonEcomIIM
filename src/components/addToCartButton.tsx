import { Button } from "@/components/ui/button";
import { addToCart } from "@/services/cartService";
import { useUser } from "@/hooks/useUser";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { user } = useUser(); // Hook pour récupérer l'utilisateur connecté

  const handleAddToCart = async () => {
    if (!user) return alert("Veuillez vous connecter !");
    await addToCart(user.id, productId);
    alert("Produit ajouté au panier !");
  };

  return (
    <Button variant="outline" onClick={handleAddToCart}>
      Ajouter au Panier
    </Button>
  );
}
