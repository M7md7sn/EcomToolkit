"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const preferred = stored === "light" ? "light" : "dark";
    setTheme(preferred);
    document.documentElement.dataset.theme = preferred;
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("theme", next);
  }

  return (
    <button
      className="icon-button"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
