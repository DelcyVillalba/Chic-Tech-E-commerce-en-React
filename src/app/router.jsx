import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import AdminProducts from "../pages/AdminProducts";
import ProductForm from "../pages/ProductForm";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/login", element: <Login /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/admin/products", element: <AdminProducts /> },
          { path: "/admin/products/new", element: <ProductForm /> },
          { path: "/admin/products/:id/edit", element: <ProductForm /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
