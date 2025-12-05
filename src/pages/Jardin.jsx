import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import CategoryCatalog from "../components/CategoryCatalog";
import SubscribeBanner from "../components/SubscribeBanner";

// Decide cuántas cards por slide según viewport
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

// Carrusel simple con flechas y dots
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
              i === page ? "bg-[#c2185b] border-[#c2185b]" : "bg-white"
            }`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Jardin() {
  const { data, loading, error } = useProducts({ category: "jardin" });
  const tabSectionRef = useRef(null);
  const catalogoId = "catalogo-jardin";

  const recienLlegados = useMemo(() => data.slice().reverse().slice(0, 8), [data]);
  const masVendidos = useMemo(() => data.slice(0, 8), [data]);
  const enOferta = useMemo(() => data.slice(0, 8), [data]); // reemplazar si hay flag de oferta
  const [tab, setTab] = useState("recien");
  const tabs = [
    { id: "recien", label: "Recién llegados", items: recienLlegados },
    { id: "vendidos", label: "Los más vendidos", items: masVendidos },
    { id: "oferta", label: "Artículos en oferta", items: enOferta },
  ];
  const activeTab = tabs.find((t) => t.id === tab) || tabs[0];
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeTab.id));
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
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url(/jardin/slider-15.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 items-center gap-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              -20% de descuento en todos los artículos
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Haz que tu
              <br />
              habitación sea
              <br />
              más verde
            </h1>
            <button
              className="mt-2 rounded-xl px-6 py-3 font-semibold text-white bg-[#c2185b] hover:bg-[#a3154a] transition-colors dark:bg-black dark:hover:bg-zinc-900"
              onClick={() =>
                tabSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
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

      <section
        ref={tabSectionRef}
        className="max-w-6xl mx-auto px-4 pt-10 pb-4 text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-2 text-gray-500 dark:text-gray-400">
          <span className="h-px w-20 bg-gray-300 dark:bg-gray-700"></span>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
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
              width: `${tabWidth}%`,
              left: `${indicatorLeft}%`,
            }}
          />
        </div>
      </section>

      {/* Contenido activo */}
      <section className="max-w-6xl mx-auto px-4 pt-6 pb-12">
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
            dotsId={`jardin-${activeTab.id}`}
            renderItem={(p) => <ProductCard key={p.id} p={p} />}
          />
        )}
      </section>

      {/* Beneficios */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-sm text-gray-700 dark:text-gray-200">
        {[
          {
            img: "src/public/assets/icon-img/support-1.png",
            titulo: "Envío gratis",
            desc: "Envío gratuito en todos los pedidos.",
          },
          {
            img: "src/public/assets/icon-img/support-2.png",
            titulo: "Soporte 24/7",
            desc: "Estamos para ayudarte en lo que necesites.",
          },
          {
            img: "src/public/assets/icon-img/support-3.png",
            titulo: "Devolución de dinero",
            desc: "Comprá sin preocupaciones.",
          },
          {
            img: "src/public/assets/icon-img/support-4.png",
            titulo: "Descuento de pedido",
            desc: "Promos activas cada semana.",
          },
        ].map((b) => (
          <div key={b.titulo} className="flex items-start gap-3">
            <div className="rounded-full bg-emerald-40 ring-2 ring-emerald-200 p-1">
              <img
                src={b.img}
                alt={b.titulo}
                className="w-12 h-12"
                style={{
                  filter:
                    "invert(24%) sepia(89%) saturate(640%) hue-rotate(121deg) brightness(92%) contrast(92%)",
                }}
              />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
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
          category="jardin"
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
