import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatARS } from "../utils/format";

export default function ProductCard({ p }) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  const add = () => {
    dispatch({ type: "ADD", item: p });
    setAdded(true);
    // opcional: auto-cerrar
    // setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="rounded-2xl border p-4 flex flex-col">
      <Link to={`/product/${p.id}`} className="flex-1">
        <img
          src={p.image}
          alt={p.title}
          className="h-40 w-full object-contain mb-3"
        />
        <h3 className="line-clamp-2 font-medium">{p.title}</h3>
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <span className="font-semibold">{formatARS.format(p.price)}</span>
        <button
          onClick={add}
          className="rounded-xl px-3 py-1 bg-black text-white"
        >
          Agregar
        </button>
      </div>

      {added && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border p-2 bg-gray-50">
          <span className="text-xs">Agregado ✔️</span>
          <div className="ml-auto flex gap-2">
            <Link
              to="/cart"
              className="px-2 py-1 rounded-xl bg-black text-white text-xs"
            >
              Ver carrito 🛒
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
