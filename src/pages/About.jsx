export default function About() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Sobre nosotros</h1>
      <p className="mb-4 opacity-80">
        En <strong>Chic &amp; Tech</strong> combinamos moda y tecnología en un
        solo lugar. Nuestro objetivo es ofrecer un catálogo seleccionado con prendas,
        accesorios, joyería y electrónica de calidad, con una experiencia de
        compra simple y ágil.
      </p>
      <section className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="border rounded-2xl p-4">
          <h2 className="font-semibold mb-1">Calidad</h2>
          <p className="text-sm opacity-80">
            Seleccionamos productos con excelente relación precio–calidad.
          </p>
        </div>
        <div className="border rounded-2xl p-4">
          <h2 className="font-semibold mb-1">Experiencia</h2>
          <p className="text-sm opacity-80">
            Navegación fluida, carrito persistente y pagos listos para darte la mejor experiencia de compra.
          </p>
        </div>
        <div className="border rounded-2xl p-4">
          <h2 className="font-semibold mb-1">Confianza</h2>
          <p className="text-sm opacity-80">
            Transparencia y soporte. Tu compra, siempre acompañada de un equipo listo para ayudarte.
          </p>
        </div>
      </section>
    </main>
  );
}
