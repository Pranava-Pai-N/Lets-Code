import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const resolveTheme = (t) => {
  if (t === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return t;
};

const themeBg = (resolved) => (resolved === "dark" ? "#09090b" : "#fafafa");

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(localStorage.getItem("theme") || "dark");
  const applyTheme = (newTheme) => {
    if (newTheme === theme) return;
    const resolved = resolveTheme(newTheme);

    const doSwitch = () => {
      setThemeState(newTheme);
      document.documentElement.className = resolved;
      localStorage.setItem("theme", newTheme);
    };

    if (document.startViewTransition) {
      const transition = document.startViewTransition(doSwitch);
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: ["circle(0% at 100% 0%)", "circle(150% at 100% 0%)"] },
          {
            duration: 1000,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    } else {
      doSwitch();
    }
  };

  const setTheme = applyTheme;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const resolved = resolveTheme(theme);
    document.documentElement.className = resolved;
    localStorage.setItem("theme", theme);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.className = mq.matches ? "dark" : "light";
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setThemeState(e.newValue || "light");
        document.documentElement.className = resolveTheme(e.newValue || "light");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};