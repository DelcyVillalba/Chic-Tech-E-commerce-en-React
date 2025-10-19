import { useParams, Link } from "react-router-dom"; // ← Link para los botones
import useProduct from "../hooks/useProduct";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import { useCart } from "../context/CartContext";
import { translate } from "../i18n/es";
import { formatARS } from "../utils/format";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: raw, loading, error } = useProduct(id);
  const p = raw ? translate(raw) : null;
  const { dispatch } = useCart();

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
        <p className="opacity-80 mb-4">{p.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {formatARS.format(p.price)}
          </span>
          <button
            onClick={addToCart}
            className="rounded-xl px-4 py-2 bg-black text-white"
          >
            Agregar al carrito 🛒
          </button>
        </div>

        {added && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border p-3 bg-gray-50">
            <span className="text-sm">Producto agregado ✔️</span>
            <div className="ml-auto flex gap-2">
              <Link
                to="/cart"
                className="px-3 py-2 rounded-xl bg-black text-white text-sm"
              >
                Ver carrito 🛒
              </Link>
              <Link to="/" className="px-3 py-2 rounded-xl border text-sm">
                Seguir comprando 🛍️
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
