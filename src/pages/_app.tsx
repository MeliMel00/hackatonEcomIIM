import "@/styles/globals.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabase from "../lib/supabaseClient";
import { CartProvider } from "@/contexts/CartContext"; // Import du panier
import Header from "@/components/header";
import Footer from "@/components/footer";
import { UserProvider } from "@/contexts/UserContext";

function MyApp({ Component, pageProps }: any) {
  return (
    <div className="min-h-screen flex flex-col">
      <SessionContextProvider supabaseClient={supabase}>
        <UserProvider>
        <CartProvider>
          <Header />
          <main>
            <Component {...pageProps} />
          </main>
          <Footer />
        </CartProvider>

        </UserProvider>
      </SessionContextProvider>
    </div>
  );
}

export default MyApp;
