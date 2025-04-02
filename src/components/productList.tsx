import { useEffect, useState } from 'react';
import { deleteProduct, getUserProducts } from '@/services/productService';
import { Product } from '@/models/Product';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductListProps {
  userId: string;
}

export default function ProductList({ userId }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;

      try {
        const productsData = await getUserProducts(userId);
        setProducts(productsData);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des produits:', err);
        setError("Impossible de récupérer les produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId]);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete);
      // Mise à jour de l'état local pour filtrer le produit supprimé
      setProducts(products.filter(product => product.id !== productToDelete));
      setProductToDelete(null);
    } catch (err: any) {
      console.error('Erreur lors de la suppression du produit:', err);
      setError("Impossible de supprimer le produit.");
    }
  };

  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setIsDialogOpen(true);
  };

  if (loading) return <p>Chargement des produits...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p>Aucun produit trouvé.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-sm">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-500 mt-2 font-bold">Prix: {product.price} €</p>
              <button
                onClick={() => openDeleteDialog(product.id)}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded mt-4"
              >
                Supprimer
              </button>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera définitivement supprimé de votre catalogue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}