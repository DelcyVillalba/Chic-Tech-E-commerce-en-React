import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { listOrders } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import AdminLoginModal from "./AdminLoginModal";
import ThemeToggle from "./ThemeToggle";
const adminIcon = "/assets/icon-img/Admin.png";

const base = "px-2 py-1";
const lineBase =
  "relative after:content-[''] after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 " +
  "after:bg-gradient-to-r after:from-[#c2185b] after:to-[#8c1c3f] after:rounded-full " +
  "after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100";
const activeLine = "after:scale-x-100 text-black dark:text-white";

const menuItems = [
  {
    label: "Moda",
    key: "moda",
    items: [
      { to: "/mujer", label: "Mujer" },
      { to: "/hombre", label: "Hombre" },
      { to: "/ninos", label: "Niños" },
      { to: "/accesorios", label: "Accesorios" },
      { to: "/cosmeticos", label: "Cosméticos" },
    ],
  },
  {
    label: "Hogar",
    key: "hogar",
    items: [
      { to: "/hogar", label: "Hogar" },
      { to: "/jardin", label: "Jardín" },
      { to: "/mascotas", label: "Mascotas" },
      { to: "/tecnologia", label: "Tecnología" },
      { to: "/libros", label: "Libros" },
    ],
  },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const isAdminRoute = loc.pathname.startsWith("/admin");
  const [adminOpen, setAdminOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(menuItems[0].key);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lastSeen, setLastSeen] = useState(0);
  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "");

  const toggleFilters = () => {
    setMobileMenuOpen(false);
    const next = !(loc.state?.showFilters === true);
    nav(loc.pathname + loc.search, {
      replace: true,
      state: { ...loc.state, showFilters: next, restoreScroll: true },
    });
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    let timer;
    const fetchOrders = async () => {
      if (user?.role !== "admin") return;
      if (isAdminRoute && loc.pathname.startsWith("/admin/orders")) {
        setPendingOrders(0);
        setLastSeen((prev) => prev);
        return;
      }
      try {
        const data = await listOrders();
        const pending = data.filter((o) => o.status === "pendiente").length;
        const nuevos = Math.max(0, pending - lastSeen);
        setPendingOrders(nuevos);
      } catch {
        setPendingOrders(0);
      } finally {
        timer = setTimeout(fetchOrders, 15000);
      }
    };
    if (user?.role === "admin") {
      fetchOrders();
    }
    return () => timer && clearTimeout(timer);
  }, [user, isAdminRoute, loc.pathname, lastSeen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f0b14]/90 backdrop-blur-md border-b border-zinc-200/50 dark:border-[#1f1a2e] shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-lg sm:text-2xl flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            Chic &amp; Tech
          </Link>

          {isAdminRoute ? (
            /* Admin Header */
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle className="hidden sm:flex h-10 items-center" />
              {displayName && (
                <div className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-full border border-zinc-200 dark:border-[#2b243a] bg-white/70 dark:bg-[#1a1524] text-sm font-semibold text-zinc-700 dark:text-zinc-100">
                  <span>👋</span>
                  <span>{displayName}</span>
                </div>
              )}
              <button
                className="border border-zinc-300 dark:border-[#2b243a] rounded-full h-10 w-10 grid place-items-center hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                title="Notificaciones"
                onClick={() => {
                  if (user?.role === "admin") {
                    setLastSeen((prev) => prev + pendingOrders);
                    setPendingOrders(0);
                    nav("/admin/orders");
                  }
                }}
              >
                <span className="relative text-lg">
                  🔔
                  {pendingOrders > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 min-w-[1rem] px-1 text-[10px] font-semibold flex items-center justify-center leading-none">
                      {pendingOrders}
                    </span>
                  )}
                </span>
              </button>
              {user ? (
                <button
                  onClick={logout}
                  className="border border-zinc-300 dark:border-[#2b243a] rounded-lg h-10 px-4 inline-flex items-center text-sm hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                >
                  Salir
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `border rounded-lg h-10 px-4 inline-flex items-center text-sm transition-all ${lineBase} ${
                      isActive
                        ? `border-[#c2185b] bg-[#fbe8ef] ${activeLine}`
                        : "border-zinc-300 hover:bg-zinc-50"
                    }`
                  }
                >
                  Ingresar 📲
                </NavLink>
              )}
            </div>
          ) : (
            /* User Header */
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                {menuItems.map((menu) => (
                  <div
                    key={menu.key}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(menu.key)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button
                      className={`${base} ${lineBase} flex items-center gap-1 text-sm`}
                    >
                      {menu.label} ▾
                    </button>
                    {openMenu === menu.key && (
                      <div className="absolute left-0 top-full w-48 border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#161225] shadow-lg dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)] z-60 rounded-lg overflow-hidden">
                        {menu.items.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className="block px-4 py-2.5 text-sm hover:bg-[#fbe8ef] hover:text-[#a3154a] dark:hover:bg-white/5 transition-colors border-l-4 border-transparent hover:border-[#c2185b]"
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Search */}
                <button
                  onClick={toggleFilters}
                  className={`${base} ${lineBase} text-lg`}
                  title="Mostrar barra de filtros"
                >
                  🔍
                </button>

                {/* Wishlist */}
                <NavLink
                  to="/favoritos"
                  className={({ isActive }) =>
                    `${base} ${lineBase} text-lg ${isActive ? activeLine : ""}`
                  }
                  title="Lista de deseos"
                >
                  <span className="relative inline-flex items-center">
                    ❤️
                    {wishlist.length > 0 && (
                      <span className="absolute -top-2 -right-3 bg-[#c2185b] text-white rounded-full h-4 min-w-[1rem] px-1 text-[10px] leading-none font-semibold flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </span>
                </NavLink>

                {/* Cart */}
                {user?.role !== "admin" && (
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `border rounded-lg h-10 px-4 inline-flex items-center text-sm ${lineBase} ${
                        isActive
                          ? `border-[#c2185b] bg-[#fbe8ef] dark:bg-[#c2185b]/10 ${activeLine}`
                          : "border-zinc-300 dark:border-[#2b243a] hover:bg-zinc-50 dark:hover:bg-white/10"
                      }`
                    }
                  >
                    Carrito ({totalItems})
                  </NavLink>
                )}

                {/* Ir al panel admin cuando el admin está logueado */}
                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `border rounded-lg h-10 px-4 inline-flex items-center text-sm ${lineBase} ${
                        isActive
                          ? `border-[#c2185b] bg-[#fbe8ef] dark:bg-[#c2185b]/10 ${activeLine}`
                          : "border-zinc-300 dark:border-[#2b243a] hover:bg-zinc-50 dark:hover:bg-white/10"
                      }`
                    }
                  >
                    Panel Admin
                  </NavLink>
                )}

                {/* Login */}
                {!user && (
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `border rounded-lg h-10 px-4 inline-flex items-center text-sm ${lineBase} ${
                        isActive
                          ? `border-[#c2185b] bg-[#fbe8ef] dark:bg-[#c2185b]/10 ${activeLine}`
                          : "border-zinc-300 dark:border-[#2b243a] hover:bg-zinc-50 dark:hover:bg-white/10"
                      }`
                    }
                  >
                    Ingresar 📲
                  </NavLink>
                )}

                {/* Admin Button */}
                {!user && (
                  <button
                    onClick={() => setAdminOpen(true)}
                    className="relative border rounded-lg h-10 px-4 flex items-center gap-2 text-sm transition-all dark:text-white"
                    style={{
                      borderColor: "#c2185b",
                      backgroundColor: "#c2185b15",
                    }}
                    title="Acceso administrador"
                  >
                    <img
                      src={adminIcon}
                      alt="Admin"
                      className="h-5 w-5 object-contain"
                    />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}

                {/* Logout */}
                <ThemeToggle className="hidden lg:flex ml-2 scale-90 origin-left h-10 items-center" />
                {displayName && (
                  <div className="hidden lg:flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 dark:border-[#2b243a] bg-white/70 dark:bg-[#1a1524] text-sm font-semibold text-zinc-700 dark:text-zinc-100">
                    <span>👋</span>
                    <span>{displayName}</span>
                  </div>
                )}
                {user && (
                  <button
                    onClick={logout}
                    className="border border-zinc-300 dark:border-[#2b243a] rounded-lg h-10 px-4 inline-flex items-center text-sm hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                  >
                    Salir
                  </button>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg transition-colors bg-zinc-100 dark:bg-[#1a1524] hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-white"
                  title="Menú"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {!isAdminRoute && mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-[#1f1a2e] bg-white/95 dark:bg-[#0f0b14]/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-3 max-h-[75vh] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0">
              {/* Mobile Filters toggle */}
              <button
                onClick={toggleFilters}
                className="w-full flex items-center justify-between bg-zinc-100 dark:bg-[#161225] rounded-lg px-3 py-2 text-sm"
              >
                <span>Buscar / Filtros</span>
                <span>🔍</span>
              </button>

              <div className="flex items-center gap-3 justify-between">
                <ThemeToggle className="h-10 flex items-center" />
                {displayName && (
                  <div className="flex-1 h-10 px-3 text-sm rounded-lg bg-zinc-100 dark:bg-[#161225] flex items-center gap-2 text-zinc-700 dark:text-zinc-100">
                    <span>👋</span>
                    <span className="font-semibold">{displayName}</span>
                  </div>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="ml-auto h-10 px-3 text-sm rounded-lg bg-zinc-100 dark:bg-[#161225] flex items-center hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                  >
                    🚪 Salir
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="ml-auto h-10 px-3 text-sm rounded-lg bg-zinc-100 dark:bg-[#161225] flex items-center hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                  >
                    📲 Ingresar
                  </NavLink>
                )}
              </div>

              {/* Mobile Menu Items */}
              {menuItems.map((menu) => (
                <div
                  key={menu.key}
                  className="border border-zinc-200 dark:border-[#2a2338] rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-100"
                    onClick={() =>
                      setMobileSection((prev) =>
                        prev === menu.key ? null : menu.key
                      )
                    }
                  >
                    {menu.label}
                    <span
                      className={`transition-transform ${
                        mobileSection === menu.key ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  {mobileSection === menu.key && (
                    <div className="bg-white dark:bg-[#161225] border-t border-zinc-200 dark:border-[#2a2338] max-h-64 overflow-auto">
                      {menu.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-5 py-2.5 text-sm hover:bg-[#fbe8ef] hover:text-[#a3154a] dark:hover:bg-white/5 transition-colors"
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="border-t border-zinc-200 pt-3 space-y-2">
                {/* Wishlist */}
                <NavLink
                  to="/favoritos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-[#fbe8ef] hover:text-[#a3154a] dark:hover:bg-white/5 transition-colors rounded-lg"
                >
                  ❤️ Favoritos ({wishlist.length})
                </NavLink>

                {/* Cart */}
                {user?.role !== "admin" && (
                  <NavLink
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-[#fbe8ef] hover:text-[#a3154a] dark:hover:bg-white/5 transition-colors rounded-lg"
                  >
                    🛒 Carrito ({totalItems})
                  </NavLink>
                )}

                {/* Admin Button Mobile */}
                {!user && (
                  <button
                    onClick={() => {
                      setAdminOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left h-10 px-4 text-sm rounded-lg transition-colors flex items-center gap-2 dark:text-white"
                    style={{
                      backgroundColor: "#c2185b15",
                      color: "#c2185b",
                      borderLeft: "3px solid #c2185b",
                    }}
                    title="Acceso administrador"
                  >
                    <img
                      src={adminIcon}
                      alt="Admin"
                      className="h-4 w-4 object-contain"
                    />
                    <span>Panel Admin</span>
                  </button>
                )}

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-[#fbe8ef] hover:text-[#a3154a] dark:hover:bg-white/5 transition-colors rounded-lg"
                  >
                    🛠️ Panel Admin
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminLoginModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </header>
  );
}
