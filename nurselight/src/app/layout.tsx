import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "NurseLight — Wisdom, Peace & Healing",
  description:
    "A sanctuary for nurses. Philosophical quotes, guided meditation, mental health check-ins, and a space to breathe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-white antialiased min-h-screen">
        {/* Ambient background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-spirit-600/10 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-ocean-500/8 rounded-full blur-[120px] animate-pulse-soft delay-1000" />
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-warmth-400/5 rounded-full blur-[100px] animate-pulse-soft delay-500" />
        </div>

        <Navigation />

        <main className="pt-4 pb-24 md:pt-20 md:pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
