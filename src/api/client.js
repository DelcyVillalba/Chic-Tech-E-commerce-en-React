import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL,
  timeout: 8000,
});

api.interceptors.response.use(
  (r) => r,
  (err) =>
    Promise.reject(
      new Error(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          err.message ||
          "Error de red"
      )
    )
);
console.log("🌐 API BASE URL:", baseURL);
