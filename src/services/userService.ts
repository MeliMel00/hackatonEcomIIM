import { User } from '@/models/User';
import supabase from '../lib/supabaseClient';

// Récupérer l'utilisateur actuellement connecté
export const getCurrentUser = async () => {
    // Vérifier si la session d'authentification existe avant d'essayer de récupérer l'utilisateur
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("Erreur lors de la récupération de la session: " + error.message);
  }

  // Si aucune session n'existe, retourner null
  if (!session) return null;

  // Si une session existe, récupérer l'utilisateur
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;  // Retourne l'utilisateur si disponible

};

// Récupérer les détails d'un utilisateur via son ID
export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération des informations utilisateur:", error);
    throw new Error("Impossible de récupérer l'utilisateur.");
  }

  return data;
};

// Mettre à jour les informations d'un utilisateur
export const updateUser = async (userId: string, updates: User) => {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    throw new Error("Impossible de mettre à jour l'utilisateur.");
  }

  return true;
};

// Déconnexion de l'utilisateur
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw new Error("Impossible de se déconnecter.");
  }

  
};


/**
 * Connexion de l'utilisateur avec email/mot de passe.
 */
export const loginUser = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error?.code === "invalid_credentials") {
        throw new Error("Identifiants incorrects");
    }
    if (error) {
        throw new Error(error.message);


}}


/**
 * Inscription d'un nouvel utilisateur avec email, mot de passe et nom.
 */
export const registerUser = async (email: string, password: string, name: string) => {
    // Création de l'utilisateur avec Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
  
    if (error?.code === "user_already_exists") {
      throw new Error("Cet utilisateur existe déjà.");
    }
  
    if (error) {
      throw new Error(error.message);
    }
  
    const user = data.user;
  
    if (!user) {
      throw new Error("Erreur: utilisateur non trouvé après l'inscription.");
    }
  
    // Ajouter l'utilisateur dans la table `users`
    const { error: dbError } = await supabase.from('users').upsert([
      { id: user.id, email: user.email, name: name },
    ]);
  
    if (dbError) {
      throw new Error("Erreur lors de l'ajout de l'utilisateur en base: " + dbError.message);
    }
  
    return user;
  };

/**
 * Récupère l'utilisateur actuellement connecté.
 */
export const getAuthenticatedUser = async () => {
    const { data, error } = await supabase.auth.getUser();
  
    if (error) {
      return null;
    }
  
    return data.user;
  };
