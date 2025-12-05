import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "../api/products";
import AdminShell from "../components/AdminShell";

const empty = {
  title: "",
  price: "",
  description: "",
  image: "",
  category: "tecnologia",
  stock: "",
};

const formatPriceInputValue = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return `${value}`;
};

const parsePriceInputValue = (value) => {
  if (value === null || value === undefined) return NaN;
  const raw = `${value}`.replace(/\s+/g, "");
  if (!raw) return NaN;
  const sanitized = raw.replace(/[^\d.,]/g, "");
  if (!sanitized) return NaN;

  if (sanitized.includes(",")) {
    const [intPart, decimalPart = ""] = sanitized.split(",");
    const normalizedInt = intPart.replace(/\./g, "");
    const normalizedDecimal = decimalPart.replace(/\./g, "");
    return Number(`${normalizedInt}.${normalizedDecimal}`);
  }

  if (sanitized.includes(".")) {
    const segments = sanitized.split(".");
    const last = segments.pop() || "";
    const intPart = segments.join("") || "0";
    const intValue = Number(intPart);
    const treatAsThousands =
      last.length === 3 && intValue > 0;

    if (treatAsThousands) {
      return Number(`${intPart}${last}`);
    }
    return Number(`${intPart}.${last}`);
  }

  return Number(sanitized);
};
export default function ProductForm() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const [form, setForm] = useState(empty),
    [loading, setLoading] = useState(!!id),
    [err, setErr] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((d) =>
        setForm({
          ...empty,
          ...d,
          price: formatPriceInputValue(d.price),
          stock:
            d.stock === null || d.stock === undefined ? "" : `${d.stock}`,
        })
      )
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (!id) {
      const cat = search.get("category");
      if (cat) setForm((f) => ({ ...f, category: cat }));
    }
  }, [id, search]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const priceNumber = parsePriceInputValue(form.price);
      if (Number.isNaN(priceNumber)) {
        setErr("Precio inválido");
        return;
      }
      const stockNumber =
        form.stock === "" ? 0 : Number(form.stock);
      if (Number.isNaN(stockNumber)) {
        setErr("Stock inválido");
        return;
      }
      const payload = {
        ...form,
        price: priceNumber,
        stock: stockNumber,
      };
      if (id) await updateProduct(id, payload);
      else await createProduct(payload);
      nav("/admin/products");
    } catch (e) {
      setErr(e.message);
    }
  };
  if (loading)
    return (
      <AdminShell title={id ? "Editar producto" : "Nuevo producto"}>
        <div className="p-8">Cargando…</div>
      </AdminShell>
    );
  return (
    <AdminShell title={id ? "Editar producto" : "Nuevo producto"}>
      <main className="max-w-xl mx-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">
            {id ? "Editar" : "Nuevo"} producto
          </h1>
          <Link
            to="/admin/products"
            className="text-sm border border-zinc-200 dark:border-[#2a2338] rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            ← Productos
          </Link>
        </div>
        {err && <div className="text-red-600 mb-2">Error: {err}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Imagen (ruta o URL, ej: /tecnologia/1 (1).png)"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            list="img-options"
          />
          <p className="text-xs text-gray-500">
            Tip: escribe /{form.category}/ y el nombre del archivo que está en esa carpeta pública.
          </p>
          <datalist id="img-options">
            <option value="/tecnologia/1 (1).png" />
            <option value="/mujer/1.png" />
            <option value="/hombre/10 (1).png" />
            <option value="/accesorios/11.png" />
            <option value="/cosmeticos/1 (11).png" />
            <option value="/hogar/1 (2).png" />
            <option value="/jardin/1 (3).png" />
            <option value="/libros/1 (5).png" />
            <option value="/mascotas/1 (10).png" />
            <option value="/ninos/23.png" />
          </datalist>
          {form.image && (
            <img src={form.image} alt="" className="h-32 object-contain" />
          )}
          <input
            className="w-full border rounded px-3 py-2"
            type="text"
            inputMode="decimal"
            placeholder="Precio"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="w-full border rounded px-3 py-2"
            type="number"
            min="0"
            placeholder="Stock (unidades)"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={form.category}
            onChange={(e) => {
              const categoria = e.target.value;
              setForm((prev) => ({
                ...prev,
                category: categoria,
                image:
                  prev.image?.startsWith("/") && prev.image.split("/").length <= 3
                    ? `/${categoria}/`
                    : prev.image,
              }));
            }}
          >
            <option value="tecnologia">Tecnología</option>
            <option value="mujer">Moda mujer</option>
            <option value="hombre">Moda hombre</option>
          <option value="ninos">Moda niños</option>
            <option value="accesorios">Accesorios</option>
            <option value="cosmeticos">Cosméticos</option>
            <option value="hogar">Hogar</option>
            <option value="jardin">Jardín</option>
            <option value="libros">Libros</option>
            <option value="mascotas">Mascotas</option>
          </select>
          <button className="bg-black text-white px-4 py-2 rounded-xl">
            {id ? "Guardar cambios" : "Crear"}
          </button>
        </form>
      </main>
    </AdminShell>
  );
}
