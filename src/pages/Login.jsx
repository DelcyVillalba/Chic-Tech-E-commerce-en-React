import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login({ email, password });
      nav("/admin/products");
    } catch (e) {
      setErr(e.message);
    }
  };
  return (
    <main className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Ingresar</h1>
      {err && <div className="text-red-600 mb-2">Error: {err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 rounded-xl w-full">
          Entrar
        </button>
      </form>
    </main>
  );
}
