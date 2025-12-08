import { useState, useMemo, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import Loader from "./Loader";
import ErrorState from "./ErrorState";
import Pagination from "./Pagination";

export default function CategoryCatalog({
  category,
  title = "Catálogo",
  anchorId = "catalogo",
  perPage = 8,
  showHeader = false,
}) {
  const [page, setPage] = useState(1);
  const { data, loading, error, totalPages } = useProducts({
    category,
    page,
    perPage,
  });

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    if (typeof window !== "undefined") {
      const el = document.getElementById(anchorId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const offset = 80;
        window.scrollTo({
          top: rect.top + window.scrollY - offset,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages || 1));
  }, [totalPages]);

  const hasProducts = useMemo(() => data && data.length > 0, [data]);

  return (
    <section id={anchorId} className="mt-10 sm:mt-12">
      {showHeader && (
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
        </div>
      )}

      <div className="min-h-24">
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
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No hay productos en esta categoría.
              </p>
            )}
          </>
        )}
      </div>

      {!loading && !error && hasProducts && (
        <div className="mt-4 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={handlePageChange}
            minButtons={3}
          />
        </div>
      )}
    </section>
  );
}
