import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatARS } from "../utils/format";

export default function Cart() {
  const { cart, dispatch, totalItems } = useCart();
  const [taxEnabled, setTaxEnabled] = useState(false);
  const TAX_RATE = 0.21;
  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, p) => s + p.qty * p.price, 0);
    const tax = taxEnabled ? subtotal * TAX_RATE : 0;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart, taxEnabled]);
  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Carrito</h1>
        <p className="opacity-70 mb-6">Tu carrito está vacío.</p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-4 py-2 rounded-xl"
        >
          Ir a comprar 🛍️
        </Link>
      </main>
    );
  }
  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Carrito</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2 space-y-3">
          {cart.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 border rounded-2xl p-3"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-20 w-20 object-contain"
              />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">{p.title}</div>
                <div className="text-sm opacity-70">
                  {formatARS.format(p.price)} c/u
                </div>
                <div className="text-sm opacity-70">
                  Subtotal: {formatARS.format(p.price * p.qty)}
                </div>
              </div>
              <input
                type="number"
                min="1"
                value={p.qty}
                onChange={(e) =>
                  dispatch({
                    type: "SET_QTY",
                    id: p.id,
                    qty: Number(e.target.value),
                  })
                }
                className="w-20 border rounded px-2 py-1"
              />
              <button
                onClick={() => dispatch({ type: "REMOVE", id: p.id })}
                className="border rounded px-3 py-2"
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            onClick={() => dispatch({ type: "CLEAR" })}
            className="border rounded px-4 py-2"
          >
            Vaciar carrito 🛒
          </button>
        </section>
        <aside className="border rounded-2xl p-4 h-max sticky top-20">
          <h2 className="text-lg font-semibold mb-3">Resumen</h2>
          <div className="flex justify-between text-sm mb-1">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Subtotal</span>
            <span>{formatARS.format(totals.subtotal)}</span>
          </div>
          <label className="flex items-center gap-2 text-sm my-2">
            <input
              type="checkbox"
              checked={taxEnabled}
              onChange={() => setTaxEnabled((v) => !v)}
            />{" "}
            Incluir impuestos (21%)
          </label>
          {taxEnabled && (
            <div className="flex justify-between mb-1">
              <span>Impuestos</span>
              <span>{formatARS.format(totals.tax)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Total</span>
            <span>{formatARS.format(totals.total)}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link to="/" className="border rounded-xl px-3 py-2 text-center">
              Seguir comprando 🛍️
            </Link>
            <button
              className="bg-black text-white rounded-xl px-3 py-2"
              onClick={() => alert("Checkout simulado ✅")}
            >
              Ir a pagar 💰
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
