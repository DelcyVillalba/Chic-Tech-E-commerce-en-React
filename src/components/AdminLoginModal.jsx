import { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLoginModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  // Limpiar cuando se cierra
  const reset = () => {
    setEmail("");
    setPassword("");
    setErr("");
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const user = await login({ email, password });
      if (user.role !== "admin") {
        setErr("Este acceso es solo para administradores.");
        return;
      }
      reset();
      onClose?.();
      nav("/admin");
    } catch (error) {
      setErr(error.message);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm grid place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white border border-[#fbe8ef] shadow-2xl p-6 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-[#c2185b]">Admin panel</h2>
          <p className="text-xs text-gray-500">
            Acceso exclusivo para administradores
          </p>
        </div>
        {err && (
          <div className="bg-red-100 text-red-700 rounded-lg px-3 py-2 text-sm">
            {err}
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full rounded-lg px-3 py-2 border border-gray-200 focus:border-[#c2185b] focus:ring-2 focus:ring-[#f5c7d6]"
            placeholder="Login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-lg px-3 py-2 border border-gray-200 focus:border-[#c2185b] focus:ring-2 focus:ring-[#f5c7d6]"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-[#c2185b] hover:bg-[#a3154a] text-white rounded-lg py-2 font-semibold shadow-md shadow-[#f5c7d6]">
            Login
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full bg-white text-gray-700 rounded-lg py-2 font-semibold border hover:border-[#f5c7d6]"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
