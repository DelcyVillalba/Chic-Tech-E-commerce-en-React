import { useProducts } from "../hooks/useProducts";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import CategoryCatalog from "../components/CategoryCatalog";
import SubscribeBanner from "../components/SubscribeBanner";

export default function Hogar() {
  const { data, loading, error } = useProducts({ category: "hogar" });
  const catalogoId = "catalogo-hogar";
  const categoriasDestacadas = [
    { img: "/hogar/1.webp", titulo: "3 productos", subt: "sala de estar" },
    { img: "/hogar/2.webp", titulo: "5 productos", subt: "Oficina" },
    { img: "/hogar/3.webp", titulo: "4 productos", subt: "Comedor" },
    { img: "/hogar/4.webp", titulo: "6 productos", subt: "Deco textil" },
  ];

  const scrollToCatalogo = () => {
    const el = document.getElementById(catalogoId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] flex items-center">
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.70), rgba(0,0,0,0.15)), url(/hogar/slider-31.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 text-center text-white space-y-5">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.25em] text-white/75">
              Nuevos esenciales para el hogar
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Diseños que hacen tu casa más cómoda
            </h1>
            <p className="text-white/80">
              Iluminación, textiles y objetos decorativos para cada ambiente.
            </p>
            <button
              className="mt-2 rounded-xl px-6 py-3 font-semibold text-white bg-[#c2185b] hover:bg-[#a3154a] transition-colors dark:bg-black dark:hover:bg-zinc-900"
              onClick={scrollToCatalogo}
            >
              Ver catálogo
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

      {/* Carrusel animado de categorías (derecha a izquierda) */}
      <section className="relative overflow-hidden bg-white">
        <style>
          {`@keyframes scroll-hogar {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }`}
        </style>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div
            className="flex gap-4"
            style={{
              width: "300%",
              animation: "scroll-hogar 60s linear infinite",
            }}
          >
            {[
              ...categoriasDestacadas,
              ...categoriasDestacadas,
              ...categoriasDestacadas,
            ].map((c, idx) => (
              <article
                key={idx}
                className="w-[240px] flex-shrink-0 bg-white border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="bg-gray-100 h-36">
                  <img
                    src={c.img}
                    alt={c.subt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center space-y-1">
                  <p className="text-sm text-gray-600">{c.titulo}</p>
                  <p className="text-base font-semibold text-gray-900">
                    {c.subt}
                  </p>
                  <button
                    onClick={scrollToCatalogo}
                    className="mt-4 inline-block border-2 border-[#c2185b] dark:border-[#e48ab1] text-[#c2185b] dark:text-white hover:bg-[#c2185b] hover:text-white transition rounded-xl px-2 py-1 shadow-sm dark:shadow-[0_12px_40px_rgba(241,25,125,0.35)]"
                  >
                    Comprar ahora
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <CategoryCatalog
          category="hogar"
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
