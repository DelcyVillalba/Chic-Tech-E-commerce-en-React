export default function Pagination({
  page,
  totalPages,
  onPage,
  minButtons = 1,
}) {
  const safeTotal = Math.max(1, totalPages || 1);

  const prev = () => {
    if (page > 1) onPage(Math.max(1, page - 1));
  };
  const next = () => {
    if (page < safeTotal) onPage(Math.min(safeTotal, page + 1));
  };

  const windowSize = Math.max(1, minButtons);
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, page - half);
  let end = start + windowSize - 1;
  if (end > safeTotal) {
    end = safeTotal;
    start = Math.max(1, end - windowSize + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  // Si todavía no llenamos la ventana, agregamos placeholders
  while (pages.length < windowSize) {
    pages.push(pages.length ? pages[pages.length - 1] + 1 : 1);
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2 justify-center my-6 sm:my-8 flex-wrap">
      <button
        onClick={prev}
        className="border border-zinc-300 dark:border-[#2a2338] rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page <= 1}
        title="Página anterior"
      >
        ← Anterior
      </button>

      <div className="flex items-center gap-1">
        {pages.map((n) => (
          <button
            key={n}
            onClick={() => {
              if (n <= safeTotal) onPage(n);
            }}
            disabled={n > safeTotal}
            className={`rounded-lg px-2.5 sm:px-3 py-2 text-sm sm:text-base font-medium transition-all ${
              n === page
                ? "bg-[#c2185b] border-[#c2185b] text-white shadow-sm dark:bg-[#c2185b]"
                : "border border-zinc-300 dark:border-[#2a2338] hover:border-zinc-400 dark:hover:border-[#3c3352] hover:bg-zinc-50 dark:hover:bg-white/10"
            } ${n > safeTotal ? "opacity-40 pointer-events-none" : ""}`}
            title={
              n > safeTotal ? "Página no disponible" : `Ir a página ${n}`
            }
          >
            {n}
          </button>
        ))}
      </div>

      <button
        onClick={next}
        className="border border-zinc-300 dark:border-[#2a2338] rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page >= safeTotal}
        title="Página siguiente"
      >
        Siguiente →
      </button>
    </div>
  );
}
