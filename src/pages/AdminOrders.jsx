import { useEffect, useState } from "react";
import { listOrders, updateOrder } from "../api/orders";
import { listProducts } from "../api/products";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import AdminShell from "../components/AdminShell";

const estados = ["pendiente", "en_proceso", "completado", "cancelado"];
const badge = {
  pendiente: "bg-amber-100 text-amber-700 border border-amber-200",
  en_proceso: "bg-blue-100 text-blue-700 border border-blue-200",
  completado: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelado: "bg-gray-100 text-gray-500 border border-gray-200",
};

export default function AdminOrders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [seleccionado, setSeleccionado] = useState(null);
  const [productMap, setProductMap] = useState({});
  const [zoomImg, setZoomImg] = useState("");

  const load = () => {
    setLoading(true);
    setErr("");
    Promise.all([listOrders(), listProducts()])
      .then(([orders, products]) => {
        setRows(orders);
        const map = {};
        products.forEach((p) => (map[p.id] = p));
        setProductMap(map);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <Loader />;
  if (err) return <ErrorState message={err} />;

  const start = (page - 1) * perPage;
  const sortedRows = [...rows].sort((a, b) => {
    const peso = { pendiente: 0, en_proceso: 1, completado: 2, cancelado: 3 };
    return (peso[a.status] ?? 0) - (peso[b.status] ?? 0);
  });
  const paginatedRows = sortedRows.slice(start, start + perPage);
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));

  return (
    <AdminShell title="Pedidos" onRefresh={load}>
      <div className="space-y-3 w-full text-zinc-900 dark:text-zinc-100 transition-colors">
        <h1 className="text-lg sm:text-xl font-semibold">Pedidos</h1>

        <section className="rounded-2xl border border-zinc-300 dark:border-[#2a2338] bg-[#e5e7eb] dark:bg-[#131121] p-4 sm:p-5 space-y-4 shadow-sm">
          {/* Tabla desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border border-zinc-300 dark:border-[#2a2338] bg-[#e5e7eb] dark:bg-[#131121] rounded-2xl overflow-hidden">
              <thead className="bg-gray-50 dark:bg-[#161225]">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-300">
                      No hay pedidos aún.
                    </td>
                  </tr>
                )}
                {paginatedRows.map((o) => (
                  <tr key={o.id} className="border-t border-zinc-200 dark:border-[#2a2338] align-top">
                    <td className="p-2">{o.id}</td>
                    <td className="p-2 text-left">
                      <div className="font-semibold">{o.user?.name || "Cliente"}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">{o.user?.email}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {new Date(o.createdAt).toLocaleString("es-ES")}
                      </div>
                    </td>
                    <td className="p-2">
                      <ul className="space-y-1">
                        {o.items?.map((it) => (
                          <li key={it.id} className="flex justify-between gap-2">
                            <span className="line-clamp-1">{it.title}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">
                              x{it.qty}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2">
                      ${Number(o.totals?.total || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-2">
                      <select
                        className={`rounded px-2 py-1 text-sm capitalize bg-[#f9fafb] dark:bg-[#131121] ${badge[o.status] || "border"}`}
                        value={o.status}
                        onChange={async (e) => {
                          await updateOrder(o.id, { status: e.target.value });
                          load();
                        }}
                      >
                        {estados.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        className="px-2 py-1 border border-zinc-300 dark:border-[#2a2338] rounded text-xs hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                        type="button"
                        onClick={() => setSeleccionado(o)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards móvil */}
          <div className="lg:hidden space-y-4">
            {rows.length === 0 && (
              <div className="border border-zinc-200 dark:border-[#2a2338] rounded-2xl p-4 bg-[#e5e7eb] dark:bg-[#131121] text-center text-sm text-gray-600 dark:text-gray-300">
                No hay pedidos aún.
              </div>
            )}
            {paginatedRows.map((o) => (
              <article
                key={o.id}
                className="border border-zinc-200 dark:border-[#2a2338] rounded-2xl bg-[#e5e7eb] dark:bg-[#131121] p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-300 tracking-wide">
                      Pedido #{o.id}
                    </p>
                    <p className="text-sm font-semibold">{o.user?.name || "Cliente"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">{o.user?.email}</p>
                  </div>
                  <select
                    className={`text-xs rounded px-2 py-1 bg-[#f9fafb] dark:bg-transparent ${badge[o.status] || "border"}`}
                    value={o.status}
                    onChange={async (e) => {
                      await updateOrder(o.id, { status: e.target.value });
                      load();
                    }}
                  >
                    {estados.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <p>Creado: {new Date(o.createdAt).toLocaleString("es-ES")}</p>
                  <p>Entrega: {o.envio || "domicilio"}</p>
                </div>

                <div className="bg-gray-100 dark:bg-[#131121] border border-zinc-200 dark:border-[#2a2338] rounded-xl p-3 space-y-1">
                  {o.items?.map((it) => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span className="pr-2 line-clamp-1 text-gray-900 dark:text-gray-100">
                        {it.title}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">x{it.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>
                    ${Number(o.totals?.total || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setSeleccionado(o)}
                    className="flex-1 border border-zinc-300 dark:border-[#2a2338] rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                  >
                    Ver detalles
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeleccionado(o)}
                    className="px-3 py-2 rounded-lg bg-black text-white dark:bg-[#c2185b] dark:hover:bg-[#d90f6c]"
                  >
                    Abrir
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-3">
            <span>
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-none px-3 py-1 border border-zinc-300 dark:border-[#2a2338] rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg_white/10 transition-colors"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Anterior
              </button>
              <button
                className="flex-1 sm:flex-none px-3 py-1 border border-zinc-300 dark:border-[#2a2338] rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg_white/10 transition-colors"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
              >
                Siguiente →
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal detalle */}
      {seleccionado && (
        <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center px-4">
          <div className="bg-[#e5e7eb] dark:bg-[#131121] text-zinc-900 dark:text-zinc-100 rounded-2xl shadow-2xl w-full max-w-2xl p-5 space-y-3 border border-zinc-200 dark:border-[#2a2338]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Pedido #{seleccionado.id}</h2>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded-full ${badge[seleccionado.status] || "border"}`}
                >
                  Estado: {seleccionado.status}
                </span>
              </div>
              <button
                className="text-sm bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600"
                onClick={() => setSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="border border-zinc-200 dark:border-[#2a2338] rounded-xl p-3 space-y-1">
                <p className="font-semibold">Cliente</p>
                <p>{seleccionado.user?.name || "Cliente"}</p>
                <p className="text-gray-600 dark:text-gray-300">{seleccionado.user?.email}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(seleccionado.createdAt).toLocaleString("es-ES")}
                </p>
              </div>
              <div className="border border-zinc-200 dark:border-[#2a2338] rounded-xl p-3 space-y-1">
                <p className="font-semibold">Entrega</p>
                <p className="capitalize">{seleccionado.envio || "domicilio"}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {seleccionado.direccion || seleccionado.direccionCliente || seleccionado.datos?.direccion}
                </p>
                {seleccionado.datos?.celular && (
                  <p className="text-gray-600 dark:text-gray-300">Tel: {seleccionado.datos.celular}</p>
                )}
              </div>
            </div>
            <div className="border border-zinc-200 dark:border-[#2a2338] rounded-xl p-3">
              <p className="font-semibold mb-2">Items</p>
              <ul className="space-y-2 text-sm">
                {seleccionado.items?.map((it) => {
                  const img = it.image || it.img || productMap[it.id]?.image || "";
                  return (
                    <li key={it.id} className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {img ? (
                          <img
                            src={img}
                            alt={it.title}
                            className="h-16 w-16 object-contain border border-zinc-200 dark:border-[#2a2338] rounded cursor-pointer bg-white dark:bg-[#131121]"
                            onClick={() => setZoomImg(img)}
                          />
                        ) : (
                          <div className="h-16 w-16 grid place-items-center border border-zinc-200 dark:border-[#2a2338] rounded text-xs text-gray-500 dark:text-gray-300">
                            Sin imagen
                          </div>
                        )}
                        <span className="line-clamp-1">
                          {it.title} x{it.qty}
                        </span>
                      </div>
                      <span>
                        ${Number(it.price * it.qty).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mt-2">
                <span>Subtotal</span>
                  <span>
                    ${Number(seleccionado.totals?.subtotal || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>IVA</span>
                  <span>
                    ${Number(seleccionado.totals?.iva || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                  <span>
                    ${Number(seleccionado.totals?.total || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
              </div>
            </div>

            {zoomImg && (
              <div
                className="fixed inset-0 z-50 bg-black/60 grid place-items-center px-4"
                onClick={() => setZoomImg("")}
              >
                <img
                  src={zoomImg}
                  alt="Vista ampliada"
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl bg-white dark:bg-[#131121]"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
