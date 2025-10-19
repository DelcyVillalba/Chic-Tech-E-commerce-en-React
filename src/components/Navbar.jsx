import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          Chic &amp; Tech
        </Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className="hover:underline">
            Inicio
          </NavLink>
          <NavLink to="/cart" className="hover:underline">
            Carrito ({totalItems})
          </NavLink>
          {user ? (
            <>
              <NavLink to="/admin/products" className="hover:underline">
                Admin
              </NavLink>
              <button onClick={logout} className="border rounded px-3 py-1">
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login" className="border rounded px-3 py-1">
              Ingresar 📲
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}