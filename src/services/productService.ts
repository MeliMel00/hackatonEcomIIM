import supabase from '../lib/supabaseClient';
import { Product } from '../models/Product';
import { getCurrentUser } from '@/services/userService';

/**
 * Ajoute un produit avec une image uploadée sur Supabase Storage.
 */
export const addProduct = async (
  name: string, 
  description: string, 
  price: number, 
  image: File
) => {
  // Vérifier si l'utilisateur est connecté via UserService
  const user = await getCurrentUser();
  if (!user) throw new Error("Vous devez être connecté");

  // Upload de l'image
  const fileExt = image.name.split('.').pop();
  const fileName = `download/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('productimage')
    .upload(fileName, image);

  if (uploadError) throw new Error("Erreur lors du téléchargement de l'image");

  // Récupérer l'URL de l'image
  const { data: publicUrlData } = supabase
    .storage
    .from('productimage')
    .getPublicUrl(fileName);
  
  if (!publicUrlData.publicUrl) throw new Error("Erreur lors de la récupération de l'URL de l'image");

  // Ajouter le produit
  const { error } = await supabase.from('products').insert([
    { name, description, price, image_url: publicUrlData.publicUrl, user_id: user.id }
  ]);

  if (error) throw new Error("Erreur lors de l'ajout du produit");
};

/**
 * Récupère les produits d'un utilisateur donné.
 */
export const getUserProducts = async (userId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error("Erreur lors de la récupération des produits");
  return data || [];
};

/**
 * Supprime un produit par son ID.
 */
export const deleteProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw new Error("Erreur lors de la suppression du produit");
};

/**
 * Récupère tous les produits disponibles.
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw new Error("Impossible de récupérer les produits.");
  }

  return data || [];
};
