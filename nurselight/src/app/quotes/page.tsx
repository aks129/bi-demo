"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { quotes, shuffleQuotes, categoryLabels, categoryEmoji, type Quote } from "@/lib/quotes";

const categories = Object.keys(categoryLabels) as Quote["category"][];

export default function QuotesPage() {
  const [activeCategory, setActiveCategory] = useState<Quote["category"] | "all">("all");
  const [savedQuotes, setSavedQuotes] = useState<Set<number>>(new Set());
  const [revealedQuote, setRevealedQuote] = useState<number | null>(null);
  const [shuffled, setShuffled] = useState(quotes);

  useEffect(() => {
    setShuffled(shuffleQuotes(quotes));
  }, []);

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

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10 animate-fade-in-up delay-300" style={{ animationFillMode: "backwards" }}>
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
