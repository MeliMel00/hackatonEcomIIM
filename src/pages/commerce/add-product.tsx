import { useState } from 'react';
import { useRouter } from 'next/router';
import { addProduct } from '@/services/productService';
import Header from '@/components/header';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price || !image) {
      alert("Veuillez remplir tous les champs et sélectionner une image.");
      return;
    }

    try {
      await addProduct(name, description, parseFloat(price), image);
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold">Ajouter un produit</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Nom du produit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="border p-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">
            Ajouter le produit
          </button>
        </form>
      </div>
    </>
  );
}
