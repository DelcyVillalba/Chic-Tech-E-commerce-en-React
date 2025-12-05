import { api } from "./client";

// Simula la pasarela de pago en el backend.
// Solo enviamos los datos mínimos; el backend recalcula precios y totales.
export const simulatePayment = async (payload) => {
  const res = await api.post("/payments/simulado", payload);
  return res.data;
};

