import { useEffect, useState } from "react";
import { listProducts, deleteProduct } from "../api/products";
import { Link, useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [err, setErr] = useState("");
  const nav = useNavigate();
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
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold">Administrador de productos</h1>
        <Link
          to="/admin/products/new"
          className="bg-black text-white px-3 py-1 rounded-xl"
        >
          Nuevo
        </Link>
      </div>
      {loading && <div>Cargando…</div>}
      {err && <div className="text-red-600">Error: {err}</div>}
      <table className="w-full text-sm border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2">Imagen</th>
            <th className="p-2 text-left">Título</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.id}</td>
              <td className="p-2">
                <img
                  src={r.image}
                  alt=""
                  className="h-12 mx-auto object-contain"
                />
              </td>
              <td className="p-2">{r.title}</td>
              <td className="p-2">{"$" + r.price}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => nav(`/admin/products/${r.id}/edit`)}
                  className="px-2 py-1 border rounded"
                >
                  Editar
                </button>
                <button
                  onClick={async () => {
                    await deleteProduct(r.id);
                    load();
                  }}
                  className="px-2 py-1 border rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
