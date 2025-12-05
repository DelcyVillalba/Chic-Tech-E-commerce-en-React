const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const loginApi = async ({ email, password }) => {
  if (!email || !password) throw new Error("Ingresa email y contraseña");
  const res = await fetch(baseURL + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.msg || "Credenciales inválidas");
  }
  const user = await res.json();
  return { ...user, token: "fake.jwt.token" };
};
