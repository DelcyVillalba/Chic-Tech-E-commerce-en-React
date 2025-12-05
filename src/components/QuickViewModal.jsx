import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatARS } from "../utils/format";

export default function QuickViewModal({ product, onClose }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const { toggle, isSaved } = useWishlist();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // bloquear scroll del body
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  // cerrar con ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;
  const { title, image, description, price, discount = 0 } = product;
  const final = discount ? price * (1 - discount / 100) : price;
  const saved = isSaved(product.id);

  const addToCart = () => {
    const cantidad = Math.max(1, Number(qty) || 1);
    add(product, cantidad);
    setAdded(true);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Contenedor centrado */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Modal */}
        <div className="relative w-full max-w-5xl bg-white rounded shadow-lg overflow-hidden">
          <button
            className="absolute right-3 top-3 text-2xl opacity-70 hover:opacity-100"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="grid place-items-center bg-white">
              <img
                src={image}
                alt={title}
                className="max-h-[380px] object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <div className="mb-4 text-[#c2185b] text-lg font-semibold">
                {formatARS.format(final)}
                {discount > 0 && (
                  <span className="ml-2 text-sm opacity-60 line-through">
                    {formatARS.format(price)}
                  </span>
                )}
              </div>
              <p className="text-sm opacity-80 mb-4 max-h-40 overflow-auto pr-1">
                {description}
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center border rounded">
                  <button
                    className="px-3 py-1"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <input
                    className="w-12 text-center"
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, Number(e.target.value)))
                    }
                  />
                  <button
                    className="px-2 py-2"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="bg-[#c2185b] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#a3154a] transition-colors"
                  onClick={addToCart}
                >
                  Añadir al carrito 🛒
                </button>
                <button
                  className="border border-[#c2185b] text-[#c2185b] px-4 py-2.5 rounded-lg font-semibold hover:bg-[#c2185b] hover:text-white transition-colors"
                  onClick={() => toggle(product)}
                  title="Añadir a la lista de deseos"
                >
                  {saved ? "♥️ En deseos" : "🤍 Añadir a deseos"}
                </button>
              </div>

              {added && (
                <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-2 dark:border-[#2a2338] dark:bg-[#161225]">
                  <div className="text-sm font-medium text-zinc-800 dark:text-white flex items-center gap-1">
                    Producto agregado <span className="text-green-600">✔️</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/cart"
                      className="px-4 py-2 rounded-lg bg-[#c2185b] text-white text-sm font-semibold hover:bg-[#a3154a] transition-colors"
                      onClick={onClose}
                    >
                      Ver carrito 🛒
                    </Link>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-lg border border-[#c2185b] text-[#c2185b] text-sm font-semibold hover:bg-[#c2185b] hover:text-white transition-colors"
                    >
                      Seguir comprando 🛍️
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
