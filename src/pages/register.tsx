import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();

    // 1️⃣ Créer l'utilisateur avec Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return alert(error.message);
    }

    // 2️⃣ L'utilisateur est maintenant connecté après l'inscription
    const user = data.user;

    if (!user) {
      return alert('Erreur: utilisateur non trouvé après l\'inscription.');
    }

    console.log(user)
    // 3️⃣ Insérer l'utilisateur dans la table `users`
    const { error: dbError } = await supabase.from('users').upsert([
      { id: user.id, email: user.email, name: name },
    ]);

    if (dbError) {
      return alert('Erreur lors de l\'ajout de l\'utilisateur dans la table `users`: ' + dbError.message);
    }

    // 4️⃣ Rediriger l'utilisateur vers la page du tableau de bord ou d'accueil
    router.push('/dashboard');
  };

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
          type="name" 
          placeholder="Name" 
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
    </div>
  );
}
