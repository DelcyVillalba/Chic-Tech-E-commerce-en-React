import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DailyDeals from "../components/DailyDeals";
import ErrorState from "../components/ErrorState";
import Hero from "../components/Hero";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import SubscribeBanner from "../components/SubscribeBanner";
import SupportStrip from "../components/SupportStrip";
import useProducts from "../hooks/useProducts";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  // En Home solo usamos paginación simple sobre todo el catálogo,
  // sin sincronizar con la barra de búsqueda global.
  const [filters, setFilters] = useState({
    page: 1,
    perPage: 8,
  });
  const { data, loading, error, total, totalPages } = useProducts(filters);

  useEffect(() => {
    if (location.state?.restoreCatalog) {
      const saved = Number(sessionStorage.getItem("catalog-scroll") || 0);
      if (!Number.isNaN(saved)) {
        setTimeout(
          () => window.scrollTo({ top: saved, behavior: "smooth" }),
          100
        );
      }
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const handlePageChange = (p) => {
    setFilters((f) => ({ ...f, page: p }));

    if (typeof window !== "undefined") {
      const el = document.getElementById("catalogo");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };
  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  const hasProducts = data && data.length > 0;

  return (
    <>
      <Hero />
      <div className="bg-white dark:bg-[#0b0913] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("catalogo")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 underline"
          >
            Ver todos
          </button>
        </div>
      </div>
      <DailyDeals />

      {/* Marcas Destacadas - Animado */}
      <section className="bg-white dark:bg-[#0f0c19] py-12 border-y border-zinc-100 dark:border-[#1f1a2e] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-2">
              Marcas Destacadas
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Trabajamos con las mejores marcas
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* Primera fila de logos */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-370.png"
                    alt="Marca 8"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              {/* Segunda fila duplicada */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-370.png"
                    alt="Marca 8"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              {/* Tercera fila duplicada */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-370.png"
                    alt="Marca 8"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }
            
            .animate-scroll {
              animation: scroll 90s linear infinite;
              width: fit-content;
            }
            
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4 sm:mb-5">
          <h1 className="text-2xl sm:text-3xl font-semibold">Catálogo</h1>
          {hasProducts && (
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium">
              Mostrando {total} producto{total === 1 ? "" : "s"}.
            </p>
          )}
        </div>

        <section id="catalogo" className="min-h-24 scroll-mt-28 sm:scroll-mt-32">
          {loading && <Loader />}
          {error && <ErrorState message={error} />}
          {!loading && !error && (
            <>
              {hasProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 space-y-2">
                  <p>
                    No hay productos disponibles en el catálogo en este momento.
                  </p>
                  <p>
                    Si estás buscando algo específico que aún no tenemos,
                    podés escribirnos desde la página de{" "}
                    <Link
                      to="/contacto"
                      className="underline font-semibold"
                    >
                      contacto
                    </Link>{" "}
                    o escribirnos directamente por el WhatsApp que ves en la esquina inferior derecha.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {!loading && !error && (
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPage={handlePageChange}
            minButtons={3}
          />
        )}
      </main>
      <SubscribeBanner className="pt-0" />
      <SupportStrip />
    </>
  );
}
