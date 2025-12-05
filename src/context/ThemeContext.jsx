import { createContext, useContext, useEffect, useRef, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => { } });

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const initialized = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.setProperty("color-scheme", theme === "dark" ? "dark" : "light");
    localStorage.setItem("theme", theme);

    let timer;
    if (initialized.current) {
      root.classList.add("theme-transition");
      timer = setTimeout(() => {
        root.classList.remove("theme-transition");
      }, 500);
    } else {
      initialized.current = true;
    }

    return () => timer && clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
