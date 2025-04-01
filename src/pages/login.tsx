import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [isLoading, setIsLoading] = useState(true); // Loading state
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

  const handleLogin = async (e: any) => {
    e.preventDefault();

    // Clear previous error message
    setErrorMessage('');

    // Connexion de l'utilisateur
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error?.code === "invalid_credentials") {
      setErrorMessage("Identifiants de connexion invalides");
      return;
    }
    if (error) {
      setErrorMessage(error.message); // Set error message
      return;
    }

    // Si la connexion est réussie, on redirige vers la page d'accueil
    router.push('/');
  };

  if (isLoading) {
    return <div>Chargement...</div>; // Show loading indicator
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">Se connecter</h1>
      <form onSubmit={handleLogin} className="flex flex-col space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Se connecter
        </button>
      </form>

      {/* Display error message */}
      {errorMessage && (
        <div className="mt-4 text-red-500">
          {errorMessage}
        </div>
      )}

      {/* Bouton pour accéder à la page d'inscription */}
      <div className="mt-4">
        <button
          className="text-blue-500 hover:underline"
          onClick={() => router.push('/register')}
        >
          Vous n'avez pas de compte ? Inscrivez-vous ici.
        </button>
      </div>
    </div>
  );
}
