import { useEffect, useState } from "react";
import { listProducts } from "../api/products";
import DealCard from "./DealCard";
import QuickViewModal from "./QuickViewModal";

// Hook para decidir cuántas cards mostrar por slide
function usePerPage(config = { mobile: 1, tablet: 2, desktop: 4 }) {
  const calc = () => {
    if (typeof window === "undefined") return config.desktop;
    const w = window.innerWidth;
    if (w < 640) return config.mobile;
    if (w < 1024) return config.tablet;
    return config.desktop;
  };
  const [perPage, setPerPage] = useState(calc);

  useEffect(() => {
    const onResize = () => setPerPage(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return perPage;
}

// Carrusel horizontal con flechas y dots (similar al de Mujer)
function Carousel({ items, renderItem, perPageConfig, dotsId }) {
  const perPage = usePerPage(perPageConfig);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  useEffect(() => {
    setPage(0);
  }, [perPage, items.length]);

  const start = page * perPage;
  const visible = items.slice(start, start + perPage);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          className="h-10 w-10 grid place-items-center rounded-full border text-gray-600 dark:text-gray-300 dark:border-[#2a2338] disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page <= 0}
          aria-label="Anterior"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visible.map((item, idx) => (
              <div key={idx}>{renderItem(item)}</div>
            ))}
          </div>
        </div>
        <button
          className="h-10 w-10 grid place-items-center rounded-full border text-gray-600 dark:text-gray-300 dark:border-[#2a2338] disabled:opacity-40"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          aria-label="Siguiente"
        >
          →
        </button>
      </div>
      <div
        className="flex justify-center gap-2 mt-3"
        role="tablist"
        aria-label={dotsId || "paginacion"}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`h-2.5 w-2.5 rounded-full border ${
              i === page
                ? "bg-[#c2185b] border-[#c2185b]"
                : "bg-white dark:bg-[#1c1828]"
            }`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DailyDeals() {
  const MAX_ITEMS = 12;
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

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const used = new Set();

    const pickFromPool = (pool) => {
      const result = [];
      for (const p of shuffle(pool)) {
        if (result.length >= MAX_ITEMS) break;
        if (used.has(p.id)) continue;
        result.push(p);
        used.add(p.id);
      }
      return result;
    };

    // Recién llegados: priorizar ids más nuevas
    const newestPool = [...items].sort((a, b) => b.id - a.id);
    const newest = pickFromPool(newestPool);

    // Los más vendidos: simulamos con precios más altos
    const bestPool = [...items].sort(
      (a, b) => Number(b.price) - Number(a.price)
    );
    const best = pickFromPool(bestPool);

    // Artículos en oferta: con descuento, o todo el catálogo si no hay ofertas
    const saleCandidates = items.filter((p) => Number(p.discount) > 0);
    const salePool = saleCandidates.length ? saleCandidates : items;
    const onSale = pickFromPool(salePool);

    return { newest, best, onSale };
  })();

  const filtered = tab === "new" ? newest : tab === "best" ? best : onSale;

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

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            No hay productos para mostrar en esta sección.
          </p>
        ) : (
          <Carousel
            key={tab}
            items={filtered}
            perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
            dotsId={`daily-${tab}`}
            renderItem={(p) => (
              <DealCard key={p.id} product={p} onQuickView={setQuick} />
            )}
          />
        )}
      </div>

      {quick && (
        <QuickViewModal product={quick} onClose={() => setQuick(null)} />
      )}
    </section>
  );
}
