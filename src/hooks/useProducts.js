import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/products";
import { translate } from "../i18n/es";

function useProductsHook(params) {
  const [raw, setRaw] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");

  useEffect(() => {
    let ok = true;
    setLoading(true);
    setError("");

    getProducts()
      .then((d) => ok && setRaw(d))
      .catch((e) => ok && setError(e.message))
      .finally(() => ok && setLoading(false));

    return () => {
      ok = false;
    };
  }, []);

  const all = useMemo(() => raw.map(translate), [raw]);

  const filtered = useMemo(() => {
    let arr = all;

    // Filtrar por categoría
    if (params?.category)
      arr = arr.filter((p) => p.category === params.category);

    // Búsqueda por nombre
    if (params?.q) {
      const q = params.q.toLowerCase();
      arr = arr.filter((p) =>
        (p.title || p.name || "").toLowerCase().includes(q)
      );
    }

    // Filtro por precio mínimo
    if (params?.min !== "" && params?.min != null)
      arr = arr.filter((p) => p.price >= Number(params.min));

    // Filtro por precio máximo
    if (params?.max !== "" && params?.max != null)
      arr = arr.filter((p) => p.price <= Number(params.max));

    // Ordenamientos
    switch (params?.sort) {
      case "price-asc":
        arr = [...arr].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        arr = [...arr].sort((a, b) => b.price - a.price);
        break;
      case "title-asc":
        arr = [...arr].sort((a, b) =>
          (a.title || a.name || "").localeCompare(b.title || b.name || "")
        );
        break;
      case "title-desc":
        arr = [...arr].sort((a, b) =>
          (b.title || b.name || "").localeCompare(a.title || a.name || "")
        );
        break;
    }

    return arr;
  }, [all, JSON.stringify(params)]);

  // Paginado
  const page = Number(params?.page || 1),
    perPage = Number(params?.perPage || 8);

  const total = filtered.length,
    totalPages = Math.max(1, Math.ceil(total / perPage));

  const data = filtered.slice((page - 1) * perPage, page * perPage);

  return { data, loading, error, total, totalPages };
}

export default useProductsHook;
export { useProductsHook as useProducts };
