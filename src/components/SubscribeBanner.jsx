export default function SubscribeBanner({ className = "" }) {
  return (
    <section
      className={`max-w-3xl mx-auto px-4 pb-20 text-center space-y-4 ${className}`}
    >
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Suscribir
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        Suscríbete a nuestro boletín para recibir noticias y actualizaciones.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <input
          type="email"
          placeholder="Su dirección de correo electrónico"
          className="border border-zinc-300 dark:border-[#2a2338] rounded-xl px-4 py-2 flex-1 max-w-xs bg-white dark:bg-[#161225] text-gray-900 dark:text-white"
        />
        <button className="bg-[#c2185b] hover:bg-[#a3154a] text-white rounded-xl px-6 py-2 font-semibold transition-colors">
          SUSCRIBIR
        </button>
      </div>
    </section>
  );
}
