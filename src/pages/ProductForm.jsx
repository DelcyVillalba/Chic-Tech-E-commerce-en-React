import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "../api/products";

const empty = {
  title: "",
  titleEs: "",
  price: 0,
  description: "",
  descriptionEs: "",
  image: "",
  category: "electronics",
};
export default function ProductForm() {
  const { id } = useParams();
  const [form, setForm] = useState(empty),
    [loading, setLoading] = useState(!!id),
    [err, setErr] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((d) => setForm(d))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (id) await updateProduct(id, form);
      else await createProduct(form);
      nav("/admin/products");
    } catch (e) {
      setErr(e.message);
    }
  };
  if (loading) return <div className="p-8">Cargando…</div>;
  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">
        {id ? "Editar" : "Nuevo"} producto
      </h1>
      {err && <div className="text-red-600 mb-2">Error: {err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Título (EN)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Título (ES)"
          value={form.titleEs ?? ""}
          onChange={(e) => setForm({ ...form, titleEs: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Imagen (URL)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        {form.image && (
          <img src={form.image} alt="" className="h-32 object-contain" />
        )}
        <input
          className="w-full border rounded px-3 py-2"
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Descripción (EN)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Descripción (ES)"
          value={form.descriptionEs ?? ""}
          onChange={(e) => setForm({ ...form, descriptionEs: e.target.value })}
        />
        <select
          className="w-full border rounded px-3 py-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>electronics</option>
          <option>jewelery</option>
          <option>men's clothing</option>
          <option>women's clothing</option>
        </select>
        <button className="bg-black text-white px-4 py-2 rounded-xl">
          {id ? "Guardar cambios" : "Crear"}
        </button>
      </form>
    </main>
  );
}
