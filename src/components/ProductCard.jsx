import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { formatARS } from "../utils/format";
import QuickViewModal from "./QuickViewModal";

export default function ProductCard({ p }) {
  const { toggle, isSaved } = useWishlist();
  const nav = useNavigate();
  const [showQuick, setShowQuick] = useState(false);

  const goToDetail = () => {
    sessionStorage.setItem("catalog-scroll", String(window.scrollY || 0));
    nav(`/product/${p.id}`);
  };

  const saved = isSaved(p.id);
  const hasDiscount = Number(p.discount) > 0;
  const final = hasDiscount ? p.price * (1 - p.discount / 100) : p.price;

  return (
    <article className="group relative bg-white dark:bg-[#131121] rounded-lg border border-zinc-200/70 dark:border-[#2a2338] hover:border-zinc-300 dark:hover:border-[#3c3352] transition-colors overflow-hidden flex flex-col h-[380px] sm:h-[440px] shadow-sm hover:shadow-md dark:shadow-none">
      {(hasDiscount || p.isNew) && (
        <div className="absolute top-2 right-2 space-y-1 z-10 text-[10px] sm:text-[11px] font-semibold">
          {hasDiscount && (
            <span className="inline-block bg-[#c2185b] text-white px-2 py-0.5 rounded">
              -{p.discount}%
            </span>
          )}
          {p.isNew && (
            <span className="inline-block bg-zinc-800/90 text-white px-2 py-0.5 rounded">
              Nuevo
            </span>
          )}
        </div>
      )}

      <div className="relative bg-gray-200 dark:bg-[#1c1828] overflow-hidden flex-1 h-32 sm:h-56">
        <Link
          to={`/product/${p.id}`}
          className="block h-full"
          onClick={() =>
            sessionStorage.setItem("catalog-scroll", String(window.scrollY || 0))
          }
        >
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </Link>

        <div
          className="
            absolute inset-x-0 bottom-0
            pointer-events-none
            opacity-0 translate-y-3
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300
          "
        >
          <div className="w-full bg-[#c2185b] grid grid-cols-[40px_1fr_40px] sm:grid-cols-[48px_1fr_48px] text-white text-xs sm:text-sm font-semibold h-10">
            <button
              title="Añadir a la lista de deseos"
              onClick={() => toggle(p)}
              className={`relative bg-transparent pointer-events-auto transition-colors ${
                saved
                  ? "text-rose-300"
                  : "text-white/95 hover:bg-black hover:text-white focus-visible:text-white"
              }`}
            >
              <span className="absolute inset-0 grid place-items-center text-lg">
                {saved ? "♥️" : "🤍"}
              </span>
            </button>

            <button
              onClick={goToDetail}
              className="
                bg-transparent pointer-events-auto text-white
                grid place-items-center uppercase tracking-wide text-xs sm:text-sm
                hover:bg-black hover:text-white focus-visible:text-white transition-colors
              "
            >
              Comprar ahora
            </button>

            <button
              title="Vista rápida"
              onClick={() => setShowQuick(true)}
              className="relative bg-transparent pointer-events-auto text-white/95 hover:bg-black hover:text-white focus-visible:text-white transition-colors"
            >
              <span className="absolute inset-0 grid place-items-center text-lg">
                👁️
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 pt-3 pb-4 text-center text-zinc-900 dark:text-zinc-100 min-h-[80px] sm:min-h-[90px] flex flex-col justify-between">
        <Link
          to={`/product/${p.id}`}
          className="block text-xs sm:text-sm hover:underline line-clamp-2"
          title={p.title}
        >
          {p.title}
        </Link>
        <div className="text-xs sm:text-sm">
          <span className="font-semibold">{formatARS.format(final)}</span>
          {hasDiscount && (
            <span className="opacity-60 line-through ml-2 text-[10px] sm:text-xs">
              {formatARS.format(p.price)}
            </span>
          )}
        </div>
      </div>

      {showQuick && (
        <QuickViewModal product={p} onClose={() => setShowQuick(false)} />
      )}
    </article>
  );
}
