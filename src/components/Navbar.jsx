import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const base = "px-2 py-1";
const lineBase =
  "relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 " +
  "after:bg-fuchsia-500 after:w-full after:origin-left after:scale-x-0 " +
  "after:transition-transform after:duration-300 hover:after:scale-x-100";
const activeLine = "after:scale-x-100 "; 

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">Chic &amp; Tech</Link>
        <nav className="flex items-center gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${base} ${lineBase} ${isActive ? activeLine : ""}`
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/sobre-nosotros"
            className={({ isActive }) =>
              `${base} ${lineBase} ${isActive ? activeLine : ""}`
            }
          >
            Sobre
          </NavLink>

          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `${base} ${lineBase} ${isActive ? activeLine : ""}`
            }
          >
            FAQ
          </NavLink>

          <NavLink
            to="/contacto"
            className={({ isActive }) =>
              `${base} ${lineBase} ${isActive ? activeLine : ""}`
            }
          >
            Contacto
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              // para el carrito, mantengo borde + la barra fucsia activa
              `border rounded px-3 py-1 ${lineBase} ${isActive ? `border-fuchsia-600 bg-fuchsia-50 ${activeLine}` : ""}`
            }
          >
            Carrito ({totalItems})
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `${base} ${lineBase} ${isActive ? activeLine : ""}`
                }
              >
                Admin
              </NavLink>
              <button onClick={logout} className="border rounded px-3 py-1">
                Salir
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `border rounded px-3 py-1 ${lineBase} ${isActive ? `border-fuchsia-600 bg-fuchsia-50 ${activeLine}` : ""}`
              }
            >
              Ingresar 📲
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
