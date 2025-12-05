export default function SupportStrip() {
  const items = [
    {
      img: "/assets/icon-img/support-1.png",
      title: "Envío gratis",
      desc: "Envío gratuito en todos los pedidos.",
    },
    {
      img: "/assets/icon-img/support-2.png",
      title: "Soporte 24/7",
      desc: "Estamos para ayudarte en lo que necesites.",
    },
    {
      img: "/assets/icon-img/support-3.png",
      title: "Devolución de dinero",
      desc: "Comprá sin preocupaciones.",
    },
    {
      img: "/assets/icon-img/support-4.png",
      title: "Descuento de pedido",
      desc: "Promos activas cada semana.",
    },
  ];

  return (
    <section className="bg-white dark:bg-[#0f0c19] transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className="group flex items-start gap-3 perspective-900">
            <div className="lift3d rounded-full bg-white dark:bg-[#161225] ring-1 ring-black/5 dark:ring-white/10 p-0.5">
              <img src={it.img} alt={it.title} className="w-12 h-12 buzz" />
            </div>{" "}
            <div>
              {" "}
              <h3 className="font-semibold text-[#c2185b] leading-snug">
                {it.title}
              </h3>
              <p className="text-sm opacity-70 dark:text-zinc-200">{it.desc}</p>{" "}
            </div>{" "}
          </div>
        ))}
      </div>
    </section>
  );
}
