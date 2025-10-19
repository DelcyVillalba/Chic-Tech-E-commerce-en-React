import { useEffect, useState } from "react";
import { listCategories } from "../api/products";
import { tCategory } from "../i18n/es"; // Importa las traducciones de categorías

export default function Filters({ value, onChange }) {
  const [cats, setCats] = useState([]);
  useEffect(() => {
    listCategories()
      .then(setCats)
      .catch(() => setCats([]));
  }, []);
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <section className="mb-4 grid gap-2 md:grid-cols-4">
      <input
        value={value.q}
        onChange={(e) => update({ q: e.target.value })}
        placeholder="Buscar…"
        className="border rounded-xl px-3 py-2 w-full"
      />
      <select
        value={value.category}
        onChange={(e) => update({ category: e.target.value })}
        className="border rounded-xl px-3 py-2 w-full"
      >
        <option value="">Todas las categorías</option>
        {cats.map((c) => (
          <option key={c} value={c}>
            {tCategory[c] ?? c}
          </option>
        ))}
      </select>
      <select
        value={value.sort}
        onChange={(e) => update({ sort: e.target.value })}
        className="border rounded-xl px-3 py-2 w-full"
      >
        <option value="">Ordenar</option>
        <option value="price-asc">Precio ↑</option>
        <option value="price-desc">Precio ↓</option>
        <option value="title-asc">Nombre A→Z</option>
        <option value="title-desc">Nombre Z→A</option>
      </select>
      <div className="flex gap-2">
        <input
          type="number"
          className="border rounded-xl px-3 py-2 w-full"
          placeholder="Precio mín"
          value={value.min ?? ""}
          onChange={(e) =>
            update({ min: e.target.value ? Number(e.target.value) : "" })
          }
        />
        <input
          type="number"
          className="border rounded-xl px-3 py-2 w-full"
          placeholder="Precio máx"
          value={value.max ?? ""}
          onChange={(e) =>
            update({ max: e.target.value ? Number(e.target.value) : "" })
          }
        />
      </div>
    </section>
  );
}
