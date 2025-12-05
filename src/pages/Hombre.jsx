import { useEffect, useMemo, useRef, useState } from "react";
import CategoryCatalog from "../components/CategoryCatalog";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import SubscribeBanner from "../components/SubscribeBanner";
import { useProducts } from "../hooks/useProducts";

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

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  useEffect(() => setPage(0), [perPage, items.length]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                ? "bg-gray-800 border-gray-800"
                : "bg-white dark:bg-[#1c1828]"
            }`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hombre() {
  const { data, loading, error } = useProducts({ category: "hombre" });
  const recienRef = useRef(null);
  const [tab, setTab] = useState("recien");
  const catalogoId = "catalogo-hombre";

  const recienLlegados = useMemo(
    () => data.slice().reverse().slice(0, 8),
    [data]
  );
  const masVendidos = useMemo(() => data.slice(0, 8), [data]);
  const enOferta = useMemo(() => data.slice(0, 8), [data]); // reemplazar si hay flag de oferta
  const tabs = [
    { id: "recien", label: "Recién llegados", items: recienLlegados },
    { id: "vendidos", label: "Los más vendidos", items: masVendidos },
    { id: "oferta", label: "Artículos en oferta", items: enOferta },
  ];
  const activeTab = tabs.find((t) => t.id === tab) || tabs[0];
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === activeTab.id)
  );
  const tabWidth = 100 / tabs.length;
  const indicatorWidth = tabWidth;
  const indicatorLeft = tabWidth * activeIndex;

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  const scrollToCatalogo = () => {
    const el = document.getElementById(catalogoId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white dark:bg-[#0b0913] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url(/hombre/hombre.webp)",
              backgroundSize: "cover",
              backgroundPosition: "25% center",
              filter: "brightness(0.80)",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-40 text-center text-white space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold text-white dark:text-[#fbe8ef]">
            Hombre
          </h1>
          <p className="text-lg md:text-xl text-white dark:text-white drop-shadow">
            Encuentra lo mejor en moda y estilo para él.
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
      <div className="bg-white dark:bg-[#0b0913] transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-end">
          <button
            type="button"
            onClick={scrollToCatalogo}
            className="text-sm font-semibold text-gray-800 dark:text-gray-200 underline"
          >
            Ver todos
          </button>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 text-center pt-12 pb-2">
        <div className="flex items-center justify-center gap-4 mb-2 text-gray-500 dark:text-gray-400">
          <span className="h-px w-20 bg-gray-300 dark:bg-gray-700"></span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Destacados
          </span>
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

      <section ref={recienRef} className="max-w-6xl mx-auto px-4 pt-8 pb-14">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {activeTab.label}
          </h3>
        </div>
        {activeTab.items.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No hay productos en esta categoría.
          </p>
        ) : (
          <Carousel
            items={activeTab.items}
            perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
            dotsId={`hombre-${activeTab.id}`}
            renderItem={(p) => <ProductCard key={p.id} p={p} />}
          />
        )}
      </section>
      {/* Beneficios con assets en gris */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700 dark:text-gray-200">
        {[
          {
            img: "/assets/icon-img/support-1.png",
            titulo: "Envío gratis",
            desc: "Envío gratuito en todos los pedidos.",
          },
          {
            img: "/assets/icon-img/support-2.png",
            titulo: "Soporte 24/7",
            desc: "Estamos para ayudarte en lo que necesites.",
          },
          {
            img: "/assets/icon-img/support-3.png",
            titulo: "Devolución de dinero",
            desc: "Comprá sin preocupaciones.",
          },
          {
            img: "/assets/icon-img/support-4.png",
            titulo: "Descuento de pedido",
            desc: "Promos activas cada semana.",
          },
        ].map((b) => (
          <div key={b.titulo} className="flex items-start gap-3">
            <div className="rounded-full bg-white dark:bg-[#161225] ring-1 ring-black/5 dark:ring-white/10 p-1">
              <img
                src={b.img}
                alt={b.titulo}
                className="w-12 h-12 filter grayscale group-hover:grayscale-0 transition"
              />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {b.titulo}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Catálogo completo */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <CategoryCatalog
          category="hombre"
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
