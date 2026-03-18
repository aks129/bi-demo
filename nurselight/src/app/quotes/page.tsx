"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { quotes, shuffleQuotes, categoryLabels, categoryEmoji, type Quote } from "@/lib/quotes";

const categories = Object.keys(categoryLabels) as Quote["category"][];

interface Feeling {
  name: string;
  emoji: string;
  colors: string[];
  prompt: string;
}

const feelings: Feeling[] = [
  {
    name: "Transcendence",
    emoji: "🌌",
    colors: ["#7c3aed", "#a78bfa", "#c4b5fd", "#312e81", "#1e1b4b"],
    prompt: "Rise above. You are infinite awareness witnessing the cosmic dance.",
  },
  {
    name: "Serenity",
    emoji: "🕊️",
    colors: ["#06b6d4", "#67e8f9", "#a5f3fc", "#164e63", "#0e7490"],
    prompt: "Stillness lives within you. Let the waters of your mind become clear.",
  },
  {
    name: "Healing",
    emoji: "🌿",
    colors: ["#22c55e", "#86efac", "#bbf7d0", "#14532d", "#166534"],
    prompt: "Every cell in your body is renewing. You are becoming whole again.",
  },
  {
    name: "Love",
    emoji: "💜",
    colors: ["#ec4899", "#f9a8d4", "#fce7f3", "#831843", "#9d174d"],
    prompt: "Love flows through you like light through crystal — radiant and boundless.",
  },
  {
    name: "Courage",
    emoji: "🔥",
    colors: ["#f97316", "#fdba74", "#fed7aa", "#7c2d12", "#9a3412"],
    prompt: "The fire within you burns brighter than the fire around you.",
  },
  {
    name: "Wonder",
    emoji: "✨",
    colors: ["#eab308", "#fde047", "#fef9c3", "#713f12", "#854d0e"],
    prompt: "The universe is not outside of you. Look inside yourself; everything you want, you already are.",
  },
];

function VisualizationCanvas({ feeling, seed }: { feeling: Feeling; seed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const colors = feeling.colors;
    let animFrame: number;
    let time = 0;

    function hexToRgba(hex: string, alpha: number) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function draw() {
      if (!ctx || !canvas) return;
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep background
      ctx.fillStyle = colors[4] || colors[0];
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Hypnotic concentric rings
      for (let i = 12; i >= 0; i--) {
        const radius = 30 + i * 15 + Math.sin(time * 1.2 + i * 0.5) * 8;
        const alpha = 0.08 + Math.sin(time + i * 0.4) * 0.05;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(colors[i % 3], alpha);
        ctx.fill();
      }

      // Sacred geometry - rotating petals
      const petalCount = 6 + (seed % 6);
      for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2 + time * 0.3;
        const len = 80 + Math.sin(time * 0.7 + p) * 30;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(len * 0.5, 0, len * 0.5, 18 + Math.sin(time + p) * 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(colors[1], 0.12 + Math.sin(time * 1.5 + p) * 0.06);
        ctx.fill();
        ctx.restore();
      }

      // Inner rotating mandala lines
      for (let l = 0; l < 24; l++) {
        const angle = (l / 24) * Math.PI * 2 + time * 0.15;
        const innerR = 20 + Math.sin(time * 2 + l) * 10;
        const outerR = 140 + Math.sin(time * 0.5 + l * 0.3) * 40;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
        ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
        ctx.strokeStyle = hexToRgba(colors[2], 0.06 + Math.sin(time + l * 0.5) * 0.03);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Floating particles
      for (let i = 0; i < 40; i++) {
        const pSeed = seed * 13 + i * 37;
        const baseAngle = (pSeed % 360) * (Math.PI / 180);
        const dist = 30 + (pSeed % 160);
        const x = cx + Math.cos(baseAngle + time * 0.2 + i * 0.1) * (dist + Math.sin(time + i) * 20);
        const y = cy + Math.sin(baseAngle + time * 0.2 + i * 0.1) * (dist + Math.cos(time + i) * 20);
        const size = 1 + (i % 3) + Math.sin(time * 2 + i) * 0.5;
        const alpha = 0.3 + Math.sin(time * 1.5 + i * 0.7) * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(colors[i % 3], alpha);
        ctx.fill();
      }

      // Central glow
      const glowSize = 60 + Math.sin(time * 0.8) * 15;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
      gradient.addColorStop(0, hexToRgba(colors[0], 0.4 + Math.sin(time) * 0.15));
      gradient.addColorStop(0.5, hexToRgba(colors[1], 0.15));
      gradient.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Outer ring breathing
      const ringRadius = 170 + Math.sin(time * 0.5) * 10;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(colors[1], 0.15 + Math.sin(time * 0.7) * 0.08);
      ctx.lineWidth = 2;
      ctx.stroke();

      animFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(animFrame);
  }, [feeling, seed]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl"
      style={{ maxWidth: 400, maxHeight: 400 }}
    />
  );
}

export default function QuotesPage() {
  const [activeCategory, setActiveCategory] = useState<Quote["category"] | "all">("all");
  const [savedQuotes, setSavedQuotes] = useState<Set<number>>(new Set());
  const [revealedQuote, setRevealedQuote] = useState<number | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [visSeed, setVisSeed] = useState(1);
  const [showVis, setShowVis] = useState(false);

  // Shuffle quotes once on mount
  const shuffled = useMemo(() => shuffleQuotes(quotes), []);

  const filtered = useMemo(() => {
    return activeCategory === "all"
      ? shuffled
      : shuffled.filter((q) => q.category === activeCategory);
  }, [activeCategory, shuffled]);

  const toggleSave = useCallback((index: number) => {
    setSavedQuotes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const generateVisualization = (feeling: Feeling) => {
    setSelectedFeeling(feeling);
    setVisSeed(Math.floor(Math.random() * 10000));
    setShowVis(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-up">
        <span className="text-3xl mb-4 block">❝</span>
        <h1 className="text-3xl md:text-4xl font-serif text-gradient mb-3">
          Words of Light
        </h1>
        <p className="text-white/40 font-serif italic">
          Ancient wisdom for modern healers
        </p>
      </div>

      {/* Random Quote Oracle */}
      <div className="mb-12 animate-fade-in-up delay-200" style={{ animationFillMode: "backwards" }}>
        <button
          onClick={() => setRevealedQuote(Math.floor(Math.random() * quotes.length))}
          className="w-full glass-warm rounded-2xl p-8 text-center transition-all duration-500 hover:scale-[1.01] cursor-pointer group"
        >
          {revealedQuote !== null ? (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-spirit-300/50 mb-4">
                The universe speaks
              </p>
              <blockquote className="text-xl md:text-2xl text-white/85 font-serif italic leading-relaxed mb-4">
                &ldquo;{quotes[revealedQuote].text}&rdquo;
              </blockquote>
              <p className="text-spirit-300/60 text-sm">— {quotes[revealedQuote].author}</p>
              <p className="text-white/20 text-xs mt-4">Tap for another</p>
            </>
          ) : (
            <>
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✦</div>
              <p className="text-white/50 font-serif">
                Tap to receive a message meant for you today
              </p>
            </>
          )}
        </button>
      </div>

      {/* Transcendence Visualization Generator */}
      <div className="mb-12 animate-fade-in-up delay-300" style={{ animationFillMode: "backwards" }}>
        <div className="text-center mb-6">
          <span className="text-2xl mb-2 block">🌀</span>
          <h2 className="text-xl md:text-2xl font-serif text-gradient-warm mb-2">
            Feeling Visualization
          </h2>
          <p className="text-white/35 font-serif italic text-sm">
            Choose a feeling to generate a hypnotic vision for reconnection
          </p>
        </div>

        {/* Feeling Selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {feelings.map((f) => (
            <button
              key={f.name}
              onClick={() => generateVisualization(f)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-500 hover:scale-105 ${
                selectedFeeling?.name === f.name
                  ? "border border-white/30 shadow-lg"
                  : "glass text-white/50 hover:text-white/70"
              }`}
              style={
                selectedFeeling?.name === f.name
                  ? {
                      background: `linear-gradient(135deg, ${f.colors[4]}cc, ${f.colors[0]}88)`,
                      color: f.colors[2],
                    }
                  : undefined
              }
            >
              {f.emoji} {f.name}
            </button>
          ))}
        </div>

        {/* Visualization Display */}
        {showVis && selectedFeeling && (
          <div className="animate-fade-in-up">
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="flex flex-col items-center gap-6">
                {/* Canvas visualization */}
                <div
                  className="relative w-full flex justify-center overflow-hidden rounded-2xl"
                  style={{
                    background: `radial-gradient(circle, ${selectedFeeling.colors[4]}, #0a0a0f)`,
                  }}
                >
                  <VisualizationCanvas feeling={selectedFeeling} seed={visSeed} />
                  {/* Overlay vignette */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, transparent 50%, rgba(0,0,0,0.6) 100%)",
                    }}
                  />
                </div>

                {/* Feeling message */}
                <div className="text-center max-w-md">
                  <p className="text-lg md:text-xl font-serif italic text-white/75 leading-relaxed mb-3">
                    &ldquo;{selectedFeeling.prompt}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      onClick={() => generateVisualization(selectedFeeling)}
                      className="px-5 py-2 rounded-full text-sm glass hover:bg-white/5 text-white/50 hover:text-white/70 transition-all duration-300"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={() => setShowVis(false)}
                      className="px-5 py-2 rounded-full text-sm text-white/30 hover:text-white/50 transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10 animate-fade-in-up delay-500" style={{ animationFillMode: "backwards" }}>
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
            activeCategory === "all"
              ? "bg-spirit-500/20 text-spirit-200 border border-spirit-400/30"
              : "glass text-white/40 hover:text-white/60"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
              activeCategory === cat
                ? "bg-spirit-500/20 text-spirit-200 border border-spirit-400/30"
                : "glass text-white/40 hover:text-white/60"
            }`}
          >
            {categoryEmoji[cat]} {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Quotes Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((quote, i) => {
          const globalIndex = quotes.indexOf(quote);
          return (
            <div
              key={globalIndex}
              className="glass rounded-2xl p-6 group hover:border-spirit-400/20 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-spirit-500/10 text-spirit-300/60">
                  {categoryEmoji[quote.category]} {categoryLabels[quote.category]}
                </span>
                <button
                  onClick={() => toggleSave(globalIndex)}
                  className={`text-lg transition-all duration-300 hover:scale-125 ${
                    savedQuotes.has(globalIndex)
                      ? "text-warmth-400"
                      : "text-white/20 hover:text-warmth-300"
                  }`}
                  aria-label={savedQuotes.has(globalIndex) ? "Unsave quote" : "Save quote"}
                >
                  {savedQuotes.has(globalIndex) ? "♥" : "♡"}
                </button>
              </div>
              <blockquote className="text-white/75 font-serif italic leading-relaxed mb-3">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <p className="text-white/35 text-sm">— {quote.author}</p>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-white/30 font-serif italic mt-12">
          No quotes found in this category yet.
        </p>
      )}
    </div>
  );
}
