import { useState } from "react";
import useProducts from "../hooks/useProducts";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";

export default function Home() {
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    sort: "",
    min: "",
    max: "",
    page: 1,
    perPage: 8,
  });
  const { data, loading, error, totalPages } = useProducts(filters);
  const setPage = (p) => setFilters((f) => ({ ...f, page: p }));
  const onChange = (f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }));
  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Catálogo</h1>
      <Filters value={filters} onChange={onChange} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onPage={setPage}
      />
    </main>
  );
}
