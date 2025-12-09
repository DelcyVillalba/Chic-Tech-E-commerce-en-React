import BackButton from "../components/BackButton";

export default function About() {
  return (
    <main className="bg-[#e5e7eb] dark:bg-[#05040a] dark:text-gray-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
        <div className="bg-white dark:bg-[#0b0913] border border-zinc-200 dark:border-[#2a2338] rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
          <BackButton />
          <h1 className="text-2xl font-semibold">Sobre nosotros</h1>
          <p className="mb-2 text-sm sm:text-base opacity-80">
            En <strong>Chic &amp; Tech</strong> combinamos moda y tecnología en un
            solo lugar. Nuestro objetivo es ofrecer un catálogo seleccionado con prendas,
            accesorios, joyería y electrónica de calidad, con una experiencia de
            compra simple y ágil.
          </p>
          <section className="grid md:grid-cols-3 gap-4 pt-2">
            <div className="border border-zinc-200 dark:border-[#2a2338] rounded-2xl p-4 bg-white dark:bg-[#161225]">
              <h2 className="font-semibold mb-1">Calidad</h2>
              <p className="text-sm opacity-80">
                Seleccionamos productos con excelente relación precio–calidad.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-[#2a2338] rounded-2xl p-4 bg-white dark:bg-[#161225]">
              <h2 className="font-semibold mb-1">Experiencia</h2>
              <p className="text-sm opacity-80">
                Navegación fluida, carrito persistente y pagos listos para darte la mejor experiencia de compra.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-[#2a2338] rounded-2xl p-4 bg-white dark:bg-[#161225]">
              <h2 className="font-semibold mb-1">Confianza</h2>
              <p className="text-sm opacity-80">
                Transparencia y soporte. Tu compra, siempre acompañada de un equipo listo para ayudarte.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
