import { useNavigate } from "react-router-dom";

export default function BackButton({ className = "", label = "Volver", fallback = "/" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-zinc-300 dark:border-[#2a2338] bg-[#f5f5f8] dark:bg-[#131121] text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-white/10 transition-colors ${className}`}
    >
      <span>←</span>
      <span>{label}</span>
    </button>
  );
}

