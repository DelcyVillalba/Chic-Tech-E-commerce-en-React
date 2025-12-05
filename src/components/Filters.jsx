import { useEffect, useState } from "react";
import { tCategory } from "../i18n/es";
import { listCategories } from "../api/products";

export default function Filters({ value, onChange }) {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    listCategories()
      .then(setCats)
      .catch(() => setCats([]));
  }, []);

  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <section className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-zinc-900 dark:text-zinc-100">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.65" y1="16.65" x2="21" y2="21" />
        </svg>
        <input
          value={value.q}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Buscar productos…"
          className="border border-zinc-200 dark:border-[#2a2338] rounded-lg pl-10 pr-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-[#f5c7d6] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
        />
      </div>

      <select
        value={value.category}
        onChange={(e) => update({ category: e.target.value })}
        className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-[#f5c7d6] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
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
        className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-[#f5c7d6] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
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
          className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-[##f5f5f0] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
          placeholder="Mín"
          value={value.min ?? ""}
          onChange={(e) =>
            update({ min: e.target.value ? Number(e.target.value) : "" })
          }
        />

        <input
          type="number"
          className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-#f5f5f0] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
          placeholder="Máx"
          value={value.max ?? ""}
          onChange={(e) =>
            update({ max: e.target.value ? Number(e.target.value) : "" })
          }
        />
      </div>
    </section>
  );
}
