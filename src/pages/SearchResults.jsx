import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import useProducts from "../hooks/useProducts";
import BackButton from "../components/BackButton";

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();

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
  const { data, loading, error, total, totalPages } = useProducts(filters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasProducts = data && data.length > 0;

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));

    const search = new URLSearchParams(location.search);
    if (page > 1) {
      search.set("page", String(page));
    } else {
      search.delete("page");
    }

    setParams(search, { replace: false });

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <BackButton className="mb-3 sm:mb-4" />
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Resultados de búsqueda
        </h1>
        {filters.q && (
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium">
            {hasProducts
              ? `Mostrando ${total} resultado${total === 1 ? "" : "s"} para “${
                  filters.q
                }”.`
              : `No encontramos productos para “${filters.q}”.`}
          </p>
        )}
      </div>

      <section className="min-h-24">
        {hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              {filters.q
                ? `No encontramos productos para “${filters.q}” con los filtros actuales.`
                : "No hay productos que coincidan con los filtros seleccionados."}
            </p>
            <p>
              Si estás buscando algo específico que aún no tenemos, podés
              escribirnos desde la página de{" "}
              <Link to="/contacto" className="underline font-semibold">
                contacto
              </Link>{" "}
              o escribirnos directamente por el WhatsApp que ves en la esquina
              inferior derecha.
            </p>
          </div>
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
  );
}
