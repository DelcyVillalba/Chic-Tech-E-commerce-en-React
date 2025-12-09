import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import CategoryCatalog from "../components/CategoryCatalog";
import SubscribeBanner from "../components/SubscribeBanner";

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

function Carousel({ items, renderItem, perPageConfig, dotsId }) {
  const perPage = usePerPage(perPageConfig);
  const [page, setPage] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [bounce, setBounce] = useState(null);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  useEffect(() => {
    setPage(0);
  }, [perPage, items.length]);

  const start = page * perPage;
  const visible = items.slice(start, start + perPage);
  const minSwipeDistance = 20;

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      setTouchStartX(e.touches[0].clientX);
      setTouchEndX(null);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      setTouchEndX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const delta = touchStartX - touchEndX;

    if (delta > minSwipeDistance) {
      if (page < totalPages - 1) {
        setPage((p) => Math.min(totalPages - 1, p + 1));
      } else {
        setBounce("left");
        setTimeout(() => setBounce(null), 160);
      }
    } else if (delta < -minSwipeDistance) {
      if (page > 0) {
        setPage((p) => Math.max(0, p - 1));
      } else {
        setBounce("right");
        setTimeout(() => setBounce(null), 160);
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-transform duration-150 ${
          bounce === "left"
            ? "-translate-x-2"
            : bounce === "right"
            ? "translate-x-2"
            : "translate-x-0"
        }`}
      >
        {visible.map((item, idx) => (
          <div key={idx}>{renderItem(item)}</div>
        ))}
      </div>

      <button
        className="hidden sm:grid place-items-center h-10 w-10 rounded-full border text-gray-600 dark:text-gray-300 dark:border-[#2a2338] disabled:opacity-40 bg-[#f5f5f8]/95 dark:bg-[#05040a]/95 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        disabled={page <= 0}
        aria-label="Anterior"
      >
        ←
      </button>
      <button
        className="hidden sm:grid place-items-center h-10 w-10 rounded-full border text-gray-600 dark:text-gray-300 dark:border-[#2a2338] disabled:opacity-40 bg-[#f5f5f8]/95 dark:bg-[#05040a]/95 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={page >= totalPages - 1}
        aria-label="Siguiente"
      >
        →
      </button>
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
              i === page ? "bg-[#c2185b] border-[#c2185b]" : "bg-white"
            }`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Cosmeticos() {
  const { data, loading, error } = useProducts({
    category: "cosmeticos",
    perPage: 999,
  });
  const recienRef = useRef(null);
  const catalogoId = "catalogo-cosmeticos";

  const scrollTo = (ref) => {
    if (!ref?.current) return;
    const target = Math.max(0, ref.current.offsetTop - 20);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const scrollToCatalogo = () => {
    const el = document.getElementById(catalogoId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { recienLlegados, masVendidos, enOferta } = useMemo(() => {
    if (!data || data.length === 0) {
      return { recienLlegados: [], masVendidos: [], enOferta: [] };
    }

    const shuffled = [...data].sort(() => Math.random() - 0.5);

    const byNewest = [...data].sort((a, b) => b.id - a.id);
    const recien = byNewest;

    let masVendidosSource = [...data]
      .sort((a, b) => Number(b.price) - Number(a.price))
      .filter((p) => !recien.some((r) => r.id === p.id));
    if (masVendidosSource.length === 0) masVendidosSource = shuffled;
    const masVendidos = masVendidosSource;

    let ofertaBase = data.filter((p) => Number(p.discount) > 0);
    if (ofertaBase.length === 0) ofertaBase = shuffled;
    let enOfertaSource = ofertaBase.filter(
      (p) =>
        !recien.some((r) => r.id === p.id) &&
        !masVendidos.some((m) => m.id === p.id)
    );
    if (enOfertaSource.length === 0) enOfertaSource = shuffled;
    const enOferta = enOfertaSource;

    return { recienLlegados: recien, masVendidos, enOferta };
  }, [data]);
  const [tab, setTab] = useState("recien");
  const tabs = [
    { id: "recien", label: "Recién llegados", items: recienLlegados },
    { id: "vendidos", label: "Los más vendidos", items: masVendidos },
    { id: "oferta", label: "Artículos en oferta", items: enOferta },
  ];
  const activeTab =
    tabs.find((t) => t.id === tab && t.items.length > 0) ||
    tabs.find((t) => t.items.length > 0) ||
    tabs[0];
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTab.id)
  );
  const tabWidth = 100 / tabs.length;
  const indicatorWidth = tabWidth;
  const indicatorLeft = tabWidth * activeIndex;

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-[#e5e7eb] dark:bg-[#05040a] text-zinc-900 dark:text-zinc-200 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] flex items-center">
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(/cosmeticos/slider-1.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 text-center space-y-5">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
            Cosmética de moda
          </h1>
          <p className="text-lg md:text-xl text-gray-800 dark:text-white drop-shadow">
            Nuevas tendencias para tu cuidado diario
          </p>
          <div className="flex justify-center">
            <button
              className="mt-2 rounded-xl px-6 py-3 font-semibold text-white bg-[#c2185b] hover:bg-[#a3154a] transition-colors dark:bg-black dark:hover:bg-zinc-900"
              onClick={() =>
                window.scrollTo({
                  top: Math.max(0, recienRef.current?.offsetTop - 20 || 0),
                  behavior: "smooth",
                })
              }
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </section>

      {/* Botón Ver todos al inicio */}
      <div className="bg-[#e5e7eb] dark:bg-transparent transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-end">
          <button
            type="button"
            onClick={scrollToCatalogo}
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 underline"
          >
            Ver todos
          </button>
        </div>
      </div>

      <section
        ref={recienRef}
        className="max-w-6xl mx-auto px-4 text-center pt-12 pb-6"
      >
        <div className="flex items-center justify-center gap-4 mb-2 text-gray-500 dark:text-gray-300">
          <span className="h-px w-20 bg-gray-300 dark:bg-gray-700"></span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            ¡OFERTAS DIARIAS!
          </h2>
          <span className="h-px w-20 bg-gray-300 dark:bg-gray-700"></span>
        </div>
        <div className="relative max-w-md mx-auto grid grid-cols-3 text-base font-semibold text-gray-800 dark:text-gray-100 pb-3 border-b border-zinc-200 dark:border-[#2a2338]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-2 transition-colors ${
                tab === t.id
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
          <span
            className="absolute bottom-0 h-0.5 bg-[#c2185b] transition-all duration-300"
            style={{
              width: `${indicatorWidth}%`,
              left: `${indicatorLeft}%`,
            }}
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-4 pb-14">
        {activeTab.items.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No hay productos en esta categoría.
          </p>
        ) : (
          <Carousel
            key={activeTab.id}
            items={activeTab.items}
            perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
            dotsId={`cosmeticos-${activeTab.id}`}
            renderItem={(p) => <ProductCard key={p.id} p={p} />}
          />
        )}
      </section>

      {/* Catálogo completo */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <CategoryCatalog
          category="cosmeticos"
          title="Catálogo"
          anchorId={catalogoId}
          perPage={8}
          showHeader
        />
      </div>

      <SubscribeBanner />
    </div>
  );
}
