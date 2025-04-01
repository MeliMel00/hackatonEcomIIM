import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loginUser, getCurrentUser } from '@/services/userService';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour éviter le spam du bouton
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          toast.success("Déjà connecté, redirection...");
          router.push('/');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await loginUser(email, password);
      toast.success("Connexion réussie !");
      router.push('/');
    } catch (error: any) {
      setErrorMessage(error.message || "Erreur inconnue");
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

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
