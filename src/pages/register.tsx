import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Si l'utilisateur est déjà connecté, rediriger vers la home
        router.push('/');
      } else {
        setIsLoading(false); // Stop loading if no user is logged in
      }
    };
    checkUser();
  }, [router]);

  const handleRegister = async (e: any) => {
    e.preventDefault();

    // Créer l'utilisateur avec Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error?.code === "user_already_exists") {
      setErrorMessage("Cet utilisateur existe déjà");
      return;
    }

    if (error) {
      setErrorMessage(error.message); // Set error message
      return;
    }

    // L'utilisateur est maintenant connecté après l'inscription
    const user = data.user;

    if (!user) {
      setErrorMessage('Erreur: utilisateur non trouvé après l\'inscription.');
      return;
    }

    // Insérer l'utilisateur dans la table `users`
    const { error: dbError } = await supabase.from('users').upsert([
      { id: user.id, email: user.email, name: name },
    ]);

    if (dbError) {
      setErrorMessage('Erreur lors de l\'ajout de l\'utilisateur dans la table `users`: ' + dbError.message);
      return;
    }

    // Rediriger l'utilisateur vers la page du tableau de bord ou d'accueil
    router.push('/dashboard');
  };

  if (isLoading) {
    return <div>Chargement...</div>; // Show loading indicator
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">Créer un compte</h1>
      <form onSubmit={handleRegister} className="flex flex-col space-y-3">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="border p-2"
        />
        <input 
          type="text" 
          placeholder="Nom" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="border p-2"
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          S'inscrire
        </button>
      </form>

      {/* Display error message */}
      {errorMessage && (
        <div className="mt-4 text-red-500">
          {errorMessage}
        </div>
      )}

      {/* Bouton pour accéder à la page login */}
      <div className="mt-4">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => router.push('/login')}
        >
          Vous avez déjà un compte ? Connectez-vous ici.
        </button>
      </div>
    </div>
  );
}
