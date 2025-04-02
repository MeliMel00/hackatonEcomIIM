import "@/styles/globals.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabase from "../lib/supabaseClient";
import { CartProvider } from "@/contexts/CartContext"; // Import du panier

function MyApp({ Component, pageProps }: any) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <CartProvider> {/* Ajout du provider pour le panier */}
        <Component {...pageProps} />
      </CartProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
