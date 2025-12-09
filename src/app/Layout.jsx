import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";
import GlobalFilterBar from "../components/GlobalFilterBar";
import { useBusinessSettings } from "../context/BusinessSettingsContext";

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { settings } = useBusinessSettings();
  const footerText = settings?.footerText || "© Chic & Tech";

  return (
    <div className="min-h-dvh flex flex-col bg-[#e5e7eb] text-zinc-900 dark:bg-[#05040a] dark:text-zinc-100 transition-colors duration-500">
      <ScrollManager />
      <Navbar />
      {!isAdmin && <GlobalFilterBar />}
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-[#c5cad8] dark:border-[#1f1a2e] p-4 text-center text-sm bg-[#dde1e8] dark:bg-[#05040a]/90 shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span>{footerText}</span>
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
      <WhatsAppButton />
    </div>
  );
}
