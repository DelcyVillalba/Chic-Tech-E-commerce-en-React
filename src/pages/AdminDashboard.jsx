import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../api/products";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import AdminShell from "../components/AdminShell";
import { formatARS } from "../utils/format";

const httpMethods = ["GET", "POST", "PUT", "DELETE"];

const mockChart = [12, 18, 9, 22, 15, 19, 27];

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [endpoint, setEndpoint] = useState("/products");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState('{"title": "Nuevo producto"}');
  const [apiResponse, setApiResponse] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchCat, setSearchCat] = useState("");
  const [searchRecent, setSearchRecent] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const items = await listProducts();
      setData(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = data.length;
    const sumPrice = data.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
    const perCategory = data.reduce((acc, item) => {
      const key = item.category || "Sin categoría";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const recent = [...data].reverse().slice(0, 5);
    return {
      total,
      avgPrice: total ? sumPrice / total : 0,
      perCategory,
      recent,
    };
  }, [data]);

  const daysOfMonth = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const offset = (first.getDay() + 6) % 7; // lunes = 0
    const days = Array.from({ length: offset }, () => null);
    for (let d = 1; d <= last.getDate(); d++) {
      days.push(new Date(y, m, d));
    }
    return days;
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const testApi = async (e) => {
    e.preventDefault();
    setApiResponse("Consultando…");
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers:
          method === "GET" || method === "DELETE"
            ? undefined
            : { "Content-Type": "application/json" },
        body:
          method === "GET" || method === "DELETE" ? undefined : body || "{}",
      });
      const text = await res.text();
      const contentType = res.headers.get("content-type") || "";
      let payload = text;
      if (contentType.includes("application/json")) {
        try {
          const parsed = JSON.parse(text);
          payload = formatKV(parsed);
        } catch {
          payload = text;
        }
      }
      setApiResponse(
        `${res.status} ${res.statusText}\n${payload || "(sin contenido)"}`
      );
    } catch (err) {
      setApiResponse(`Error: ${err.message}`);
    }
  };

  const catEntries = useMemo(() => {
    const term = searchCat.toLowerCase();
    return Object.entries(stats.perCategory).filter(([cat]) =>
      cat.toLowerCase().includes(term)
    );
  }, [stats.perCategory, searchCat]);

  const recentFiltered = useMemo(() => {
    const term = searchRecent.toLowerCase();
    return stats.recent.filter(
      (item) =>
        (item.title || item.name || "")
          .toLowerCase()
          .includes(term) || (item.category || "").toLowerCase().includes(term)
    );
  }, [stats.recent, searchRecent]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <AdminShell title="Dashboard" onRefresh={load}>
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Bienvenido de vuelta, aquí tienes un resumen rápido.
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Productos</span>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-2">Publicados</p>
          </article>
          <article className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Precio promedio</span>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              {formatARS.format(stats.avgPrice || 0)}
            </p>
          </article>
          <article className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Categorías</span>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
              {Object.keys(stats.perCategory).length}
            </p>
          </article>
        </section>

        {/* Chart & Calendar */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="font-semibold text-gray-900">Ingresos semanales</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg w-fit">$1250</span>
            </div>
            <div className="flex items-end gap-1.5 sm:gap-2 h-40 sm:h-48">
              {mockChart.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-sky-200 to-[#fbd5df] hover:opacity-80 transition-opacity"
                  style={{ height: `${Math.max(8, v * 4)}px` }}
                  title={`Semana ${i + 1}: ${v}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Vista mensual</p>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="space-y-3 text-center">
              <h2 className="font-semibold text-gray-900">Calendario</h2>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <button
                  type="button"
                  className="px-2 sm:px-3 py-1.5 rounded-lg border border-zinc-300 text-gray-700 dark:text-gray-200 hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors"
                  onClick={() =>
                    setCurrentMonth(
                      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
                    )
                  }
                >
                  ←
                </button>
                <span className="capitalize min-w-[140px] sm:min-w-[160px] text-center font-medium text-gray-900">
                  {monthLabel}
                </span>
                <button
                  type="button"
                  className="px-2 sm:px-3 py-1.5 rounded-lg border border-zinc-300 text-gray-700 dark:text-gray-200 hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors"
                  onClick={() =>
                    setCurrentMonth(
                      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
                    )
                  }
                >
                  →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500 mt-3">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <span key={d} className="font-semibold py-1">
                  {d}
                </span>
              ))}
              {daysOfMonth.map((d, idx) => {
                if (!d) return <div key={`blank-${idx}`} className="h-7 sm:h-8"></div>;
                const isToday = isSameDay(d, new Date());
                const isSelected = isSameDay(d, selectedDate);
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => setSelectedDate(d)}
                    className={`h-7 sm:h-8 grid place-items-center rounded-lg border text-xs transition-all ${isSelected
                      ? "bg-[#c2185b] text-white border-[#c2185b] font-semibold"
                      : isToday
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "border-transparent hover:border-zinc-300"
                      }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
            {selectedDate && (
              <p className="text-xs text-gray-600 mt-3 text-center">
                {selectedDate.toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            )}
          </article>
        </section>

        {/* Categories & Recent */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="font-semibold text-gray-900">Por categoría</h2>
              <input
                className="text-xs border border-zinc-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#f5c7d6] focus:border-[#c2185b] outline-none w-full sm:w-auto"
                placeholder="Buscar"
                value={searchCat}
                onChange={(e) => setSearchCat(e.target.value)}
              />
            </div>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {catEntries.length === 0 && (
                <li className="text-sm text-gray-500 px-3 py-2 text-center">
                  Sin resultados
                </li>
              )}
              {catEntries.map(([cat, count]) => (
                <li
                  key={cat}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#131121] px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{cat}</span>
                    {count === 0 && (
                      <span className="text-xs text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded whitespace-nowrap">Vacía</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <button
                      className="px-2.5 py-1.5 border border-zinc-300 dark:border-[#2a2338] rounded-lg hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors whitespace-nowrap text-gray-900 dark:text-gray-100"
                      onClick={() => nav(`/admin/products?category=${cat}`)}
                    >
                      Ver
                    </button>
                    <Link
                      to={`/admin/products/new?category=${cat}`}
                      className="px-2.5 py-1.5 border border-zinc-300 dark:border-[#2a2338] rounded-lg hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors whitespace-nowrap text-gray-900 dark:text-gray-100"
                    >
                      Agregar
                    </Link>
                    <span className="font-semibold text-sm bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-100 px-2 py-1 rounded whitespace-nowrap">{count}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="font-semibold text-gray-900">Últimos cargados</h2>
              <input
                className="text-xs border border-zinc-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#f5c7d6] focus:border-[#c2185b] outline-none w-full sm:w-auto"
                placeholder="Buscar"
                value={searchRecent}
                onChange={(e) => setSearchRecent(e.target.value)}
              />
            </div>
            {recentFiltered.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No hay productos aún.</p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {recentFiltered.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#131121] px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1 text-sm text-gray-900 dark:text-gray-100">
                        {item.name || item.title || "Sin título"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">{item.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded whitespace-nowrap">
                      {formatARS.format(Number(item.price || 0))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>

        {/* API Tester */}
        <section className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Tester rápido de API</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Experimenta con los endpoints en {baseUrl}
            </p>
          </div>

          <form
            onSubmit={testApi}
            className="grid gap-3 grid-cols-1 sm:grid-cols-[100px,1fr] items-start"
          >
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="h-10 rounded-lg border border-zinc-300 px-3 text-sm focus:ring-2 focus:ring-[#f5c7d6] focus:border-[#c2185b] outline-none"
            >
              {httpMethods.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="h-10 rounded-lg border border-zinc-300 px-3 text-sm focus:ring-2 focus:ring-[#f5c7d6] focus:border-[#c2185b] outline-none"
              placeholder="/products"
            />
            {method !== "GET" && method !== "DELETE" ? (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="sm:col-span-2 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-[#f5c7d6] focus:border-[#c2185b] outline-none h-24 sm:h-28"
              />
            ) : null}
            <button className="sm:col-span-2 bg-black text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-zinc-900 transition-colors w-full sm:w-fit">
              ▶ Ejecutar
            </button>
          </form>

          <pre className="rounded-lg bg-zinc-900 text-white p-4 text-xs sm:text-sm overflow-auto whitespace-pre-wrap break-words max-h-64">
            {apiResponse || "Aquí verás la respuesta de la API"}
          </pre>
        </section>
      </div>
    </AdminShell>
  );
}

function formatKV(data, indent = 0) {
  const pad = "  ".repeat(indent);
  if (Array.isArray(data)) {
    return data
      .map((item, idx) => `${pad}[${idx}]\n${formatKV(item, indent + 1)}`)
      .join("\n");
  }
  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(
        ([k, v]) =>
          `${pad}${k}: ${v && typeof v === "object" ? "\n" + formatKV(v, indent + 1) : String(v)
          }`
      )
      .join("\n");
  }
  return pad + String(data);
}
