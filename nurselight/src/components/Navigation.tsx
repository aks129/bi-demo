"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { href: "/", label: "Home", icon: "◇" },
  { href: "/quotes", label: "Quotes", icon: "❝" },
  { href: "/meditate", label: "Meditate", icon: "◎" },
  { href: "/wellness", label: "Wellness", icon: "♡" },
  { href: "/journal", label: "Journal", icon: "✎" },
  { href: "/friday", label: "Friday", icon: "☽" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      <div className="glass border-t border-white/10 md:border-b md:border-t-0">
        <div className="max-w-5xl mx-auto px-4">
          {/* Desktop */}
          <div className="hidden md:flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl animate-pulse-soft">
                {theme === "day" ? "☀" : "✦"}
              </span>
              <span className="text-lg font-serif text-spirit-200 tracking-wide group-hover:text-spirit-100 transition-colors"
                style={{ color: theme === "day" ? "var(--color-spirit-700)" : undefined }}
              >
                NurseLight
              </span>
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    pathname === item.href
                      ? "bg-spirit-500/20 border border-spirit-400/30"
                      : "hover:bg-white/5"
                  }`}
                  style={{
                    color: pathname === item.href
                      ? (theme === "day" ? "var(--color-spirit-700)" : "var(--color-spirit-200)")
                      : (theme === "day" ? "var(--theme-nav-text)" : undefined),
                  }}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="ml-3 px-3 py-2 rounded-full text-sm transition-all duration-500 hover:bg-white/5"
                style={{ color: theme === "day" ? "var(--theme-text-muted)" : "rgba(255,255,255,0.5)" }}
                aria-label="Toggle day/night theme"
              >
                {theme === "day" ? "☾" : "☀"}
              </button>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center justify-around py-2 pb-[env(safe-area-inset-bottom)]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                  pathname === item.href
                    ? ""
                    : ""
                }`}
                style={{
                  color: pathname === item.href
                    ? (theme === "day" ? "var(--color-spirit-600)" : "var(--color-spirit-300)")
                    : (theme === "day" ? "var(--theme-text-faint)" : "rgba(255,255,255,0.4)"),
                }}
              >
                <span className={`text-lg ${pathname === item.href ? "scale-110" : ""} transition-transform`}>
                  {item.icon}
                </span>
                <span className="text-[10px] tracking-wider">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300"
              style={{ color: theme === "day" ? "var(--theme-text-faint)" : "rgba(255,255,255,0.4)" }}
              aria-label="Toggle day/night theme"
            >
              <span className="text-lg">{theme === "day" ? "☾" : "☀"}</span>
              <span className="text-[10px] tracking-wider">Theme</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
