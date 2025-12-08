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

    const shuffled = [...items].sort(() => Math.random() - 0.5);

    const byNewest = [...items].sort((a, b) => b.id - a.id);
    const newest = byNewest.slice(0, MAX_ITEMS);

    let bestSource = [...items]
      .sort((a, b) => Number(b.price) - Number(a.price))
      .filter((p) => !newest.some((n) => n.id === p.id));
    if (bestSource.length === 0) bestSource = shuffled;
    const best = bestSource.slice(0, MAX_ITEMS);

    let ofertaBase = items.filter((p) => Number(p.discount) > 0);
    if (ofertaBase.length === 0) ofertaBase = shuffled;
    let onSaleSource = ofertaBase.filter(
      (p) =>
        !newest.some((n) => n.id === p.id) &&
        !best.some((b) => b.id === p.id)
    );
    if (onSaleSource.length === 0) onSaleSource = shuffled;
    const onSale = onSaleSource.slice(0, MAX_ITEMS);

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
