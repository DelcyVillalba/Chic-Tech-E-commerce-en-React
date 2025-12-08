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
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => setPage(0), [perPage, items.length]);

  const start = page * perPage;
  const visible = items.slice(start, start + perPage);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <button
          className="h-10 w-10 grid place-items-center rounded-full border text-gray-700 disabled:opacity-40"
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
          className="h-10 w-10 grid place-items-center rounded-full border text-gray-700 disabled:opacity-40"
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
              i === page ? "bg-gray-900 border-gray-900" : "bg-white"
            }`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Accesorios() {
  const { data, loading, error } = useProducts({
    category: "accesorios",
    perPage: 999,
  });
  const collageRef = useRef(null);
  const novedadesRef = useRef(null);
  const catalogoId = "catalogo-accesorios";

  const scrollTo = (ref) => {
    if (!ref?.current) return;
    window.scrollTo({ top: Math.max(0, ref.current.offsetTop - 20), behavior: "smooth" });
  };

  const scrollToCatalogo = () => {
    const el = document.getElementById(catalogoId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const novedades = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort(() => Math.random() - 0.5);
  }, [data]);
  const favoritos = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort(() => Math.random() - 0.5);
  }, [data]);
  const collageItems = [
    { image: "/accesorios/accesorio.webp", title: "Look 1", category: "Collares y Anillos" },
    {
      image: "/accesorios/Accesorios.webp",
      title: "Look 2",
      category: "Kit para hombre",
    },
    {
      image: "/accesorios/venta-de-joyas-oro-y-plata.webp",
      title: "Look 3",
      category: "Pulseras",
    },
    {
      image: "/accesorios/joyas-de-plata.webp",
      title: "Look 4",
      category: "Delicias de plata",
    },
  ];


  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(/accesorios/accesorios-moda.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-2 md:py-28 grid md:grid-cols-2 items-center gap-10 text-white">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.25em]">
              Edición cápsula
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Accesorios que arman tu look
            </h1>
            <p className="text-base text-white/80">
              Piezas curadas para destacar: joyería, bolsos y detalles para el
              día y la noche.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Anillos", "Collares", "Carteras", "Pulseras"].map((chip) => (
                <span
                  key={chip}
                  className="px-3 py-1 rounded-full border border-white/40 text-sm text-white/90"
                >
                  {chip}
                </span>
              ))}
            </div>
            <button
              className="mt-2 rounded-xl px-6 py-3 font-semibold text-white bg-[#c2185b] hover:bg-[#a3154a] transition-colors dark:bg-black dark:hover:bg-zinc-900"
              onClick={() => scrollTo(collageRef)}
            >
              Ver colección
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

      {/* Collage / panal */}
      <section ref={collageRef} className="max-w-6xl mx-auto px-4 pt-12 pb-16">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            SELECCIÓN CURADA{" "}
          </h2>
          <button
            className="text-sm font-semibold text-gray-800 underline dark:text-gray-100 dark:hover:text-white"
            onClick={() => scrollTo(novedadesRef)}
          >
            Ver novedades
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-8 dark:text-gray-200">
          Diseñado para ser mezclado y combinado
        </p>
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "3fr 2fr",
            gridTemplateRows: "220px 180px 160px",
            gridTemplateAreas: `
              "A B"
              "A C"
              "D C"
            `,
          }}
        >
          {["A", "B", "C", "D"].map((area, idx) => {
            const p = collageItems[idx];
            return (
              <div
                key={area}
                className="relative rounded-2xl overflow-hidden bg-gray-100"
                style={{ gridArea: area }}
              >
                {p ? (
                  <>
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                    <div className="absolute left-3 bottom-3 text-white space-y-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                      <p className="text-sm text-amber-200 font-semibold">
                        {p.category}
                      </p>
                      <p className="font-semibold text-white text-lg">
                        {p.title}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
                    Espacio para producto
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Novedades */}
      <section ref={novedadesRef} className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Novedades</h3>
        </div>
        {novedades.length === 0 ? (
          <p className="text-gray-600">No hay productos en esta categoría.</p>
        ) : (
          <Carousel
            items={novedades}
            perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
            dotsId="accesorios-novedades"
            renderItem={(p) => <ProductCard key={p.id} p={p} />}
          />
        )}
      </section>

      {/* Favoritos */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Favoritos</h3>
        </div>
        {favoritos.length === 0 ? (
          <p className="text-gray-600">No hay productos en esta categoría.</p>
        ) : (
          <Carousel
            items={favoritos}
            perPageConfig={{ mobile: 1, tablet: 2, desktop: 4 }}
            dotsId="accesorios-favoritos"
            renderItem={(p) => <ProductCard key={p.id} p={p} />}
          />
        )}
      </section>

      {/* Catálogo */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <CategoryCatalog
          category="accesorios"
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
