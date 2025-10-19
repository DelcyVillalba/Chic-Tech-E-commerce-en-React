
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="border-t p-4 text-center text-sm"> © Chic &amp; Tech - 2025
      </footer>
    </div>
  );
}