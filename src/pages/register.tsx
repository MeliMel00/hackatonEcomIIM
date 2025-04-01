import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../services/userService';
import supabase from '../lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await registerUser(email, password, name);
      router.push('/dashboard'); // Rediriger après une inscription réussie
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
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
          required
        />
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          S'inscrire
        </button>
      </form>

      {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}

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
