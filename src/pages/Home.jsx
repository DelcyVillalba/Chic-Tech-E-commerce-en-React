import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialFilters = useMemo(
    () => ({
      q: params.get("q") ?? "",
      category: params.get("category") ?? "",
      sort: params.get("sort") ?? "",
      min: params.get("min") ? Number(params.get("min")) : "",
      max: params.get("max") ? Number(params.get("max")) : "",
      page: Number(params.get("page") || 1),
      perPage: 8,
    }),
    [params]
  );
  const [filters, setFilters] = useState(initialFilters);

  // Mantener sincronizado el parámetro q con el buscador del navbar
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

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

  const { data, loading, error, totalPages } = useProducts(filters);
  const setPage = (p) => setFilters((f) => ({ ...f, page: p }));
  const onChange = (f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }));
  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

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
                    src="public/assets/img/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-370.png"
                    alt="Marca 8"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              {/* Segunda fila duplicada */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-370.png"
                    alt="Marca 8"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              {/* Tercera fila duplicada */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="public/assets/img/icon-img/logoipsum-370.png"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div id="catalogo-anchor" className="h-4" />
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">Catálogo</h1>
        </div>

        <section id="catalogo" className="min-h-24">
          {loading && <Loader />}
          {error && <ErrorState message={error} />}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>

        {!loading && !error && (
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPage={setPage}
            minButtons={3}
          />
        )}
      </main>
      <SubscribeBanner className="pt-0" />
      <SupportStrip />
    </>
  );
}
