import { useRouter } from 'next/router';
import { Button } from './ui/button';

const Header = () => {
    const router = useRouter();

    return (
        <header className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
            {/* Logo on the left */}
            <div
                className="font-extrabold cursor-pointer hover:text-gray-300 transition-colors flex items-center space-x-2"
                onClick={() => router.push('/')}
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
                        d="M3 12l9-9 9 9M4.5 10.5v9a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-6h3v6a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-9"
                    />
                </svg>
            </div>

            {/* Title in the middle */}
            <h1 className="text-xl font-bold">E-Commerce App</h1>

            {/* Profile logo on the right */}
            <div
                className="cursor-pointer hover:text-gray-300 transition-colors"
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
            </div>
            <Button
                variant="outline"
                className="text-gray-900 bg-white hover:bg-gray-200"
                onClick={() => router.push("/cart")}
            >
                Voir le Panier
            </Button>
        </header>
    );
};

export default Header;
