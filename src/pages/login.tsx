import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">Connexion</h1>
      <form onSubmit={handleLogin} className="flex flex-col space-y-3">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2"/>
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2"/>
        <button type="submit" className="bg-green-500 text-white p-2">Se connecter</button>
      </form>
    </div>
  );
}
