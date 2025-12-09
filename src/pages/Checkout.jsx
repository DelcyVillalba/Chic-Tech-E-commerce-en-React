import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { simulatePayment } from "../api/payments";
import { formatARS } from "../utils/format";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

const envioOpciones = [
  { id: "tienda", label: "Retiro en tienda", desc: "¡Gratis!" },
  { id: "domicilio", label: "Envío a domicilio", desc: "Gratis desde $30.000" },
];

export default function Checkout() {
  const { cart, dispatch } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [step, setStep] = useState(1);
  const [medioPago, setMedioPago] = useState("tarjeta");
  const [acepta, setAcepta] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [prevDireccion, setPrevDireccion] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({
    envio: "domicilio",
    email: user?.email || "",
    nombre: "",
    apellido: "",
    documento: "",
    celular: "",
    direccion: "",
    entreCalles: "",
    piso: "",
    info: "",
  });
  const aplicaIVA = loc.state?.taxEnabled === true;
  const TIENDA_DIR =
    "Carlos H. Perette y Calle 10, Buenos Aires, Argentina, 1004";
  const TIENDA_TEL = "0800-333-3382";

  useEffect(() => {
    if (!user) nav("/login", { state: { from: "/checkout" } });
  }, [user, nav]);

  useEffect(() => {
    if (cart.length === 0) nav("/cart");
  }, [cart, nav]);

  const subtotal = useMemo(
    () => cart.reduce((s, p) => s + p.qty * p.price, 0),
    [cart]
  );
  const iva = aplicaIVA ? subtotal * 0.21 : 0;
  const total = subtotal + iva;
  const cupon = useMemo(
    () => `CT-${Date.now().toString().slice(-6)}`,
    []
  );
  const vencimiento = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("es-AR");
  }, []);

  const validar = () => {
    const obligatorios = ["email", "nombre", "apellido", "documento", "celular"];
    for (const k of obligatorios) {
      if (!form[k]) return `Completa el campo ${k}`;
    }
    if (form.envio === "domicilio" && !form.direccion)
      return "Completa la dirección";
    return "";
  };

  const siguientePaso = (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) {
      setErr(msg);
      return;
    }
    setErr("");
    setStep(2);
  };

  const confirmar = async (e) => {
    e.preventDefault();
    if (!acepta) {
      setErr("Debes aceptar los términos para continuar.");
      return;
    }
    setErr("");
    setEnviando(true);
    try {
      const { order } = await simulatePayment({
        user: { email: form.email, name: `${form.nombre} ${form.apellido}` },
        envio: form.envio,
        direccion: form.envio === "tienda" ? TIENDA_DIR : form.direccion,
        direccionCliente: form.envio === "domicilio" ? form.direccion : "",
        datos: form,
        items: cart.map((p) => ({
          id: p.id,
          qty: p.qty,
        })),
        aplicaIVA,
        pago: { medio: medioPago },
      });
      setLastOrder(order || null);
      dispatch({ type: "CLEAR" });
      setOk(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (e) {
      setErr(e.message);
    } finally {
      setEnviando(false);
    }
  };

  if (!user) return <Loader />;

  return (
    <>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <BackButton fallback="/cart" />
      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold overflow-x-auto pb-2">
        <span
          className={`whitespace-nowrap ${
            step === 1
              ? "underline text-black dark:text-white"
              : "opacity-60 dark:text-gray-400"
          }`}
        >
          1. Envío
        </span>
        <span className="opacity-50">/</span>
        <span
          className={`whitespace-nowrap ${
            step === 2
              ? "underline text-black dark:text-white"
              : "opacity-60 dark:text-gray-400"
          }`}
        >
          2. Pago
        </span>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 lg:gap-8">
        <div className="space-y-4">
          {step === 1 && (
            <>
              <div className="border rounded-2xl p-4 space-y-3 bg-white dark:bg-[#111023] border-zinc-200 dark:border-[#2a2338]">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  ¿Cómo entregamos tu compra?
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {envioOpciones.map((opt) => (
                    <label
                      key={opt.id}
                      className={`border rounded-xl p-3 cursor-pointer ${
                        form.envio === opt.id
                          ? "border-black dark:border-white bg-zinc-50 dark:bg-white/10"
                          : "border-gray-200 dark:border-[#2a2338]"
                      }`}
                    >
                      <input
                        type="radio"
                        className="mr-2"
                        checked={form.envio === opt.id}
                        onChange={() =>
                          setForm((prev) => {
                            if (opt.id === "tienda") {
                              setPrevDireccion(prev.direccion);
                              return {
                                ...prev,
                                envio: "tienda",
                                direccion: TIENDA_DIR,
                                celular: TIENDA_TEL,
                              };
                            }
                            return {
                              ...prev,
                              envio: "domicilio",
                              direccion: prevDireccion || "",
                              celular: "",
                            };
                          })
                        }
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {opt.label}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {opt.desc}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border border-zinc-200 dark:border-[#2a2338] rounded-xl p-4 sm:p-6 space-y-4 bg-white dark:bg-[#111023]">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Ingresá tu correo
                </h3>
                <input
                  className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Correo electrónico"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="border border-zinc-200 dark:border-[#2a2338] rounded-xl p-4 sm:p-6 space-y-4 bg-white dark:bg-[#111023]">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  ¿A qué dirección la enviamos?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Nombre *"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                  <input
                    className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Apellidos *"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Documento *"
                    value={form.documento}
                    onChange={(e) => setForm({ ...form, documento: e.target.value })}
                  />
                  <input
                    className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Celular *"
                    value={form.celular}
                    onChange={(e) => setForm({ ...form, celular: e.target.value })}
                  />
                </div>
                <input
                  className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none disabled:bg-zinc-100 disabled:opacity-60 bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Dirección *"
                  value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  disabled={form.envio === "tienda"}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Entre calles (opcional)"
                    value={form.entreCalles}
                    onChange={(e) => setForm({ ...form, entreCalles: e.target.value })}
                  />
                  <input
                    className="border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Piso/Depto (opcional)"
                    value={form.piso}
                    onChange={(e) => setForm({ ...form, piso: e.target.value })}
                  />
                </div>
                <textarea
                  className="w-full border border-zinc-200 dark:border-[#2a2338] rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#e5e7eb] dark:focus:ring-[#c2185b]/40 focus:border-[#c2185b] outline-none resize-none bg-[#f3f4f6] dark:bg-[#0f0b14] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Información adicional"
                  rows="3"
                  value={form.info}
                  onChange={(e) => setForm({ ...form, info: e.target.value })}
                />
              </div>

              {err && (
                <div className="text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/40 rounded-xl px-3 py-2">
                  {err}
                </div>
              )}

              <button
                onClick={siguientePaso}
                disabled={enviando}
                className="w-full bg-black text-white px-4 py-3 rounded-lg font-semibold hover:bg-zinc-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {enviando ? "Procesando..." : "Continuar"}
              </button>
            </>
          )}
          {step === 2 && (
            <form onSubmit={confirmar} className="space-y-4">
              <div className="border border-zinc-200 dark:border-[#2a2338] rounded-2xl p-4 space-y-3 bg-white dark:bg-[#111023]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">Chic &amp; Tech</p>
                    <h3 className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">Cupón de pago #{cupon}</h3>
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-300">
                    <p>Fecha límite</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{vencimiento}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-[#2a2338] p-4 bg-gray-50 dark:bg-[#161225] space-y-2 text-sm">
                  <div className="flex justify-between text-gray-800 dark:text-gray-100">
                    <span>Cliente</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {form.nombre || "Nombre"} {form.apellido}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-800 dark:text-gray-100">
                    <span>Correo</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{form.email}</span>
                  </div>
                  <div className="flex justify-between text-gray-800 dark:text-gray-100">
                    <span>Envío</span>
                    <span className="font-semibold capitalize text-gray-900 dark:text-white">{form.envio}</span>
                  </div>
                </div>

                <div className="border border-dashed border-zinc-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Escaneá el QR</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">Pagá desde Mercado Pago, banco o app favorita.</p>
                  </div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `Chic & Tech - Cupón ${cupon} - Total ${formatARS.format(total)}`
                    )}`}
                    alt="QR de pago"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg border border-zinc-200"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Forma de pago</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    {[
                      { id: "tarjeta", label: "Tarjeta" },
                      { id: "mercado_pago", label: "Mercado Pago" },
                      { id: "efectivo", label: "Efectivo" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`border rounded-xl p-3 cursor-pointer flex items-center gap-2 ${medioPago === opt.id
                            ? "border-black bg-zinc-50 dark:bg-white/10"
                            : "border-zinc-200 dark:border-[#2a2338]"
                          }`}
                      >
                        <input
                          type="radio"
                          checked={medioPago === opt.id}
                          onChange={() => setMedioPago(opt.id)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border border-zinc-200 dark:border-[#2a2338] rounded-xl p-4 text-sm space-y-2">
                  <div className="flex justify-between text-gray-800 dark:text-gray-100">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatARS.format(subtotal)}</span>
                  </div>
                  {aplicaIVA && (
                    <div className="flex justify-between text-gray-800 dark:text-gray-100">
                      <span>IVA (21%)</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatARS.format(iva)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatARS.format(total)}</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={acepta}
                    onChange={(e) => setAcepta(e.target.checked)}
                  />
                  Acepto los términos y confirmo que los datos son correctos.
                </label>

                {err && (
                  <div className="text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/40 rounded-xl px-3 py-2">
                    {err}
                  </div>
                )}

                {ok ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm space-y-1">
                    <p className="font-semibold text-emerald-700">¡Pago registrado correctamente!</p>
                    <p className="text-emerald-700">
                      Tu pedido{" "}
                      <span className="font-semibold">
                        #{lastOrder?.id ?? "generado"}
                      </span>{" "}
                      se creó por un total de{" "}
                      <span className="font-semibold">
                        {formatARS.format(lastOrder?.totals?.total ?? total)}
                      </span>
                      .
                    </p>
                    <p className="text-emerald-700">
                      Te enviaremos un correo con el detalle del pedido. Conservá el número para cualquier
                      consulta o seguimiento.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 rounded-lg border border-zinc-300 dark:border-[#2a2338] text-sm font-medium text-gray-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/10 transition-colors"
                    >
                      ← Volver a Envío
                    </button>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#c2185b] to-[#8c1c3f] text-white font-semibold hover:opacity-95 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {enviando ? "Creando pedido..." : "Pagar ahora"}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        <aside className="border border-zinc-200 dark:border-[#2a2338] rounded-2xl bg-white dark:bg-[#131121] shadow-sm p-4 sm:p-6 h-max sticky top-24 lg:top-20 space-y-4">
          <h3 className="text-base sm:text-lg font-semibold">Resumen de compra</h3>
          <ul className="space-y-2 text-sm">
            {cart.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span className="line-clamp-1 opacity-70">
                  {p.title} x{p.qty}
                </span>
                <span className="font-medium flex-shrink-0">{formatARS.format(p.price * p.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-zinc-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between opacity-70">
              <span>Subtotal</span>
              <span>{formatARS.format(subtotal)}</span>
            </div>
            {aplicaIVA && (
              <div className="flex justify-between opacity-70">
                <span>IVA (21%)</span>
                <span>{formatARS.format(iva)}</span>
              </div>
            )}
            <div className="flex justify-between text-base sm:text-lg font-semibold pt-2">
              <span>Total</span>
              <span>{formatARS.format(total)}</span>
            </div>
          </div>
        </aside>
      </section>
    </main>

    {showToast && (
      <div className="fixed bottom-4 right-4 z-50 max-w-xs rounded-xl border border-emerald-300 bg-emerald-50 shadow-lg px-4 py-3 flex items-start gap-3 text-sm text-emerald-900">
        <div className="h-6 w-6 rounded-full bg-emerald-500 text-white grid place-items-center animate-bounce flex-shrink-0">
          ✔️
        </div>
        <div>
          <p className="font-semibold">¡Felicidades! Tu pedido está en proceso</p>
          <p className="text-xs text-emerald-800">
            {lastOrder?.envio === "tienda"
              ? "En las próximas horas estaremos preparando tu compra. Vas a recibir un correo con los pasos para pasar a retirarla por la tienda."
              : "En las próximas horas estaremos preparando tu compra. Vas a recibir un correo con el detalle del envío a tu domicilio."}
          </p>
        </div>
      </div>
    )}
    </>
  );
}
