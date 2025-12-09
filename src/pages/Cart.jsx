import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatARS } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";

export default function Cart() {
  const { cart, dispatch, totalItems } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const TAX_RATE = 0.21;

  useEffect(() => {
  if (user?.role === "admin") nav("/admin/orders");
  }, [user, nav]);

  if (user?.role === "admin") return null;
  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, p) => s + p.qty * p.price, 0);
    const tax = taxEnabled ? subtotal * TAX_RATE : 0;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart, taxEnabled]);
  if (cart.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
        <div className="mb-3 sm:mb-4 text-left">
          <BackButton />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Carrito</h1>
        <p className="opacity-70 mb-6 text-sm sm:text-base">
          Tu carrito está vacío.
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-4 py-2 rounded-xl dark:bg-[#c2185b] dark:hover:bg-[#d90f6c] transition-colors"
        >
          Ir a comprar 🛍️
        </Link>
      </main>
    );
  }
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-3 sm:mb-4">
        <BackButton />
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Lista de items */}
        <section className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white dark:bg-[#131121] shadow-sm p-4 sm:p-5 space-y-3">
            {cart.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-zinc-200/70 dark:border-[#2a2338] rounded-xl p-4 hover:border-zinc-300 dark:hover:border-[#3c3352] transition-colors"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-24 w-24 sm:h-20 sm:w-20 object-contain flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium line-clamp-2 text-sm sm:text-base">
                    {p.title}
                  </div>
                  <div className="text-xs sm:text-sm opacity-70 mt-1">
                    {p.discount > 0 && p.originalPrice ? (
                      <>
                        <span className="line-through mr-1">
                          {formatARS.format(p.originalPrice)}
                        </span>
                        <span>{formatARS.format(p.price)} c/u</span>
                      </>
                    ) : (
                      <span>{formatARS.format(p.price)} c/u</span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm opacity-70">
                    Subtotal: {formatARS.format(p.price * p.qty)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "SET_QTY",
                        id: p.id,
                        qty: Math.max(1, p.qty - 1),
                      })
                    }
                    disabled={p.qty <= 1}
                    className={`h-9 w-9 rounded-full border flex items-center justify-center text-lg font-semibold transition ${
                      p.qty <= 1
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-gray-400 hover:bg-gray-100"
                    }`}
                    aria-label="Disminuir cantidad"
                  >
                    –
                  </button>
                  <span className="w-8 text-center font-semibold text-sm">
                    {p.qty}
                  </span>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "SET_QTY",
                        id: p.id,
                        qty: p.qty + 1,
                      })
                    }
                    className="h-9 w-9 rounded-full border border-gray-400 flex items-center justify-center text-lg font-semibold hover:bg-gray-100 transition"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => dispatch({ type: "REMOVE", id: p.id })}
                  className="border border-red-300 text-red-600 rounded-lg px-3 py-2 text-sm hover:bg-red-500 hover:text-white transition-colors flex-shrink-0 w-full sm:w-auto text-center"
                >
                  Quitar
                </button>
              </div>
            ))}
            <button
              onClick={() => dispatch({ type: "CLEAR" })}
              className="w-full border border-zinc-300 rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#c2185b] hover:text-white transition-colors"
            >
              Vaciar carrito 🛒
            </button>
          </div>
        </section>

        {/* Resumen */}
        <aside className="border border-zinc-200 rounded-2xl bg-white dark:bg-[#131121] shadow-sm p-4 sm:p-6 h-max sticky top-24 lg:top-20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Resumen</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="opacity-70">Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Subtotal</span>
              <span className="font-medium">{formatARS.format(totals.subtotal)}</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={taxEnabled}
                onChange={() => setTaxEnabled((v) => !v)}
                className="rounded"
              />
              <span className="opacity-70">Incluir impuestos (21%)</span>
            </label>
            {taxEnabled && (
              <div className="flex justify-between">
                <span className="opacity-70">Impuestos</span>
                <span className="font-medium">{formatARS.format(totals.tax)}</span>
              </div>
            )}
            <div className="border-t border-zinc-200 pt-3 flex justify-between text-base sm:text-lg font-semibold">
              <span>Total</span>
              <span>{formatARS.format(totals.total)}</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Link
              to="/"
              className="block border border-zinc-300 rounded-lg px-4 py-3 text-center text-sm font-medium hover:bg-[#c2185b] hover:text-white transition-colors"
            >
              Seguir comprando 🛍️
            </Link>
            <button
              className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all ${user
                  ? "bg-black text-white hover:bg-zinc-900 shadow-sm"
                  : "bg-zinc-100 text-zinc-400 border border-dashed border-zinc-300 cursor-not-allowed"
                }`}
              disabled={!user}
              onClick={async () => {
                if (!user) {
                  nav("/login", { state: { from: "/cart" } });
                  return;
                }
                nav("/checkout", { state: { taxEnabled } });
              }}
            >
              {user ? "Ir a pagar 💰" : "Inicia sesión para pagar"}
            </button>
          </div>
          {!user && (
            <p className="text-xs text-orange-600 mt-3 text-center">
              Debes iniciar sesión para completar tu compra.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
