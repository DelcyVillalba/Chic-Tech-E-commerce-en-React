import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    if (!form.nombre || !form.email || !form.mensaje) {
      setErr("Completá todos los campos.");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <main className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-semibold mb-2">¡Mensaje enviado!</h1>
        <p className="opacity-80">
          Gracias por contactarte. Te responderemos a la brevedad.
        </p>
        <button
          className="mt-4 border rounded-xl px-4 py-2"
          onClick={() => {
            setSent(false);
            setForm({ nombre: "", email: "", mensaje: "" });
          }}
        >
          Enviar otro mensaje
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Contacto</h1>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={onChange}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
        />
        <textarea
          className="w-full border rounded px-3 py-2 min-h-32"
          placeholder="Mensaje"
          name="mensaje"
          value={form.mensaje}
          onChange={onChange}
        />
        <div className="flex gap-2">
          <button className="bg-black text-white rounded-xl px-4 py-2">
            Enviar
          </button>
          <a
            className="border rounded-xl px-4 py-2"
            href={`mailto:contacto@chicytech.com?subject=Consulta&body=${encodeURIComponent(
              form.mensaje
            )}`}
          >
            Enviar por email
          </a>
        </div>
      </form>
    </main>
  );
}
