import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { listCategories } from "../api/products";
import { tCategory } from "../i18n/es";
import { useBusinessSettings } from "../context/BusinessSettingsContext";

const parseNumber = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const n = Number(val);
  return Number.isNaN(n) ? "" : n;
};

export default function GlobalFilterBar() {
  const [cats, setCats] = useState([]);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useBusinessSettings();
  const defaults = settings?.catalogDefaults || {};

  const initial = useMemo(
    () => ({
      q: params.get("q") ?? "",
      category: params.get("category") ?? (defaults.category ?? ""),
      sort: params.get("sort") ?? (defaults.sort ?? ""),
      min: parseNumber(params.get("min") ?? defaults.min),
      max: parseNumber(params.get("max") ?? defaults.max),
    }),
    [params, defaults]
  );

  const [filters, setFilters] = useState(initial);

  useEffect(() => {
    setFilters(initial);
  }, [initial]);

  useEffect(() => {
    listCategories()
      .then(setCats)
      .catch(() => setCats([]));
  }, []);

  const update = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const applyFilters = () => {
    const sp = new URLSearchParams();
    if (filters.q) sp.set("q", filters.q);
    if (filters.category) sp.set("category", filters.category);
    if (filters.sort) sp.set("sort", filters.sort);
    if (filters.min !== "" && !Number.isNaN(filters.min)) sp.set("min", String(filters.min));
    if (filters.max !== "" && !Number.isNaN(filters.max)) sp.set("max", String(filters.max));

    navigate(
      {
        pathname: "/",
        search: sp.toString() ? `?${sp.toString()}` : "",
        hash: "catalogo",
      },
      {
        replace: false,
        state: { restoreScroll: true, showFilters: true },
      }
    );
  };

  const visible = location.state?.showFilters === true;

  return (
    <section
      id="global-filter-bar"
      className={`sticky top-16 sm:top-20 z-20 bg-white/95 dark:bg-[#0f0b14]/95 backdrop-blur border-b border-zinc-200 dark:border-[#1f1a2e] overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
        visible
          ? "max-h-[260px] opacity-100 pointer-events-auto"
          : "max-h-0 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center gap-3 transition-transform duration-500 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-2"
        }`}
      >
        <div className="relative flex-1 min-w-[180px]">
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
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Buscar productos…"
            className="border border-zinc-200 dark:border-[#2a2338] rounded-lg pl-10 pr-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-[#f5f5f0] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full md:w-auto">
          <select
            value={filters.category}
            onChange={(e) => update({ category: e.target.value })}
            className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2.5 min-w-[160px] text-sm focus:ring-2 focus:ring-[#f5f5f0] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
          >
            <option value="">Todas las categorías</option>
            {cats.map((c) => (
              <option key={c} value={c}>
                {tCategory[c] ?? c}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2.5 min-w-[140px] text-sm focus:ring-2 focus:ring-[#f5f5f0] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
          >
            <option value="">Ordenar</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
            <option value="title-asc">Nombre A→Z</option>
            <option value="title-desc">Nombre Z→A</option>
          </select>

          <input
            type="number"
            className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2.5 w-24 text-sm focus:ring-2 focus:ring-[#f5f5f0] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
            placeholder="Mín"
            value={filters.min}
            onChange={(e) => update({ min: e.target.value === "" ? "" : Number(e.target.value) })}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
          <input
            type="number"
            className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2.5 w-24 text-sm focus:ring-2 focus:ring-[#f5f5f0] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-white dark:bg-[#161225] dark:text-white"
            placeholder="Máx"
            value={filters.max}
            onChange={(e) => update({ max: e.target.value === "" ? "" : Number(e.target.value) })}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />

          <button
            onClick={applyFilters}
            className="px-4 py-2.5 rounded-lg bg-[#c2185b] text-white text-sm font-semibold shadow-sm hover:bg-[#a3154a] transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </section>
  );
}
