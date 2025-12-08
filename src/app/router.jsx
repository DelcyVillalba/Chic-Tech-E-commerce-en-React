import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import ProductForm from "../pages/ProductForm";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FAQ from "../pages/FAQ";
import Tecnologia from "../pages/Tecnologia";
import Hombre from "../pages/Hombre";
import Mujer from "../pages/Mujer";
import Accesorios from "../pages/Accesorios";
import Wishlist from "../pages/Wishlist";
import Cosmeticos from "../pages/Cosmeticos";
import Hogar from "../pages/Hogar";
import Jardin from "../pages/Jardin";
import Libros from "../pages/Libros";
import Mascotas from "../pages/Mascotas";
import Ninos from "../pages/Ninos";
import AdminOrders from "../pages/AdminOrders";
import Checkout from "../pages/Checkout";
import AdminUsers from "../pages/AdminUsers";
import AdminReports from "../pages/AdminReports";
import AdminSettings from "../pages/AdminSettings";
import SearchResults from "../pages/SearchResults";

console.log("🔧 VITE_API_URL:", import.meta.env.VITE_API_URL);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/favoritos", element: <Wishlist /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/login", element: <Login /> },
      { path: "/sobre-nosotros", element: <About /> },
      { path: "/contacto", element: <Contact /> },
      { path: "/faq", element: <FAQ /> },
      { path: "/tecnologia", element: <Tecnologia /> },
      { path: "/hombre", element: <Hombre /> },
      { path: "/mujer", element: <Mujer /> },
      { path: "/accesorios", element: <Accesorios /> },
      { path: "/cosmeticos", element: <Cosmeticos /> },
      { path: "/hogar", element: <Hogar /> },
      { path: "/jardin", element: <Jardin /> },
      { path: "/libros", element: <Libros /> },
      { path: "/mascotas", element: <Mascotas /> },
      { path: "/ninos", element: <Ninos /> },
      { path: "/buscar", element: <SearchResults /> },
      {
        element: <ProtectedRoute requireAdmin />,
        children: [
          { path: "/admin", element: <AdminDashboard /> },
          { path: "/admin/orders", element: <AdminOrders /> },
          { path: "/admin/products", element: <AdminProducts /> },
          { path: "/admin/products/new", element: <ProductForm /> },
          { path: "/admin/products/:id/edit", element: <ProductForm /> },
          { path: "/admin/users", element: <AdminUsers /> },
          { path: "/admin/reports", element: <AdminReports /> },
          { path: "/admin/settings", element: <AdminSettings /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
