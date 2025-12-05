import { Outlet, Link, useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";
import GlobalFilterBar from "../components/GlobalFilterBar";
import { useBusinessSettings } from "../context/BusinessSettingsContext";

function ScrollManager() {
  const location = useLocation();
  const action = useNavigationType();
  const positionsRef = useRef(
    (() => {
      try {
        return JSON.parse(sessionStorage.getItem("scroll-positions") || "{}");
      } catch {
        return {};
      }
    })()
  );

  useEffect(() => {
    const key = `${location.pathname}${location.search}`;
    const stored = positionsRef.current[key];
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const restore = () => {
      if (typeof stored === "number") {
        window.scrollTo(0, stored);
      } else {
        window.scrollTo(0, 0);
      }
    };

    const shouldRestore = action === "POP" || location.state?.restoreScroll;

    if (shouldRestore) {
      // Restaurar después de renderizar; reintentar tras un pequeño delay
      requestAnimationFrame(restore);
      const retry = setTimeout(restore, 120);
      return () => clearTimeout(retry);
    }

    window.scrollTo(0, 0);

    const onScroll = () => {
      positionsRef.current[key] = window.scrollY;
      sessionStorage.setItem(
        "scroll-positions",
        JSON.stringify(positionsRef.current)
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const onBeforeUnload = () => {
      positionsRef.current[key] = window.scrollY;
      sessionStorage.setItem(
        "scroll-positions",
        JSON.stringify(positionsRef.current)
      );
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [location, action]);

  return null;
}

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { settings } = useBusinessSettings();
  const footerText = settings?.footerText || "© Chic & Tech";

  return (
    <div className="min-h-dvh flex flex-col dark:bg-[#0b0913] dark:text-zinc-100 transition-colors duration-500">
      <ScrollManager />
      <Navbar />
      {!isAdmin && <GlobalFilterBar />}
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t border-zinc-200/60 dark:border-[#1f1a2e] p-4 text-center text-sm bg-white dark:bg-[#0d0a18]/80 backdrop-blur">
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
