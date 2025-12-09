import BackButton from "../components/BackButton";

export default function FAQ() {
  const faqs = [
    {
      q: "¿Qué tipos de productos venden?",
      a: "Moda (hombre y mujer), joyería y electrónica. Tenemos el mejor catálogo del mercado.",
    },
    {
      q: "¿Cómo funciona el carrito?",
      a: "Podés agregar productos desde la lista o detalle. El carrito se guarda hasta el momento de la compra.",
    },
    {
      q: "¿Los precios incluyen impuestos?",
      a: "El carrito permite incluir o excluir impuestos (21 %) para ver el total estimado.",
    },
    {
      q: "¿Necesito una cuenta para comprar?",
      a: "Si, es necesario crear una cuenta para realizar una compra.",
    },
    {
      q: "¿Puedo editar o eliminar productos?",
      a: "Sí, podés editar o eliminar productos en el carrito antes de finalizar la compra.",
    },
  ];

  return (
    <main className="bg-[#e5e7eb] dark:bg-[#05040a] dark:text-gray-100 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        <div className="bg-white dark:bg-[#0b0913] border border-zinc-200 dark:border-[#2a2338] rounded-2xl shadow-sm p-5 sm:p-6 space-y-4">
          <BackButton />
          <h1 className="text-2xl font-semibold">Preguntas frecuentes</h1>
          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <details
                key={idx}
                className="border border-zinc-200 dark:border-[#2a2338] rounded-2xl p-4 bg-white dark:bg-[#161225]"
              >
                <summary className="cursor-pointer font-medium">
                  {item.q}
                </summary>
                <p className="mt-2 opacity-80 text-sm">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
