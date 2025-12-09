import { useEffect, useState } from "react";
import AdminShell from "../components/AdminShell";
import { useBusinessSettings } from "../context/BusinessSettingsContext";
import { listCategories } from "../api/products";

export default function AdminSettings() {
  const { settings, updateSettings, resetSettings } = useBusinessSettings();
  const [cats, setCats] = useState([]);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState(() => ({
    whatsappPhone: settings.whatsappPhone || "5491123456789",
    supportEmail: settings.supportEmail || "contacto@chicytech.com",
    footerText: settings.footerText || "© Chic & Tech",
    catalogDefaults: {
      category: settings.catalogDefaults?.category || "",
      sort: settings.catalogDefaults?.sort || "",
      min: settings.catalogDefaults?.min ?? "",
      max: settings.catalogDefaults?.max ?? "",
    },
  }));

  useEffect(() => {
    setForm({
      whatsappPhone: settings.whatsappPhone || "5491123456789",
      supportEmail: settings.supportEmail || "contacto@chicytech.com",
      footerText: settings.footerText || "© Chic & Tech",
      catalogDefaults: {
        category: settings.catalogDefaults?.category || "",
        sort: settings.catalogDefaults?.sort || "",
        min: settings.catalogDefaults?.min ?? "",
        max: settings.catalogDefaults?.max ?? "",
      },
    });
  }, [settings]);

  useEffect(() => {
    listCategories()
      .then(setCats)
      .catch(() => setCats([]));
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleCatalogChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      catalogDefaults: {
        ...prev.catalogDefaults,
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
  };

  const handleReset = () => {
    resetSettings();
    setSaved(false);
  };

  const handleRefresh = () => {
    setSaved(false);
  };

  return (
    <AdminShell title="Configuración" onRefresh={handleRefresh}>
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">Parámetros de negocio</h1>
          {saved && (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              Cambios guardados
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contacto */}
            <section className="bg-[#e5e7eb] dark:bg-[#131121] rounded-2xl border border-zinc-300 dark:border-[#2a2338] p-5 space-y-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Datos de contacto
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                    Teléfono de WhatsApp
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2 text-sm bg-[#e5e7eb] dark:bg-[#131121] text-gray-900 dark:text-gray-100"
                    placeholder="Ej: 5491123456789"
                    value={form.whatsappPhone}
                    onChange={(e) => handleChange("whatsappPhone", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Botón flotante de WhatsApp.
                  </p>
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                    Email de soporte
                  </label>
                  <input
                    type="email"
                    className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2 text-sm bg-[#e5e7eb] dark:bg-[#131121] text-gray-900 dark:text-gray-100"
                    placeholder="Ej: contacto@chicytech.com"
                    value={form.supportEmail}
                    onChange={(e) => handleChange("supportEmail", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Se utiliza como destino en el formulario de contacto.
                  </p>
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                    Texto del pie de página
                  </label>
                  <input
                    type="text"
                    className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2 text-sm bg-[#e5e7eb] dark:bg-[#131121] text-gray-900 dark:text-gray-100"
                    value={form.footerText}
                    onChange={(e) => handleChange("footerText", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Aparece en el footer del sitio público.
                  </p>
                </div>
              </div>
            </section>

            {/* Catálogo */}
            <section className="bg-[#e5e7eb] dark:bg-[#131121] rounded-2xl border border-zinc-300 dark:border-[#2a2338] p-5 space-y-4 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Filtros por defecto del catálogo
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Estos valores se aplican cuando el usuario abre el catálogo sin filtros en la URL.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                    Categoría inicial
                  </label>
                  <select
                    className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2 bg-[#e5e7eb] dark:bg-[#131121] text-gray-900 dark:text-gray-100"
                    value={form.catalogDefaults.category}
                    onChange={(e) =>
                      handleCatalogChange("category", e.target.value)
                    }
                  >
                    <option value="">Todas</option>
                    {cats.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                    Orden inicial
                  </label>
                  <select
                    className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2 bg-[#e5e7eb] dark:bg-[#131121] text-gray-900 dark:text-gray-100"
                    value={form.catalogDefaults.sort}
                    onChange={(e) =>
                      handleCatalogChange("sort", e.target.value)
                    }
                  >
                    <option value="">Sin orden</option>
                    <option value="price-asc">Precio ↑</option>
                    <option value="price-desc">Precio ↓</option>
                    <option value="title-asc">Nombre A→Z</option>
                    <option value="title-desc">Nombre Z→A</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                    Precio mín. por defecto
                  </label>
                  <input
                    type="number"
                    className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2 text-sm bg-[#e5e7eb] dark:bg-[#131121] text-gray-900 dark:text-gray-100"
                    value={form.catalogDefaults.min}
                    onChange={(e) =>
                      handleCatalogChange(
                        "min",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">
                    Precio máx. por defecto
                  </label>
                  <input
                    type="number"
                    className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-3 py-2 text-sm bg-[#e5e7eb] dark:bg-[#131121] text-gray-900 dark:text-gray-100"
                    value={form.catalogDefaults.max}
                    onChange={(e) =>
                      handleCatalogChange(
                        "max",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-[#2a2338] text-sm text-gray-700 dark:text-gray-200 bg-[#e5e7eb] dark:bg-[#131121] hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            >
              Restaurar valores por defecto
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#c2185b] text-white text-sm font-semibold shadow-sm hover:bg-[#a3154a] transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
