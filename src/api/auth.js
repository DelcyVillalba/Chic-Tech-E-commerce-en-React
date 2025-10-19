export const loginApi = async ({ email, password }) => {
  if (!email || !password) throw new Error("Ingresa email y contraseña");
  return { email, role: "admin", token: "fake.jwt.token" };
};
