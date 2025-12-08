import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { createProduct, getProduct, updateProduct } from "../api/products";
import AdminShell from "../components/AdminShell";

const empty = {
  title: "",
  price: "",
  discount: "",
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
    const treatAsThousands = last.length === 3 && intValue > 0;

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
          discount:
            d.discount === null || d.discount === undefined
              ? ""
              : `${d.discount}`,
          stock: d.stock === null || d.stock === undefined ? "" : `${d.stock}`,
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

  const previewPriceNumber = parsePriceInputValue(form.price);
  const previewDiscountNumber =
    form.discount === "" ||
    form.discount === null ||
    form.discount === undefined
      ? 0
      : Number(form.discount);
  const hasValidPreviewPrice = !Number.isNaN(previewPriceNumber);
  const hasValidPreviewDiscount =
    !Number.isNaN(previewDiscountNumber) && previewDiscountNumber >= 0;
  const finalPreview =
    hasValidPreviewPrice && hasValidPreviewDiscount
      ? previewPriceNumber * (1 - previewDiscountNumber / 100)
      : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const priceNumber = parsePriceInputValue(form.price);
      if (Number.isNaN(priceNumber)) {
        setErr("Precio inválido");
        return;
      }
      const discountNumber = form.discount === "" ? 0 : Number(form.discount);
      if (
        Number.isNaN(discountNumber) ||
        discountNumber < 0 ||
        discountNumber > 100
      ) {
        setErr("Descuento inválido (0 a 100)");
        return;
      }
      const stockNumber = form.stock === "" ? 0 : Number(form.stock);
      if (Number.isNaN(stockNumber)) {
        setErr("Stock inválido");
        return;
      }
      const payload = {
        ...form,
        price: priceNumber,
        discount: discountNumber,
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
        <form
          onSubmit={onSubmit}
          className="space-y-3 border border-zinc-200 dark:border-[#2a2338] rounded-2xl p-4 bg-gray-50 dark:bg-[#2a2338]"
        >
          <input
            className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            value={form.category}
            onChange={(e) => {
              const categoria = e.target.value;
              setForm((prev) => ({
                ...prev,
                category: categoria,
                image:
                  prev.image?.startsWith("/") &&
                  prev.image.split("/").length <= 3
                    ? `/${categoria}/`
                    : prev.image,
              }));
            }}
          >
            <option value="mujer">Moda mujer</option>
            <option value="hombre">Moda hombre</option>
            <option value="ninos">Moda niños</option>
            <option value="accesorios">Accesorios</option>
            <option value="cosmeticos">Cosméticos</option>
            <option value="hogar">Hogar</option>
            <option value="jardin">Jardín</option>
            <option value="mascotas">Mascotas</option>
            <option value="tecnologia">Tecnología</option>
            <option value="libros">Libros</option>
          </select>
          <input
            className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder={`Ruta de imagen (ej: /${form.category}/archivo.png)`}
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            list="img-options"
          />
          <datalist id="img-options">
            <option value="/mujer/" />
            <option value="/hombre/" />
            <option value="/ninos/" />
            <option value="/accesorios/" />
            <option value="/cosmeticos/" />
            <option value="/hogar/" />
            <option value="/jardin/" />
            <option value="/mascotas/" />
            <option value="/tecnologia/" />
            <option value="/libros/" />
          </datalist>
          {form.image && (
            <img src={form.image} alt="" className="h-32 object-contain" />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <input
              className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              type="text"
              inputMode="decimal"
              placeholder="Precio original"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              type="number"
              min="0"
              max="100"
              placeholder="Descuento (%)"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
            <div className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400">
              {finalPreview !== null ? (
                <span>
                  Precio con descuento:{" "}
                  <span className="font-semibold">
                    $
                    {finalPreview.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </span>
              ) : (
                <span className="text-gray-400">Precio con descuento</span>
              )}
            </div>
          </div>
          <input
            className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            type="number"
            min="0"
            placeholder="Stock (unidades)"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <textarea
            className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="bg-black text-white rounded-md px-3 py-2 text-sm font-semibold w-fit dark:bg-[#c2185b] dark:hover:bg-[#d90f6c] transition-colors">
            {id ? "Guardar cambios" : "Crear"}
          </button>
        </form>
      </main>
    </AdminShell>
  );
}
