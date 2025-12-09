import { useEffect, useState } from "react";
import { listProducts, deleteProduct } from "../api/products";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminShell from "../components/AdminShell";
import { formatARS } from "../utils/format";

export default function AdminProducts() {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [err, setErr] = useState(""),
    [page, setPage] = useState(1);
  const perPage = 20;
  const [params] = useSearchParams();
  const filtroCat = params.get("category") || "";
  const nav = useNavigate();
  const categorias = [...new Set(rows.map((r) => r.category).filter(Boolean))];
  const load = () => {
    setLoading(true);
    setErr("");
    listProducts()
      .then(setRows)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  return (
    <AdminShell title="Productos" onRefresh={load}>
      <div className="w-full space-y-3 text-zinc-900 dark:text-zinc-100 transition-colors mt-3 sm:mt-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">
            Administrador de productos
          </h1>
          <Link
            to={`/admin/products/new${
              filtroCat ? `?category=${filtroCat}` : ""
            }`}
            className="bg-black text-white px-3 py-1 rounded-md dark:bg-[#c2185b] dark:hover:bg-[#d90f6c] transition-colors"
          >
            Nuevo
          </Link>
        </div>
        {loading && <div>Cargando…</div>}
        {err && <div className="text-red-600">Error: {err}</div>}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span>Categoría:</span>
            <select
              className="border rounded px-2 py-1"
              value={filtroCat}
              onChange={(e) => {
                const value = e.target.value;
                if (value) nav(`/admin/products?category=${value}`);
                else nav("/admin/products");
              }}
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          {filtroCat && (
            <button
              className="text-blue-600 dark:text-blue-300 underline"
              onClick={() => nav("/admin/products")}
            >
              Quitar filtro
            </button>
          )}
        </div>
        <div className="overflow-x-auto border border-zinc-300 dark:border-[#2a2338] rounded-2xl bg-[#e5e7eb] dark:bg-[#131121] shadow-sm">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50 dark:bg-[#161225]">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2">Imagen</th>
                <th className="p-2 text-left">Título</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Precio</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows
                .filter((r) => (filtroCat ? r.category === filtroCat : true))
                .slice((page - 1) * perPage, page * perPage)
                .map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-zinc-200 dark:border-[#2a2338]"
                  >
                    <td className="p-2">{r.id}</td>
                    <td className="p-2">
                      <img
                        src={r.image}
                        alt=""
                        className="h-12 mx-auto object-contain"
                      />
                    </td>
                    <td className="p-2">{r.title}</td>
                    <td className="p-2 text-center">{r.stock ?? 0}</td>
                    <td className="p-2">{formatARS.format(r.price || 0)}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        onClick={() => nav(`/admin/products/${r.id}/edit`)}
                        className="px-2 py-1 border border-zinc-300 dark:border-[#2a2338] rounded hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={async () => {
                          await deleteProduct(r.id);
                          load();
                        }}
                        className="px-2 py-1 border border-zinc-300 dark:border-[#2a2338] rounded hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm">
          <span>
            Página {page} de {Math.max(1, Math.ceil(rows.length / perPage))}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-zinc-300 dark:border-[#2a2338] rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Anterior
            </button>
            <button
              className="px-3 py-1 border border-zinc-300 dark:border-[#2a2338] rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
              disabled={page >= Math.ceil(rows.length / perPage)}
              onClick={() =>
                setPage((p) =>
                  Math.min(Math.ceil(rows.length / perPage) || 1, p + 1)
                )
              }
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
