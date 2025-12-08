import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import CategoryCatalog from "../components/CategoryCatalog";
import SubscribeBanner from "../components/SubscribeBanner";

const bannerCards = [
  {
    img: "/ninos/banner11.webp",
    title: "Niños",
    subt: "Desde $9.990",
  },
  {
    img: "/ninos/banner12.webp",
    title: "Teen",
    subt: "Desde $7.990",
  },
  {
    img: "/ninos/banner13.webp",
    title: "niña",
    subt: "Looks listos para usar",
  },
];

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

export default function Ninos() {
  const { data, loading, error } = useProducts({
    category: "ninos",
    perPage: 999,
  });
  const destacadosRef = useRef(null);
  const ultimosRef = useRef(null);
  const catalogoId = "catalogo-ninos";

  const scrollTo = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToCatalogo = () => {
    const el = document.getElementById(catalogoId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const destacados = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort(() => Math.random() - 0.5);
  }, [data]);
  const ultimos = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort(() => Math.random() - 0.5);
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-gray-50 dark:bg-[#0b0913] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.01), rgba(0,0,0,0.02)), url(/ninos/slider.webp)",
              backgroundSize: "cover",
              backgroundPosition: "28% center",
            }}
          />
          <div className="hidden dark:block absolute bottom-0 left-0 right-0 h-6 bg-[#0b0913]"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-60 grid md:grid-cols-2 items-center gap-10">
          <div />
          <div className="space-y-4 text-center md:text-right md:justify-self-start md:max-w-md w-full md:pr-10">
            <p className="text-sm font-semibold text-gray-50 dark:text-gray-50">
              Disfruta de esta oferta hoy
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-300">
              Venta Nueva
              <br />
              Colección
              <br />
              <span className="text-[#ffffff]">40% OFF</span>
            </h1>
            <div className="flex justify-end">
              <button
                className="mt-2 rounded-xl px-6 py-3 font-semibold text-white bg-[#c2185b] hover:bg-[#a3154a] transition-colors dark:bg-black dark:hover:bg-zinc-900"
                onClick={() => {
                  setTab("recien");
                  destacadosRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Botón Ver todos al inicio */}
      <div className="bg-gray-50 dark:bg-[#0b0913] transition-colors">
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

      {/* Banners */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-4">
        {bannerCards.map((b) => (
          <article
            key={b.title}
            className="rounded-2xl overflow-hidden shadow-sm border bg-white dark:bg-[#161225] dark:border-[#2a2338]"
          >
            <img
              src={b.img}
              alt={b.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-1">
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {b.subt}
              </p>
            </div>
          </article>
        ))}
      </section>

      {/* Destacados */}
      <section
        ref={destacadosRef}
        className="max-w-6xl mx-auto px-4 pb-10 scroll-mt-28"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Productos destacados</h2>
        </div>
        {destacados.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No hay productos en esta categoría.
          </p>
        ) : (
          <Carousel
            items={destacados}
            perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
            dotsId="destacados"
            renderItem={(p) => <ProductCard key={p.id} p={p} />}
          />
        )}
      </section>

      {/* Oferta del día */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="grid md:grid-cols-2 items-center overflow-hidden rounded-3xl gap-4">
          <div className="flex justify-center">
            <img
              src="/ninos/deal-4.png"
              alt="Oferta del día"
              className="w-full max-w-md h-64 object-contain"
            />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Oferta del día
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Aprovechá el descuento especial por tiempo limitado en la
              colección de niños.
            </p>
            <button
              className="bg-[#c2185b] hover:bg-[#a3154a] text-white rounded-xl px-5 py-3 text-sm font-semibold shadow-sm dark:shadow-[0_10px_30px_rgba(194,24,91,0.35)]"
              onClick={() => scrollTo(ultimosRef)}
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </section>

      {/* Últimos productos */}
      <section
        ref={ultimosRef}
        className="max-w-6xl mx-auto px-4 pb-14 scroll-mt-28"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Últimos productos</h2>
        </div>
        {ultimos.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No hay productos en esta categoría.
          </p>
        ) : (
          <Carousel
            items={ultimos}
            perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
            dotsId="ultimos"
            renderItem={(p) => <ProductCard key={p.id} p={p} />}
          />
        )}
      </section>

      {/* Catálogo completo */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <CategoryCatalog
          category="ninos"
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
