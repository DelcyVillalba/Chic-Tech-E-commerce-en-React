import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist, clear } = useWishlist();

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-4 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mis favoritos</h1>
          <p className="text-sm opacity-70">
            Guarda y revisa tus productos preferidos.
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={clear}
            className="text-sm border border-zinc-300 dark:border-[#2a2338] rounded-xl px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            Limpiar lista
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center border border-zinc-200 dark:border-[#2a2338] rounded-2xl p-8 bg-gray-50 dark:bg-[#161225] shadow-sm dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-colors">
          <p className="text-lg font-semibold mb-2">Sin favoritos aún</p>
          <p className="opacity-70 mb-4 text-gray-700 dark:text-gray-300">
            Usa el corazón en cada producto para guardarlo aquí.
          </p>
          <Link
            to="/#catalogo"
            className="inline-block bg-black text-white px-4 py-2 rounded-xl dark:bg-[#c2185b] dark:hover:bg-[#d90f6c] transition-colors"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </main>
  );
}
