import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabaseClient';
import Header from '@/components/header';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Vérifier si l'utilisateur est connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return alert('Vous devez être connecté pour ajouter un produit');
    }

    // Upload de l'image dans Supabase Storage
    if (!image) {
      return alert('Veuillez sélectionner une image');
    }
    const fileExt = image.name.split('.').pop();
    const fileName = `download/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('productimage')
      .upload(fileName, image);

    if (uploadError) {
      return alert('Erreur lors du téléchargement de l\'image');
    }

    // Récupérer l'URL de l'image
    const { data: publicUrlData } = supabase.storage
      .from('productimage')
      .getPublicUrl(fileName);
    const imageUrl = publicUrlData?.publicUrl || '';

    // Ajouter le produit dans la table `products`
    const { error } = await supabase.from('products').insert([
      {
        name,
        description,
        price: parseFloat(price),
        image_url: imageUrl,
        user_id: user.id,
      },
    ]);

    if (error) {
      return alert('Erreur lors de l\'ajout du produit');
    }

    // Rediriger vers la page d'accueil ou dashboard après l'ajout
    router.push('/dashboard');
  };

  return (
    <><Header /><div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold">Ajouter un produit</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2" />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2" />
        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2" />
        <input
          type="file"
          onChange={handleImageChange}
          className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Ajouter le produit
        </button>
      </form>
    </div></>
  );
}
