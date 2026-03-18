import Link from "next/link";
import { getDailyQuote } from "@/lib/quotes";

export default function Home() {
  const daily = getDailyQuote();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        {/* Mandala-like decoration */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border border-spirit-400/20 animate-rotate-slow" />
          <div className="absolute inset-3 rounded-full border border-spirit-300/15 animate-rotate-slow" style={{ animationDirection: "reverse", animationDuration: "25s" }} />
          <div className="absolute inset-6 rounded-full border border-ocean-300/10 animate-rotate-slow" style={{ animationDuration: "20s" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-pulse-soft">✦</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-4">
          <span className="text-gradient">NurseLight</span>
        </h1>
        <p className="text-lg md:text-xl text-white/40 font-serif italic mb-2">
          A sanctuary for the healers
        </p>
        <p className="text-sm text-white/25 mb-12 tracking-widest uppercase">
          Wisdom &middot; Peace &middot; Renewal
        </p>
      </div>

      {/* Daily Quote */}
      <div className="max-w-xl mx-auto mb-16 animate-fade-in-up delay-300" style={{ animationFillMode: "backwards" }}>
        <div className="glass-warm rounded-2xl p-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-spirit-300/60 mb-4">
            Today&apos;s Reflection
          </p>
          <blockquote className="text-lg md:text-xl text-white/80 font-serif italic leading-relaxed mb-4">
            &ldquo;{daily.text}&rdquo;
          </blockquote>
          <p className="text-spirit-300/70 text-sm">— {daily.author}</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-4xl mx-auto w-full px-2 animate-fade-in-up delay-500" style={{ animationFillMode: "backwards" }}>
        <NavCard
          href="/quotes"
          icon="❝"
          title="Quotes"
          subtitle="Philosophical wisdom"
          gradient="from-spirit-500/20 to-spirit-700/10"
        />
        <NavCard
          href="/meditate"
          icon="◎"
          title="Meditate"
          subtitle="Guided breathing"
          gradient="from-ocean-500/20 to-ocean-700/10"
        />
        <NavCard
          href="/wellness"
          icon="♡"
          title="Wellness"
          subtitle="Check in with yourself"
          gradient="from-sage-500/20 to-sage-700/10"
        />
        <NavCard
          href="/journal"
          icon="✎"
          title="Journal"
          subtitle="Reflect & release"
          gradient="from-warmth-500/20 to-warmth-700/10"
        />
        <NavCard
          href="/friday"
          icon="☽"
          title="Friday"
          subtitle="Talk it through"
          gradient="from-spirit-500/20 to-ocean-500/10"
        />
      </div>

      {/* Gentle footer message */}
      <p className="text-center text-white/15 text-xs mt-16 font-serif italic animate-fade-in-up delay-700" style={{ animationFillMode: "backwards" }}>
        You give so much of yourself to others. This space is yours.
      </p>
    </div>
  );
}

function NavCard({
  href,
  icon,
  title,
  subtitle,
  gradient,
}: {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className={`group glass rounded-2xl p-5 md:p-6 text-center transition-all duration-500 hover:scale-[1.03] hover:border-spirit-400/20 bg-gradient-to-br ${gradient}`}
    >
      <span className="text-2xl md:text-3xl block mb-2 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <h3 className="text-white/80 font-serif text-sm md:text-base mb-0.5">{title}</h3>
      <p className="text-white/30 text-[10px] md:text-xs">{subtitle}</p>
    </Link>
  );
}
