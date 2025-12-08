import { useMemo, useRef, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import DealCard from "../components/DealCard";
import QuickViewModal from "../components/QuickViewModal";
import CategoryCatalog from "../components/CategoryCatalog";
import SubscribeBanner from "../components/SubscribeBanner";

export default function Libros() {
  const { data, loading, error } = useProducts({ category: "libros" });
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

    // Recién llegados: priorizar los más nuevos por id, hasta 8
    const byNewest = [...data].sort((a, b) => b.id - a.id);
    const recienLlegados = byNewest.slice(0, 8);

    // Más vendidos: simulamos con rating.count más alto, evitando repetir los de recién
    let masVendidosSource = [...data]
      .sort((a, b) => (b?.rating?.count || 0) - (a?.rating?.count || 0))
      .filter((p) => !recienLlegados.some((r) => r.id === p.id));
    if (masVendidosSource.length === 0) masVendidosSource = shuffled;
    const masVendidos = masVendidosSource.slice(0, 8);

    // En oferta: productos con descuento, evitando repetir anteriores
    let ofertaBase = data.filter((p) => Number(p.discount) > 0);
    if (ofertaBase.length === 0) ofertaBase = shuffled;
    let enOfertaSource = ofertaBase.filter(
      (p) =>
        !recienLlegados.some((r) => r.id === p.id) &&
        !masVendidos.some((m) => m.id === p.id)
    );
    if (enOfertaSource.length === 0) enOfertaSource = shuffled;
    const enOferta = enOfertaSource.slice(0, 8);

    return { recienLlegados, masVendidos, enOferta };
  }, [data]);

  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-white dark:bg-[#0b0913] dark:text-gray-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden">
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
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 items-center gap-8 text-white">
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
      <div className="bg-white dark:bg-[#0b0913] transition-colors">
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
          className="bg-white dark:bg-[#0f0c19] transition-colors"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(tab === "recien"
                ? recienLlegados
                : tab === "vendidos"
                ? masVendidos
                : enOferta
              ).map((p) => (
                <DealCard key={p.id} product={p} onQuickView={setQuick} />
              ))}
            </div>
          </div>
          {quick && (
            <QuickViewModal product={quick} onClose={() => setQuick(null)} />
          )}
        </section>
      )}

      {/* Banner compra y ahorra */}
      <section
        className="max-w-6xl mx-auto my-10 rounded-2xl overflow-hidden relative"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {data.slice(0, 8).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
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
