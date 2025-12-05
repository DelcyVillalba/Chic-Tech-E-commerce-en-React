import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { createUser } from "../api/users";

const tabs = [
  { id: "login", label: "Iniciar sesión" },
  { id: "register", label: "Crear cuenta" },
];

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    documento2: "",
    email: "",
    password: "",
    password2: "",
    aceptaComercial: false,
    aceptaTyC: false,
  });
  const [err, setErr] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegisterPass, setShowRegisterPass] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    // Validaciones básicas para registro
    if (mode === "register") {
      if (!form.nombre || !form.apellido || !form.documento || !form.email) {
        setErr("Completa los datos obligatorios marcados con *.");
        return;
      }
      if (form.documento !== form.documento2) {
        setErr("Los documentos no coinciden.");
        return;
      }
      if (form.password !== form.password2) {
        setErr("Las contraseñas no coinciden.");
        return;
      }
      if (!form.aceptaTyC) {
        setErr("Debes aceptar los Términos y Condiciones.");
        return;
      }
    }

    try {
      if (mode === "register") {
        // Creamos el usuario antes de iniciar sesión
        await createUser({
          name:
            `${form.nombre} ${form.apellido}`.trim() ||
            form.nombre ||
            form.apellido ||
            "Usuario",
          email: form.email,
          password: form.password,
          role: "customer",
          active: true,
        });
      }

      const user = await login({ email: form.email, password: form.password });
      const fallback =
        location.state?.from && location.state.from !== "/login"
          ? location.state.from
          : "/";
      nav(user.role === "admin" ? "/admin" : fallback);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6">
      <div className="border rounded-2xl shadow-sm p-8 bg-white">
        <div className="flex justify-center mb-8">
          <button
            className="flex items-center gap-2 border border-zinc-200 dark:border-[#2a2338] rounded-lg px-5 py-2 bg-white dark:bg-[#161225] text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
            type="button"
            onClick={() => alert("Integrar Google OAuth aquí")}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="text-sm font-medium">Ingresar con Google</span>
          </button>
        </div>

        <div className="grid grid-cols-2 text-center border-b mb-6 text-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`pb-2 font-semibold border-b-2 ${
                mode === t.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {err && (
          <div className="text-red-600 bg-red-50 border border-red-100 rounded-xl p-2 mb-4 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          {mode === "register" && (
            <>
              <section className="space-y-4">
                <h2 className="text-sm font-semibold">Datos personales</h2>
                <input
                  className="w-full border-b px-1 py-2 focus:outline-none"
                  placeholder="Nombre *"
                  value={form.nombre}
                  onChange={(e) => update({ nombre: e.target.value })}
                />
                <input
                  className="w-full border-b px-1 py-2 focus:outline-none"
                  placeholder="Apellidos *"
                  value={form.apellido}
                  onChange={(e) => update({ apellido: e.target.value })}
                />
                <input
                  className="w-full border-b px-1 py-2 focus:outline-none"
                  placeholder="Documento *"
                  value={form.documento}
                  onChange={(e) => update({ documento: e.target.value })}
                />
                <input
                  className="w-full border-b px-1 py-2 focus:outline-none"
                  placeholder="Repetir documento *"
                  value={form.documento2}
                  onChange={(e) => update({ documento2: e.target.value })}
                />
              </section>

              <section className="space-y-4 border-t pt-4">
                <h2 className="text-sm font-semibold">
                  Introduce un e-mail y una contraseña
                </h2>
                <input
                  className="w-full border-b px-1 py-2 focus:outline-none"
                  placeholder="E-mail *"
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
                <div className="relative">
                  <input
                    className="w-full border-b px-1 py-2 pr-10 focus:outline-none"
                    type={showRegisterPass ? "text" : "password"}
                    placeholder="Contraseña *"
                    value={form.password}
                    onChange={(e) => update({ password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPass((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-500 px-3"
                    title={
                      showRegisterPass
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showRegisterPass ? "👁︎" : "👁"}
                  </button>
                </div>
                <input
                  className="w-full border-b px-1 py-2 focus:outline-none"
                  type={showRegisterPass ? "text" : "password"}
                  placeholder="Repetir contraseña *"
                  value={form.password2}
                  onChange={(e) => update({ password2: e.target.value })}
                />
              </section>

              <section className="space-y-2 text-sm">
                <label className="flex gap-2 items-start">
                  <input
                    type="checkbox"
                    checked={form.aceptaComercial}
                    onChange={(e) =>
                      update({ aceptaComercial: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <span>Acepto recibir novedades y promociones por email.</span>
                </label>
                <label className="flex gap-2 items-start">
                  <input
                    type="checkbox"
                    checked={form.aceptaTyC}
                    onChange={(e) => update({ aceptaTyC: e.target.checked })}
                    className="mt-1"
                  />
                  <span>
                    Acepto los Términos y Condiciones, la Política de
                    Privacidad.
                  </span>
                </label>
              </section>
            </>
          )}

          {mode === "login" && (
            <section className="space-y-5">
              <input
                className="w-full border-b px-1 py-2 focus:outline-none"
                placeholder="E-mail *"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
              />
              <div className="relative">
                <input
                  className="w-full border-b px-1 py-2 pr-10 focus:outline-none"
                  type={showLoginPass ? "text" : "password"}
                  placeholder="Contraseña *"
                  value={form.password}
                  onChange={(e) => update({ password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-gray-500 px-3"
                  title={
                    showLoginPass ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showLoginPass ? "👁︎" : "👁"}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => update({ remember: e.target.checked })}
                  />
                  Recordarme
                </label>
                <button type="button" className="text-gray-400">
                  ¿Olvidaste la contraseña?
                </button>
              </div>
            </section>
          )}

          <button className="mt-4 w-full rounded-xl bg-black text-white py-3 font-semibold">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>

          {mode === "login" && (
            <p className="text-center text-sm mt-3">
              ¿Todavía no tenés cuenta?{" "}
              <button
                type="button"
                className="font-semibold"
                onClick={() => setMode("register")}
              >
                Registrate
              </button>
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
