import { useState } from "react";
import { useBusinessSettings } from "../context/BusinessSettingsContext";
import BackButton from "../components/BackButton";

const bloques = [
  {
    titulo: "Ventas",
    texto: "Te asesoramos para elegir lo último en moda y tecnología.",
    dato: "1800 123 4567",
    tipo: "tel",
  },
  {
    titulo: "Quejas",
    texto: "Escuchamos tus comentarios para mejorar en cada experiencia.",
    dato: "1900 223 8899",
    tipo: "tel",
  },
  {
    titulo: "Devoluciones",
    texto: "Gestionamos cambios y devoluciones de forma simple y ágil.",
    dato: "returns@mail.com",
    tipo: "mail",
  },
  {
    titulo: "Marketing",
    texto: "Impulsamos tu marca en nuestro ecosistema de moda y tecnología.",
    dato: "1700 444 5578",
    tipo: "tel",
  },
];

export default function Contact() {
  const { settings } = useBusinessSettings();
  const supportEmail = settings?.supportEmail || "contacto@chicytech.com";
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!form.nombre || !form.email || !form.mensaje) {
      setErr("Completá los campos obligatorios.");
      return;
    }
    const entry = {
      ...form,
      fecha: new Date().toISOString(),
    };
    const prev = JSON.parse(localStorage.getItem("contact_messages") || "[]");
    localStorage.setItem(
      "contact_messages",
      JSON.stringify([...prev, entry])
    );
    const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
      form.asunto || "Consulta"
    )}&body=${encodeURIComponent(
      `${form.mensaje}\n\nNombre: ${form.nombre}\nTeléfono: ${
        form.telefono || "-"
      }\nEmail: ${form.email}`
    )}`;
    window.open(mailto, "_blank");
    setSent(true);
  };

  if (sent) {
    return (
      <main className="max-w-4xl mx-auto p-6 text-center bg-white dark:bg-[#0b0913] dark:text-gray-100 transition-colors space-y-4">
        <div className="text-left">
          <BackButton />
        </div>
        <h1 className="text-3xl font-semibold mb-3">¡Mensaje enviado!</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gracias por contactarte. Te responderemos a la brevedad.
        </p>
        <button
          className="mt-5 px-4 py-2 rounded-xl border border-zinc-300 dark:border-[#2a2338] hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
          onClick={() => {
            setSent(false);
            setForm({
              nombre: "",
              email: "",
              telefono: "",
              asunto: "",
              mensaje: "",
            });
          }}
        >
          Enviar otro mensaje
        </button>
      </main>
    );
  }

  return (
    <main className="bg-[#fff5f9] dark:bg-[#0b0913] dark:text-gray-100 transition-colors">
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <BackButton />
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            ¿Tienes alguna pregunta?
          </p>
          <h1 className="text-3xl font-bold">Estamos aquí para ayudar.</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Chic & Tech es una tienda online de artículos seleccionados, con
            envíos a todo el país.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {bloques.map((b) => (
            <article
              key={b.titulo}
              className="bg-white dark:bg-[#161225] shadow-sm rounded-xl p-4 text-center border border-zinc-200 dark:border-[#2a2338]"
            >
              <h3 className="text-lg font-semibold mb-1">{b.titulo}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {b.texto}
              </p>
              {b.tipo === "mail" ? (
                <a
                  className="font-semibold"
                  style={{ color: "#c2185b" }}
                  href={`mailto:${b.dato}`}
                >
                  {b.dato}
                </a>
              ) : (
                <a
                  className="font-semibold"
                  style={{ color: "#c2185b" }}
                  href={`tel:${b.dato}`}
                >
                  {b.dato}
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="bg-white dark:bg-[#161225] rounded-2xl shadow-sm p-5 border border-zinc-200 dark:border-[#2a2338]">
          <h2 className="text-lg font-semibold mb-2">Depósito Central CABA</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Carlos H. Perette y Calle 10, Buenos Aires, Argentina, 1004 — Lunes
            a Viernes de 8 a 16 hs (retiros y cambios).
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-12 grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
            ¡No seas un extraño!
          </p>
          <h2 className="text-3xl font-bold leading-tight">
            Tú nos lo cuentas.
            <br />
            Nosotros escuchamos.
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            En Chic & Tech ofrecemos una atención clara y profesional para
            acompañarte en lo que necesites. Podés contarnos tu consulta,
            necesidad o comentario con total confianza.
            <br />
            Nuestro equipo está a tu disposición para asistirte en cada etapa de
            tu compra.
          </p>
        </div>

        <div className="bg-white dark:bg-[#161225] rounded-2xl shadow-sm p-5 border border-zinc-200 dark:border-[#2a2338]">
          {err && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">
              {err}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Nombre y Apellido*"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Correo electrónico*"
            />
            <input
              name="telefono"
              value={form.telefono}
              onChange={onChange}
              className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Teléfono (opcional)"
            />
            <input
              name="asunto"
              value={form.asunto}
              onChange={onChange}
              className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Asunto"
            />
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={onChange}
              className="w-full border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] rounded-lg px-3 py-2 min-h-32 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Mensaje *"
            />
            <div className="flex items-center gap-3">
              <button
                className="text-white rounded-lg px-4 py-2 text-sm font-semibold hover:brightness-90"
                style={{ backgroundColor: "#c2185b" }}
              >
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
