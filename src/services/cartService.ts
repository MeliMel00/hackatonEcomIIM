import supabase from "../lib/supabaseClient";

/**
 * Ajoute un produit au panier de l'utilisateur
 */
export const addToCart = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (data) {
    // Produit déjà dans le panier, on augmente la quantité
    await supabase
      .from("cart_items")
      .update({ quantity: data.quantity + 1 })
      .eq("id", data.id);
  } else {
    // Produit pas encore dans le panier, on l'ajoute
    await supabase
      .from("cart_items")
      .insert([{ user_id: userId, product_id: productId, quantity: 1 }]);
  }

  if (error) throw new Error("Erreur lors de l'ajout au panier");
};

/**
 * Récupère le panier de l'utilisateur
 */
export const getCartItems = async (userId: string) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product:products(*)")
    .eq("user_id", userId);

  if (error) throw new Error("Erreur lors de la récupération du panier");
  return data || [];
};

/**
 * Supprime un produit du panier
 */
export const removeFromCart = async (cartItemId: string) => {
  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);
  if (error) throw new Error("Erreur lors de la suppression du produit du panier");
};
