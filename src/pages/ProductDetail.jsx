import { useParams, Link, useNavigate } from "react-router-dom";
import useProduct from "../hooks/useProduct";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { translate } from "../i18n/es";
import { formatARS } from "../utils/format";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: raw, loading, error } = useProduct(id);
  const p = raw ? translate(raw) : null;
  const { dispatch } = useCart();
  const { toggle, isSaved } = useWishlist();
  const nav = useNavigate();

  const [added, setAdded] = useState(false); // ← para mostrar botones tras “Agregar producto al carrito”

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  const addToCart = () => {
    dispatch({ type: "ADD", item: p });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <main className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6">
      <img src={p.image} alt={p.title} className="w-full h-80 object-contain" />
      <section>
        <h1 className="text-2xl font-semibold mb-2">{p.title}</h1>
        <div className="text-sm opacity-70 mb-2">
          Categoría: {p.categoryEs ?? p.category}
        </div>
        <p className="opacity-80 mb-3">{p.description}</p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl font-bold">
            {formatARS.format(p.price)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={addToCart}
              className="rounded-lg px-4 py-2 bg-[#c2185b] text-white font-semibold hover:bg-[#a3154a] transition-colors"
            >
              Añadir al carrito 🛒
            </button>
            <button
              onClick={() => toggle(p)}
              className="rounded-lg px-4 py-2 border border-[#c2185b] text-[#c2185b] font-semibold hover:bg-[#c2185b] hover:text-white transition-colors text-sm"
              title="Añadir a la lista de deseos"
            >
              {isSaved(p.id) ? "♥️ En deseos" : "🤍 Añadir a deseos"}
            </button>
          </div>
        </div>

        {added && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border p-3 bg-gray-50 dark:bg-[#161225] dark:border-[#2a2338]">
            <span className="text-sm text-zinc-800 dark:text-white">
              Producto agregado ✔️
            </span>
            <div className="ml-auto flex gap-2">
              <Link
                to="/cart"
                className="px-4 py-2 rounded-lg bg-[#c2185b] text-white text-sm font-semibold hover:bg-[#a3154a] transition-colors"
              >
                Ver carrito 🛒
              </Link>
              <button
                onClick={() => {
                  // volver a la página anterior si existe, si no ir al home
                  if (window.history.length > 1) nav(-1);
                  else nav("/", { state: { restoreCatalog: true } });
                }}
                className="px-4 py-2 rounded-lg border border-[#c2185b] text-[#c2185b] text-sm font-semibold hover:bg-[#c2185b] hover:text-white transition-colors"
              >
                Seguir comprando 🛍️
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}