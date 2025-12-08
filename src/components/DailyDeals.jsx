import { useEffect, useState } from "react";
import { listProducts } from "../api/products";
import DealCard from "./DealCard";
import QuickViewModal from "./QuickViewModal";

export default function DailyDeals() {
  const COLS_DESKTOP = 4;
  const MAX_ITEMS = COLS_DESKTOP * 2;
  const [items, setItems] = useState([]);
  const [quick, setQuick] = useState(null);
  const [tab, setTab] = useState("new");

  useEffect(() => {
    listProducts()
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  const { newest, best, onSale } = (() => {
    if (!items || items.length === 0) {
      return { newest: [], best: [], onSale: [] };
    }

    const used = new Set();
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    // Recién llegados: priorizar los más nuevos (ids altas) pero mezclados
    const newestPool = [...items]
      .sort((a, b) => b.id - a.id)
      .slice(0, MAX_ITEMS * 2);
    const newest = [];
    for (const p of shuffle(newestPool)) {
      if (newest.length >= MAX_ITEMS) break;
      if (used.has(p.id)) continue;
      newest.push(p);
      used.add(p.id);
    }

    // Los más vendidos: simulamos con precios más altos, sin repetir los nuevos
    const bestPool = [...items]
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, MAX_ITEMS * 2);
    const best = [];
    for (const p of shuffle(bestPool)) {
      if (best.length >= MAX_ITEMS) break;
      if (used.has(p.id)) continue;
      best.push(p);
      used.add(p.id);
    }

    // Artículos en oferta: con descuento; si no hay, usar cualquier producto restante
    const saleCandidates = items.filter((p) => Number(p.discount) > 0);
    const salePool = saleCandidates.length ? saleCandidates : items;
    const onSale = [];
    for (const p of shuffle(salePool)) {
      if (onSale.length >= MAX_ITEMS) break;
      if (used.has(p.id)) continue;
      onSale.push(p);
      used.add(p.id);
    }

    return { newest, best, onSale };
  })();

  const filtered = tab === "new" ? newest : tab === "best" ? best : onSale;

  const visible = filtered;

  return (
    <section className="bg-white dark:bg-[#0f0c19] transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-12 text-zinc-900 dark:text-zinc-100">
        <div className="flex items-center justify-center gap-6 mb-6">
          <span className="h-px w-16 bg-black/60 dark:bg-white/30" />
          <h2 className="text-2xl font-semibold">¡OFERTAS DIARIAS!</h2>
          <span className="h-px w-16 bg-black/60 dark:bg-white/30" />
        </div>

        <div className="flex items-center justify-center gap-8 text-sm mb-8">
          <button
            className={`pb-1 ${
              tab === "new"
                ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                : "opacity-70"
            }`}
            onClick={() => setTab("new")}
          >
            Recién llegados
          </button>

          <button
            className={`pb-1 ${
              tab === "best"
                ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                : "opacity-70"
            }`}
            onClick={() => setTab("best")}
          >
            Los más vendidos
          </button>

          <button
            className={`pb-1 ${
              tab === "sale"
                ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                : "opacity-70"
            }`}
            onClick={() => setTab("sale")}
          >
            Artículos en oferta
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visible.map((p) => (
            <DealCard key={p.id} product={p} onQuickView={setQuick} />
          ))}
        </div>
      </div>

      {quick && (
        <QuickViewModal product={quick} onClose={() => setQuick(null)} />
      )}
    </section>
  );
}
