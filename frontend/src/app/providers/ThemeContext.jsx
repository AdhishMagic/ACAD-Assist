import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "theme";
const THEME_VALUES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const ThemeContext = createContext(undefined);

function normalizeTheme(value) {
  if (value === THEME_VALUES.LIGHT || value === THEME_VALUES.DARK || value === THEME_VALUES.SYSTEM) {
    return value;
  }
  return THEME_VALUES.SYSTEM;
}

function getSystemTheme() {
  if (typeof window === "undefined") {
    return THEME_VALUES.LIGHT;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_VALUES.DARK : THEME_VALUES.LIGHT;
}

function resolveTheme(theme) {
  return theme === THEME_VALUES.SYSTEM ? getSystemTheme() : theme;
}

function applyThemeToDom(resolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.remove(THEME_VALUES.LIGHT, THEME_VALUES.DARK);
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;
}

function getStoredTheme() {
  if (typeof window === "undefined") {
    return THEME_VALUES.SYSTEM;
  }

  const normalized = normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  window.localStorage.setItem(THEME_STORAGE_KEY, normalized);
  return normalized;
}

export function hydrateTheme() {
  const theme = getStoredTheme();
  const resolvedTheme = resolveTheme(theme);
  applyThemeToDom(resolvedTheme);
  return theme;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(getStoredTheme()));

  const setTheme = useCallback((nextTheme) => {
    const normalized = normalizeTheme(nextTheme);
    setThemeState(normalized);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, normalized);
    }
  }, []);

  useEffect(() => {
    const nextResolvedTheme = resolveTheme(theme);
    setResolvedTheme(nextResolvedTheme);
    applyThemeToDom(nextResolvedTheme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (theme !== THEME_VALUES.SYSTEM) {
        return;
      }

      const nextResolvedTheme = getSystemTheme();
      setResolvedTheme(nextResolvedTheme);
      applyThemeToDom(nextResolvedTheme);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleStorageThemeChange = (event) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }
      setThemeState(normalizeTheme(event.newValue));
    };

    window.addEventListener("storage", handleStorageThemeChange);
    return () => window.removeEventListener("storage", handleStorageThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === THEME_VALUES.DARK ? THEME_VALUES.LIGHT : THEME_VALUES.DARK);
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      themes: THEME_VALUES,
    }),
    [resolvedTheme, setTheme, theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export default ThemeContext;
