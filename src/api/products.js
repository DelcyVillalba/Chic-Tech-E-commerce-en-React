import { api } from "./client";

export const listProducts = () => api.get("/products").then((r) => r.data);
export const getProduct = (id) =>
  api.get(`/products/${id}`).then((r) => r.data);
export const createProduct = (body) =>
  api.post("/products", body).then((r) => r.data);
export const updateProduct = (id, body) =>
  api.put(`/products/${id}`, body).then((r) => r.data);
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((r) => r.data);
export const listCategories = () =>
  api.get("/products/categories").then((r) => r.data);
