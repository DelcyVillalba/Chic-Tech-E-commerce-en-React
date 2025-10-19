import { createContext, useContext, useEffect, useState } from "react";
import { loginApi } from "../api/auth";
const C = createContext(null);
export const useAuth = () => useContext(C);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  useEffect(() => {
    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user");
  }, [user]);
  const login = async (cred) => setUser(await loginApi(cred));
  const logout = () => setUser(null);
  return <C.Provider value={{ user, login, logout }}>{children}</C.Provider>;
}
