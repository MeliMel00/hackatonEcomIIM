import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/button';

const Header = () => {
    const router = useRouter();
    const { cart } = useCart();

    // Calculer la quantité totale d'articles dans le panier
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            {/* Logo on the left */}
            <div
                className="font-extrabold text-lg text-gray-900 cursor-pointer hover:text-gray-600 transition-colors flex items-center space-x-2"
                onClick={() => router.push('/')}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l9-9 9 9M4.5 10.5v9a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-6h3v6a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-9"
                    />
                </svg>
                <span>ShopLogo</span>
            </div>

            {/* Title in the middle */}
            <h1 className="text-2xl font-bold text-gray-900">E-Commerce App</h1>

            {/* Icons on the right */}
            <div className="flex items-center space-x-6">
                {/* Cart Button */}
                <Button
                    variant="outline"
                    className="relative flex items-center space-x-2 text-gray-900 bg-gray-100 hover:bg-gray-200"
                    onClick={() => router.push('/cart')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11L17 13M7 13h10M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                        />
                    </svg>
                    {/* Affichage de la quantité d'articles dans le panier */}
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {totalItems}
                        </span>
                    )}
                </Button>

                {/* Profile Icon */}
                <div
                    className="cursor-pointer hover:text-gray-600 transition-colors flex items-center space-x-2"
                    onClick={() => router.push('/dashboard')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a4 4 0 10-8 0 4 4 0 008 0zM4 19a8 8 0 0116 0H4z"
                        />
                    </svg>
                    <span>Profile</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
