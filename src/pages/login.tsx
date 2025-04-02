import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loginUser, getCurrentUser } from '@/services/userService';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import { useUser } from '@/contexts/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { refreshUser } = useUser();


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
      await refreshUser();
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
    <>
    <div className="flex justify-center items-center mt-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => router.push('/register')}
          >
            Vous n'avez pas de compte ? Inscrivez-vous ici.
          </Button>
        </CardFooter>
      </Card>
    </div></>
  );
}
