export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(totalPages, page + 1));
  const nums = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) nums.push(i);
  }
  const display = [];
  let last = 0;
  nums.forEach((n) => {
    if (n - last > 1) display.push("…");
    display.push(n);
    last = n;
  });
  return (
    <div className="flex items-center gap-2 justify-center my-6">
      <button
        onClick={prev}
        className="border rounded px-3 py-1"
        disabled={page === 1}
      >
        Anterior
      </button>
      {display.map((n, idx) =>
        n === "…" ? (
          <span key={idx} className="px-2">
            …
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPage(n)}
            className={`border rounded px-3 py-1 ${
              n === page ? "bg-black text-white" : ""
            }`}
          >
            {n}
          </button>
        )
      )}
      <button
        onClick={next}
        className="border rounded px-3 py-1"
        disabled={page === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
}
