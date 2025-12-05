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
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Preguntas frecuentes</h1>
      <div className="space-y-3">
        {faqs.map((item, idx) => (
          <details key={idx} className="border rounded-2xl p-4">
            <summary className="cursor-pointer font-medium">{item.q}</summary>
            <p className="mt-2 opacity-80">{item.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}