import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

const gradients = {
  day: "linear-gradient(120deg, #8fd6ff 0%, #bff0ff 35%, #ffcc80 78%, #ff9966 100%)",
  night: "linear-gradient(120deg, #241b49 0%, #3b296d 55%, #6a47a7 100%)",
};

const knobStyles = {
  day: "radial-gradient(circle at 30% 30%, #fff9d8, #ffc47d 75%)",
  night: "radial-gradient(circle at 40% 40%, #f4f7ff, #92a4ff 78%)",
};

export default function ThemeToggle({ className = "", compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const dims = useMemo(
    () =>
      compact
        ? { width: 70, height: 30, knob: 24, padding: 3 }
        : { width: 104, height: 40, knob: 32, padding: 4 },
    [compact]
  );

  const knobPosition = isDark
    ? dims.padding
    : dims.width - dims.knob - dims.padding;

  const outlineColor = isDark
    ? "rgba(255,255,255,0.35)"
    : "rgba(15,23,42,0.4)";

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: dims.width,
        height: dims.height,
        border: `1px solid ${outlineColor}`,
        boxShadow: isDark
          ? "0 12px 28px rgba(17,10,32,0.55)"
          : "0 12px 28px rgba(255,172,110,0.35)",
      }}
      className={`relative rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 ${className}`}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <span
        className="absolute inset-0 rounded-full overflow-hidden transition-[background] duration-700 ease-in-out"
        style={{
          background: isDark ? gradients.night : gradients.day,
        }}
        aria-hidden
      >
        {!isDark ? (
          <>
            {/* Nubes modo día */}
            <span
              className="absolute rounded-full bg-white/95 blur-[1px] shadow-sm"
              style={{
                width: dims.knob * 0.7,
                height: dims.knob * 0.35,
                top: dims.height * 0.48,
                left: dims.padding + 1,
              }}
            />
            <span
              className="absolute rounded-full bg-white/85 blur-[1px] shadow-sm"
              style={{
                width: dims.knob * 0.4,
                height: dims.knob * 0.3,
                top: dims.height * 0.38,
                left: dims.padding + 5,
              }}
            />
            <span
              className="absolute rounded-full bg-white/95 blur-[1px] shadow-sm"
              style={{
                width: dims.knob * 0.9,
                height: dims.knob * 0.4,
                top: dims.height * 0.25,
                left: dims.padding + 35,
              }}
            />
            <span
              className="absolute rounded-full bg-white/85 blur-[1px] shadow-sm"
              style={{
                width: dims.knob * 0.4,
                height: dims.knob * 0.3,
                top: dims.height * 0.1,
                left: dims.padding + 43,
              }}
            />
          </>
        ) : (
          <>
            {/* ★ Puntos de estrellas */}
            <span
              className="absolute bg-white/70 rounded-full"
              style={{
                width: 4,
                height: 4,
                top: dims.height * 0.3,
                left: dims.width * 0.55,
              }}
            />
            <span
              className="absolute bg-white/70 rounded-full"
              style={{
                width: 3,
                height: 3,
                top: dims.height * 0.3,
                left: dims.width * 0.55,
              }}
            />
            <span
              className="absolute bg-white/70 rounded-full"
              style={{
                width: 4,
                height: 4,
                top: dims.height * 0.05,
                left: dims.width * 0.38,
              }}
            />
            <span
              className="absolute bg-white/70 rounded-full"
              style={{
                width: 4,
                height: 4,
                top: dims.height * 0.2,
                left: dims.width * 0.75,
              }}
            />
            <span
              className="absolute bg-white/70 rounded-full"
              style={{
                width: 4,
                height: 4,
                top: dims.height * 0.6,
                left: dims.width * 0.85,
              }}
            />
            <span
              className="absolute bg-white/70 rounded-full"
              style={{
                width: 4,
                height: 4,
                top: dims.height * 0.7,
                left: dims.width * 0.35,
              }}
            />
            {/* ☄ cuerpo estrella fugaz 🌠 */}
            <span
              className="absolute bg-white/100 rounded-full"
              style={{
                width: 6,
                height: 6,
                top: dims.height * 0.69,
                left: dims.width * 0.57,
              }}
            />
            {/* ☄ Trazo de estrella fugaz */}
            <span
              className="absolute h-1 w-5 bg-white/50 rounded-full"
              style={{
                top: dims.height * 0.61,
                left: dims.width * 0.6,
                transform: "rotate(-25deg)",
              }}
            />
          </>
        )}
      </span>

      <span
        className="absolute rounded-full shadow-lg border border-white/40 transition-[left,background,box-shadow] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden animate-float"
        style={{
          width: dims.knob,
          height: dims.knob,
          top: dims.padding,
          left: knobPosition,
          background: isDark ? knobStyles.night : knobStyles.day,
          boxShadow:
            "0 0 16px rgba(255, 152, 0, 0.8), 0 0 8px rgba(255, 152, 0, 0.4)",
        }}
        aria-hidden
      />
    </button>
  );
}
