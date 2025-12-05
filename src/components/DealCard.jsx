import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { formatARS } from "../utils/format";

export default function DealCard({ product, onQuickView }) {
  const { toggle, isSaved } = useWishlist();
  const {
    id,
    title,
    image,
    price,
    discount = 0,
    isNew = false,
    rating,
  } = product;
  const hasDiscount = discount > 0;
  const final = hasDiscount ? price * (1 - discount / 100) : price;
  const saved = isSaved(id);

  return (
    <article
      className="
            group relative bg-white dark:bg-[#131121] rounded-lg
            border border-zinc-200/70 dark:border-[#2a2338] hover:border-zinc-300 dark:hover:border-[#3c3352]
            transition-all overflow-hidden flex flex-col h-[440px] sm:h-[480px] shadow-sm hover:shadow-md dark:shadow-glow-dark
        "
    >
      {(hasDiscount || isNew) && (
        <div className="absolute top-2 right-2 space-y-1 z-10 text-[10px] sm:text-[11px] font-semibold">
          {hasDiscount && (
            <span className="inline-block bg-[#c2185b] text-white px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {isNew && (
            <span className="inline-block bg-zinc-800/90 text-white px-2 py-0.5 rounded">
              Nuevo
            </span>
          )}
        </div>
      )}

      <div className="relative bg-gray-200 dark:bg-[#1c1828] overflow-hidden flex-1 h-56 sm:h-64">
        <Link to={`/product/${id}`} className="block h-full">
          <img
            src={image}
            alt={title}
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
          <div className="w-full h-10 bg-[#c2185b] grid grid-cols-[48px_1fr_48px]">
            <button
              title={
                saved
                  ? "Quitar de la lista de deseos"
                  : "Añadir a la lista de deseos"
              }
              onClick={() => toggle(product)}
              className={`relative bg-transparent pointer-events-auto transition-colors ${
                saved
                  ? "text-rose-400"
                  : "text-white/95 hover:bg-black hover:text-white focus-visible:text-white"
              }`}
            >
              <span className="absolute inset-0 grid place-items-center">
                {saved ? "♥️" : "🤍"}
              </span>
            </button>

            <Link
              to={`/product/${id}`}
              className="
                                    bg-transparent text-white font-semibold tracking-wide uppercase text-xs
                                    grid place-items-center pointer-events-auto transition-colors
                                    hover:bg-black hover:text-white focus-visible:text-white
                                "
            >
              Comprar Ahora
            </Link>

            <button
              title="Vista rápida"
              onClick={() => onQuickView?.(product)}
              className="relative bg-transparent text-white/95 hover:bg-black hover:text-white focus-visible:text-white pointer-events-auto transition-colors"
            >
              <span className="absolute inset-0 grid place-items-center">
                👁️
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 pt-3 pb-4 text-center text-zinc-900 dark:text-zinc-100 min-h-[80px] sm:min-h-[90px] flex flex-col justify-between">
        <Link
          to={`/product/${id}`}
          className="block text-xs sm:text-sm hover:underline line-clamp-2"
          title={title}
        >
          {title}
        </Link>
        <div className="flex items-center justify-center gap-0.5 my-1 text-amber-400 text-xs sm:text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < Math.round(rating?.rate || 4) ? "★" : "☆"}</span>
          ))}
        </div>
        <div className="text-xs sm:text-sm">
          <span className="font-semibold">{formatARS.format(final)}</span>
          {hasDiscount && (
            <span className="opacity-60 line-through ml-2 text-[10px] sm:text-xs">
              {formatARS.format(price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
