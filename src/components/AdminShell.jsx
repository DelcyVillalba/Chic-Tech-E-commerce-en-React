import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/orders", label: "Pedidos", icon: "🧾" },
  { to: "/admin/products", label: "Productos", icon: "📦", end: true },
  { to: "/admin/products/new", label: "Crear producto", icon: "➕", end: true },
  { to: "/admin/users", label: "Usuarios", icon: "👥" },
  { to: "/admin/reports", label: "Reportes", icon: "📈" },
  { to: "/admin/settings", label: "Configuración", icon: "⚙️" },
];

export default function AdminShell({ title, children, onRefresh }) {
  const [open, setOpen] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef(null);

  const handleScroll = (e) => {
    setShowScrollTop(e.target.scrollTop > 300);
  };

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#d1d5db] dark:bg-[#05040a] flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-5rem)] overflow-x-auto lg:overflow-visible text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Overlay para móvil */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-10 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${open ? "w-full sm:w-64" : "w-20"
          } bg-[#e5e7eb] dark:bg-[#0f0b14] border-r border-zinc-200 dark:border-[#1f1a2e] shadow-lg dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 ${open ? "fixed lg:sticky z-20 translate-x-0" : "fixed -translate-x-full lg:sticky lg:translate-x-0"
          } top-16 h-[calc(100vh-4rem)] sm:top-20 sm:h-[calc(100vh-5rem)] lg:top-0 lg:h-screen flex-col flex overflow-y-auto ${!open ? "items-center" : ""}`}
        aria-label="Menú de administración"
      >
        {/* Header del Sidebar */}
        <div className={`p-3 sm:p-4 flex items-center border-b border-zinc-200 dark:border-[#1f1a2e] sticky top-0 bg-[#e5e7eb] dark:bg-[#0f0b14] w-full ${open ? "justify-between" : "justify-center"}`}>
          {open && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-sky-400 to-[#c2185b] grid place-items-center text-base sm:text-lg font-bold text-white flex-shrink-0">
                A
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-300 truncate">Panel interno</p>
              </div>
            </div>
          )}
          <button
            className="text-lg hover:opacity-70 transition-opacity flex-shrink-0 ml-2 hidden lg:block"
            onClick={() => setOpen((o) => !o)}
            title={open ? "Cerrar panel" : "Abrir panel"}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-2 sm:px-3 py-4 space-y-1">
          {open && <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 px-3 py-2 mb-2">Navegación</p>}
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setOpen(false);
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${open ? "justify-start" : "justify-center"} ${isActive
                  ? "bg-gradient-to-r from-sky-100 to-[#fbe8ef] dark:from-[#1c1a32] dark:to-[#241e3b] text-gray-900 dark:text-white font-semibold border-l-4 border-[#c2185b]"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 border-l-4 border-transparent"
                }`
              }
              title={l.label}
            >
              <span className="text-lg flex-shrink-0">{l.icon}</span>
              {open && <span className="truncate">{l.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Móvil y Desktop */}
        <header className="sticky top-0 z-10 bg-[#e5e7eb]/95 dark:bg-[#0f0b14]/95 border-b border-zinc-200 dark:border-[#1f1a2e] shadow-sm flex-shrink-0 backdrop-blur">
          <div className="px-3 sm:px-6 py-0.5 sm:py-2 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {!open && (
                <button
                  className="text-lg lg:hidden hover:opacity-70 transition-opacity"
                  onClick={() => setOpen(true)}
                  title="Abrir menú"
                >
                  ☰
                </button>
              )}
              <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{title || "Panel Admin"}</span>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="text-lg hover:opacity-70 transition-opacity whitespace-nowrap"
                title="Refrescar datos"
              >
                🔄 Refrescar
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main
          ref={mainRef}
          className="flex-1 px-3 sm:px-6 lg:px-8 py-0 overflow-y-auto relative h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)]"
          onScroll={handleScroll}
        >
          <div className="max-w-7xl mx-auto w-full pt-3 sm:pt-4 pb-10 sm:pb-14">
            {children}
          </div>

          {/* Botón Subir Arriba - Flotante */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 bg-black text-white rounded-full p-3 hover:bg-zinc-900 transition-all shadow-lg hover:shadow-xl animate-bounce"
              title="Subir arriba"
              aria-label="Subir arriba"
            >
              <span className="text-xl">⬆️</span>
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
