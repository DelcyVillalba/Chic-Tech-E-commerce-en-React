import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t p-4 text-center text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span>© Chic &amp; Tech</span>
          <nav className="flex gap-4">
            <Link to="/sobre-nosotros" className="hover:underline">
              Sobre
            </Link>
            <Link to="/faq" className="hover:underline">
              FAQ
            </Link>
            <Link to="/contacto" className="hover:underline">
              Contacto
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
