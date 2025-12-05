import { api } from "./client";

export const listOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const updateOrder = async (id, data) => {
  const res = await api.put(`/orders/${id}`, data);
  return res.data;
};
