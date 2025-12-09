import { api } from "./client";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const listProducts = getProducts;

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const getProduct = getProductById;

export const createProduct = async (data) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const listCategories = async () => {
  const res = await api.get("/products");
  const products = res.data;

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return categories;
};
