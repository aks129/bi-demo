"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "day" | "night";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: "night",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getEasternHour(): number {
  const now = new Date();
  // Convert to Eastern Time
  const eastern = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return eastern.getHours();
}

function isDay(): boolean {
  const hour = getEasternHour();
  return hour >= 6 && hour < 19; // 6 AM - 7 PM ET
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("night");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(isDay() ? "day" : "night");
    setMounted(true);

    // Re-check every 5 minutes
    const interval = setInterval(() => {
      setTheme(isDay() ? "day" : "night");
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "day" ? "night" : "day"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`theme-transition ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ transition: "opacity 0.5s ease" }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
