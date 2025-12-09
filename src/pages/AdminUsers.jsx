import { useEffect, useState } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "../api/users";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import AdminShell from "../components/AdminShell";

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [editId, setEditId] = useState(null);

  const load = () => {
    setLoading(true);
    setErr("");
    listUsers()
      .then(setRows)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!editId && !form.password) {
      setErr("Ingresa una contraseña para crear el usuario.");
      return;
    }
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        password: form.password,
      };
      if (editId && !form.password) delete payload.password; // en edición, solo si se escribe

      if (editId) {
        await updateUser(editId, payload);
      } else {
        await createUser(payload);
      }
      setForm({ name: "", email: "", password: "", role: "customer" });
      setEditId(null);
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  if (loading) return <Loader />;
  if (err) return <ErrorState message={err} />;

  return (
    <AdminShell title="Usuarios" onRefresh={load}>
      <div className="space-y-3 w-full text-zinc-900 dark:text-zinc-100 transition-colors">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Usuarios</h1>
        </div>

        <form
          onSubmit={submit}
          className="grid md:grid-cols-5 gap-2 border border-zinc-300 dark:border-[#2a2338] rounded-2xl p-3 bg-[#e5e7eb] dark:bg-[#131121] shadow-sm"
        >
          {err && (
            <div className="md:col-span-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {err}
            </div>
          )}
          <input
            className="border border-zinc-200 dark:border-[#2a2338] bg-[#f9fafb] dark:bg-[#131121] rounded px-3 py-2 md:col-span-1 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border border-zinc-200 dark:border-[#2a2338] bg-[#f9fafb] dark:bg-[#131121] rounded px-3 py-2 md:col-span-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border border-zinc-200 dark:border-[#2a2338] bg-[#f9fafb] dark:bg-[#131121] rounded px-3 py-2 md:col-span-1 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder={editId ? "Contraseña (opcional)" : "Contraseña"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="border border-zinc-200 dark:border-[#2a2338] bg-[#f9fafb] dark:bg-[#131121] rounded px-3 py-2 md:col-span-1 text-gray-900 dark:text-gray-100"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="customer">Cliente</option>
            <option value="admin">Admin</option>
          </select>
          <div className="md:col-span-5 flex justify-end">
            <button className="bg-black text-white rounded-xl px-3 py-2 text-sm font-semibold w-fit dark:bg-[#c2185b] dark:hover:bg-[#d90f6c] transition-colors">
              {editId ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
          {editId && (
            <div className="md:col-span-5 flex justify-end">
              <button
                type="button"
                className="text-sm text-gray-600 dark:text-gray-300 underline"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", email: "", password: "", role: "customer" });
                }}
              >
                Cancelar edición
              </button>
            </div>
          )}
        </form>

        <div className="overflow-x-auto border border-zinc-300 dark:border-[#2a2338] rounded-2xl bg-[#e5e7eb] dark:bg-[#131121] shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#161225]">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Rol</th>
                <th className="p-2 text-left">Activo</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-t border-zinc-200 dark:border-[#2a2338]">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select
                      className="border border-zinc-200 dark:border-[#2a2338] rounded px-2 py-1 bg-[#f9fafb] dark:bg-[#131121] text-gray-900 dark:text-gray-100"
                      value={u.role}
                      onChange={async (e) => {
                        await updateUser(u.id, { role: e.target.value });
                        load();
                      }}
                    >
                      <option value="customer">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={u.active !== false}
                      onChange={async (e) => {
                        await updateUser(u.id, { active: e.target.checked });
                        load();
                      }}
                    />
                  </td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditId(u.id);
                        setForm({
                          name: u.name || "",
                          email: u.email || "",
                          password: "",
                          role: u.role || "customer",
                        });
                      }}
                      className="px-2 py-1 border border-zinc-300 dark:border-[#2a2338] rounded hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        await deleteUser(u.id);
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
      </div>
    </AdminShell>
  );
}
