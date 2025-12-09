import { getSeason } from "../utils/season";

export default function Hero() {
  const season = getSeason();

  const goToCatalog = () => {
    const el = document.getElementById("catalogo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = "/#catalogo";
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center bg-[#e5e7eb] dark:bg-[#05040a] text-zinc-900 dark:text-white transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm tracking-wide opacity-70 mb-2">
            Productos destacados
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            Oferta de {season}
            <br /> Colección 25/26
          </h1>
          <button
            onClick={goToCatalog}
            className="mt-8 inline-block border-2 border-[#c2185b] dark:border-[#e48ab1] text-[#c2185b] dark:text-white hover:bg-[#c2185b] hover:text-white transition rounded-xl px-6 py-3 shadow-sm dark:shadow-[0_12px_40px_rgba(241,25,125,0.35)]"
          >
            Comprar ahora
          </button>
        </div>

        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1558154687-9335aff39c3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387"
            alt="Hero Chic & Tech"
            className="w-full h-[460px] object-cover rounded-2xl shadow-sm dark:shadow-glow-dark"
          />
        </div>
      </div>
    </section>
  );
}
