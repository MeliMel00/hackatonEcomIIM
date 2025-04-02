import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { registerUser } from '../services/userService';
import supabase from '../lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';

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
      router.push('/dashboard'); // Redirect after successful registration
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
    <div className="flex justify-center items-center mt-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
            <Input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
          </form>
          {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/login")}>
            Vous avez déjà un compte ? Connectez-vous ici.
          </Button>
        </CardFooter>
      </Card>
    </div></>
  );
}
