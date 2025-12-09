import { api } from "./client";

// Simula la pasarela de pago en el backend.
export const simulatePayment = async (payload) => {
  const res = await api.post("/payments/simulado", payload);
  return res.data;
};

