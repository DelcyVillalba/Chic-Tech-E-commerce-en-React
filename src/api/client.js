
import axios from "axios";
export const api = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 8000,
});

api.interceptors.response.use(
  (r) => r,
  (err) =>
    Promise.reject(
      new Error(err.response?.data?.message || err.message || "Error de red")
    )
);
