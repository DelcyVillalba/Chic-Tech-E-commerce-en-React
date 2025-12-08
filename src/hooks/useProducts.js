import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/products";
import { translate } from "../i18n/es";

const normalizeText = (val) => {
  if (!val) return "";
  try {
    return val
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  } catch {
    return val.toString().toLowerCase();
  }
};

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
    const category = params?.category;
    const q = params?.q;
    const min = params?.min;
    const max = params?.max;
    const sort = params?.sort;

    let arr = all;

    // Filtrar por categoría
    if (category) arr = arr.filter((p) => p.category === category);

    // Búsqueda por nombre (insensible a mayúsculas y acentos)
    if (q) {
      const qNorm = normalizeText(q);
      arr = arr.filter((p) => {
        const text = normalizeText(p.title || p.name || "");
        return text.includes(qNorm);
      });
    }

    // Filtro por precio mínimo
    if (min !== "" && min != null)
      arr = arr.filter((p) => p.price >= Number(min));

    // Filtro por precio máximo
    if (max !== "" && max != null)
      arr = arr.filter((p) => p.price <= Number(max));

    // Ordenamientos explícitos
    if (sort) {
      switch (sort) {
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
    }

    // Sin orden seleccionado: mezclar aleatoriamente
    return [...arr].sort(() => Math.random() - 0.5);
  }, [all, params?.category, params?.q, params?.min, params?.max, params?.sort]);

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
