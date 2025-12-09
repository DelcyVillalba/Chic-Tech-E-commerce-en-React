import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CategoryCatalog from "../components/CategoryCatalog";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import SubscribeBanner from "../components/SubscribeBanner";
import { useProducts } from "../hooks/useProducts";

function usePerPage(config = { mobile: 1, tablet: 2, desktop: 4 }) {
  const calc = () => {
    if (typeof window === "undefined") return config.desktop;
    const w = window.innerWidth;
    if (w < 640) return config.mobile;
    if (w < 1024) return config.tablet;
    return config.desktop;
  };
  const [perPage, setPerPage] = useState(calc);
  useEffect(() => {
    const onResize = () => setPerPage(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return perPage;
}

function Carousel({ items, renderItem, perPageConfig, dotsId }) {
  const perPage = usePerPage(perPageConfig);
  const [page, setPage] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [bounce, setBounce] = useState(null);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => setPage(0), [perPage, items.length]);

  const start = page * perPage;
  const visible = items.slice(start, start + perPage);
  const minSwipeDistance = 35;

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      setTouchStartX(e.touches[0].clientX);
      setTouchEndX(null);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      setTouchEndX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const delta = touchStartX - touchEndX;

    if (delta > minSwipeDistance) {
      if (page < totalPages - 1) {
        setPage((p) => Math.min(totalPages - 1, p + 1));
      } else {
        setBounce("left");
        setTimeout(() => setBounce(null), 160);
      }
    } else if (delta < -minSwipeDistance) {
      if (page > 0) {
        setPage((p) => Math.max(0, p - 1));
      } else {
        setBounce("right");
        setTimeout(() => setBounce(null), 160);
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-transform duration-150 ${
          bounce === "left"
            ? "-translate-x-2"
            : bounce === "right"
            ? "translate-x-2"
            : "translate-x-0"
        }`}
      >
        {visible.map((item, idx) => (
          <div key={idx}>{renderItem(item)}</div>
        ))}
      </div>

      <button
        className="hidden sm:grid place-items-center h-10 w-10 rounded-full border text-gray-600 dark:text-gray-300 dark:border-[#2a2338] disabled:opacity-40 bg-[#f5f5f8]/95 dark:bg-[#05040a]/95 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        disabled={page <= 0}
        aria-label="Anterior"
      >
        ←
      </button>
      <button
        className="hidden sm:grid place-items-center h-10 w-10 rounded-full border text-gray-600 dark:text-gray-300 dark:border-[#2a2338] disabled:opacity-40 bg-[#f5f5f8]/95 dark:bg-[#05040a]/95 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={page >= totalPages - 1}
        aria-label="Siguiente"
      >
        →
      </button>
      <div
        className="flex justify-center gap-2 mt-3"
        role="tablist"
        aria-label={dotsId || "paginacion"}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`h-2.5 w-2.5 rounded-full border ${
              i === page ? "bg-gray-900 border-gray-900" : "bg-white"
            }`}
            aria-label={`Ir a página ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Mascotas() {
  const { data, loading, error } = useProducts({ category: "mascotas" });
  const accesoriosRef = useRef(null);
  const catalogoId = "catalogo-mascotas";

  const scrollTo = (ref) => {
    if (!ref?.current) return;
    window.scrollTo({
      top: Math.max(0, ref.current.offsetTop - 20),
      behavior: "smooth",
    });
  };
  const scrollToCatalogo = () => {
    const el = document.getElementById(catalogoId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { accesoriosDestacados, mejorCalificados } = useMemo(() => {
    if (!data || data.length === 0) {
      return { accesoriosDestacados: [], mejorCalificados: [] };
    }

    const shuffled = [...data].sort(() => Math.random() - 0.5);

    const accesoriosCount = Math.min(4, shuffled.length);
    const accesoriosDestacados = shuffled.slice(0, accesoriosCount);

    let remaining = shuffled.slice(accesoriosCount);

    if (remaining.length === 0) {
      remaining = [...shuffled.slice(1), shuffled[0]].filter(Boolean);
    }

    const mejorCalificados = remaining.slice(0, Math.min(6, remaining.length));

    return { accesoriosDestacados, mejorCalificados };
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="bg-[#e5e7eb] dark:bg-[#05040a] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-8rem)] flex items-center">
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25)), url(/mascotas/slider-23.webp)",
              backgroundSize: "cover",
              backgroundPosition: "55% center",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-2 items-center gap-8 text-white">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">
              Accesorios para mascotas
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Cuida y mima a tu mejor amigo
            </h1>
            <p className="text-white/85 text-sm sm:text-base">
              Camas, juguetes, collares y más para perros y gatos.
            </p>
            <button
              className="mt-2 bg-white text-gray-900 rounded-xl px-6 py-3 font-semibold hover:bg-gray-100"
              onClick={scrollToCatalogo}
            >
              Ver catálogo
            </button>
          </div>
        </div>
      </section>

      {/* Botón Ver todos al inicio */}
      <div className="bg-[#e5e7eb] dark:bg-transparent transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-end">
          <button
            type="button"
            onClick={scrollToCatalogo}
            className="text-sm font-semibold text-gray-800 dark:text-gray-200 underline"
          >
            Ver todos
          </button>
        </div>
      </div>

      {/* Beneficios con assets en gris */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700 dark:text-gray-200">
        {[
          {
            img: "/assets/icon-img/support-1.png",
            titulo: "Envío gratis",
            desc: "Envío gratuito en todos los pedidos.",
          },
          {
            img: "/assets/icon-img/support-2.png",
            titulo: "Soporte 24/7",
            desc: "Estamos para ayudarte en lo que necesites.",
          },
          {
            img: "/assets/icon-img/support-3.png",
            titulo: "Devolución de dinero",
            desc: "Comprá sin preocupaciones.",
          },
          {
            img: "/assets/icon-img/support-4.png",
            titulo: "Descuento de pedido",
            desc: "Promos activas cada semana.",
          },
        ].map((b) => (
          <div key={b.titulo} className="flex items-start gap-3">
            <div className="rounded-full bg-white dark:bg-[#161225] ring-1 ring-black/5 dark:ring-white/10 p-1">
              <img
                src={b.img}
                alt={b.titulo}
                className="w-12 h-12 filter grayscale group-hover:grayscale-0 transition"
              />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                {b.titulo}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Collage simple de accesorios */}
      {accesoriosDestacados.length > 0 && (
        <section
          ref={accesoriosRef}
          className="max-w-6xl mx-auto px-4 pt-10 pb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Accesorios destacados
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {accesoriosDestacados.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#161225] h-56"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute left-3 bottom-3 text-white space-y-1">
                  <p className="text-sm font-bold">{p.category}</p>
                  <p className="font-semibold text-xs">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Productos mejor calificados */}
      {mejorCalificados.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Productos mejor calificados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mejorCalificados.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* Catálogo */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <CategoryCatalog
          category="mascotas"
          title="Catálogo"
          anchorId={catalogoId}
          perPage={8}
          showHeader
        />
      </div>

      <SubscribeBanner />

      {/* Marcas Destacadas - Animado */}
      <section className="py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-2">
              Marcas Destacadas
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Trabajamos con las mejores marcas
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* Primera fila de logos */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-370.png"
                    alt="Marca 8"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              {/* Segunda fila duplicada */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-370.png"
                    alt="Marca 8"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              {/* Tercera fila duplicada */}
              <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-235.png"
                    alt="Marca 1"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-332.png"
                    alt="Marca 2"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-338.png"
                    alt="Marca 3"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-351.png"
                    alt="Marca 4"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-243.png"
                    alt="Marca 5"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-284.png"
                    alt="Marca 6"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-391.png"
                    alt="Marca 7"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center w-24 h-24 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-110">
                  <img
                    src="/assets/icon-img/logoipsum-370.png"
                    alt="Marca 8"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }

            .animate-scroll {
              animation: scroll 90s linear infinite;
              width: fit-content;
            }

            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </section>
    </div>
  );
}
