import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import DealCard from "../components/DealCard";
import QuickViewModal from "../components/QuickViewModal";
import CategoryCatalog from "../components/CategoryCatalog";
import SubscribeBanner from "../components/SubscribeBanner";

// Carrusel reutilizable (similar al de Mujer/Hombre)
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
  const minSwipeDistance = 35;

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

export default function Libros() {
  const { data, loading, error } = useProducts({
    category: "libros",
    perPage: 999,
  });
  const destacadoRef = useRef(null);
  const nuevosRef = useRef(null);
  const catalogoId = "catalogo-libros";
  const [tab, setTab] = useState("recien"); // recien | vendidos | oferta
  const [quick, setQuick] = useState(null);
  const { recienLlegados, masVendidos, enOferta } = useMemo(() => {
    if (!data || data.length === 0) {
      return { recienLlegados: [], masVendidos: [], enOferta: [] };
    }

    const shuffled = [...data].sort(() => Math.random() - 0.5);

    // Recién llegados
    const byNewest = [...data].sort((a, b) => b.id - a.id);
    const recienLlegados = byNewest;

    // Más vendidos simulamos
    let masVendidosSource = [...data]
      .sort((a, b) => (b?.rating?.count || 0) - (a?.rating?.count || 0))
      .filter((p) => !recienLlegados.some((r) => r.id === p.id));
    if (masVendidosSource.length === 0) masVendidosSource = shuffled;
    const masVendidos = masVendidosSource;

    // En oferta
    let ofertaBase = data.filter((p) => Number(p.discount) > 0);
    if (ofertaBase.length === 0) ofertaBase = shuffled;
    let enOfertaSource = ofertaBase.filter(
      (p) =>
        !recienLlegados.some((r) => r.id === p.id) &&
        !masVendidos.some((m) => m.id === p.id)
    );
    if (enOfertaSource.length === 0) enOfertaSource = shuffled;
    const enOferta = enOfertaSource;

    return { recienLlegados, masVendidos, enOferta };
  }, [data]);

  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-[#e5e7eb] dark:bg-[#05040a] dark:text-gray-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] flex items-center">
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15)), url(/libros/slider-25.webp)",
              backgroundSize: "cover",
              backgroundPosition: "70% center",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-2 items-center gap-8 text-white">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-white/75">
              Lecturas destacadas
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Historias y conocimiento en un solo lugar
            </h1>
            <p className="text-white/80">
              Novedades, best sellers y ofertas especiales en libros impresos y
              digitales.
            </p>
            <button
              className="mt-2 rounded-xl px-6 py-3 font-semibold text-white bg-[#c2185b] hover:bg-[#a3154a] transition-colors dark:bg-black dark:hover:bg-zinc-900"
              onClick={() => scrollTo(destacadoRef)}
            >
              Ver destacados
            </button>
          </div>
        </div>
      </section>

      {/* Botón Ver todos al inicio */}
      <div className="bg-[#e5e7eb] dark:bg-transparent transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById(catalogoId);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 underline"
          >
            Ver todos
          </button>
        </div>
      </div>

      {/* Producto destacado (tabs) */}
      {data.length > 0 && (
        <section
          ref={destacadoRef}
          className="bg-[#e5e7eb] dark:bg-[#05040a] transition-colors"
        >
          <div className="max-w-6xl mx-auto px-4 py-12 text-zinc-900 dark:text-zinc-100">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-semibold">Producto destacado</h2>
              <div className="flex items-center justify-center gap-8 text-sm">
                <button
                  className={`pb-1 ${
                    tab === "recien"
                      ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                      : "opacity-80 dark:text-gray-200"
                  }`}
                  onClick={() => setTab("recien")}
                >
                  Recién llegados
                </button>
                <button
                  className={`pb-1 ${
                    tab === "vendidos"
                      ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                      : "opacity-80 dark:text-gray-200"
                  }`}
                  onClick={() => setTab("vendidos")}
                >
                  Los más vendidos
                </button>
                <button
                  className={`pb-1 ${
                    tab === "oferta"
                      ? "text-black dark:text-white border-b-2 border-[#c2185b]"
                      : "opacity-80 dark:text-gray-200"
                  }`}
                  onClick={() => setTab("oferta")}
                >
                  Artículos en oferta
                </button>
              </div>
            </div>
            {(
              tab === "recien"
                ? recienLlegados
                : tab === "vendidos"
                ? masVendidos
                : enOferta
            ).length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                No hay productos para mostrar en esta sección.
              </p>
            ) : (
              <Carousel
                key={tab}
                items={
                  tab === "recien"
                    ? recienLlegados
                    : tab === "vendidos"
                    ? masVendidos
                    : enOferta
                }
                perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
                dotsId={`libros-${tab}`}
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
      )}

      {/* Banner compra y ahorra */}
      <section className="max-w-6xl mx-auto px-4 my-10">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            backgroundImage: "url(/libros/bg-5.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/25" />
          <div className="relative px-6 py-10 text-center md:text-left space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Compra y ahorra dinero
            </h3>
            <p className="text-gray-700 dark:text-gray-200 max-w-2xl">
              Packs de cuadernos, agendas y sets creativos para acompañar tus
              lecturas.
            </p>
            <button
              className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-[#c2185b] text-white font-semibold hover:bg-black transition"
              onClick={() => scrollTo(nuevosRef)}
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </section>

      {/* Nuevos productos */}
      <section ref={nuevosRef} className="max-w-6xl mx-auto px-4 pb-12">
        <h3 className="text-2xl font-semibold mb-6 text-center md:text-left">
          Nuevos productos
        </h3>
        {data.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No hay productos en esta categoría.
          </p>
        ) : (
          <Carousel
            key="libros-nuevos"
            items={data}
            perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
            dotsId="libros-nuevos"
            renderItem={(p) => <ProductCard key={p.id} p={p} />}
          />
        )}
      </section>

      {/* Catálogo completo */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <CategoryCatalog
          category="libros"
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
