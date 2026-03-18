"use client";

import { useState } from "react";

interface CheckInData {
  energy: number;
  mood: string;
  stressors: string[];
  gratitude: string;
  need: string;
}

const moods = [
  { emoji: "😔", label: "Heavy", color: "text-ocean-300" },
  { emoji: "😐", label: "Numb", color: "text-white/40" },
  { emoji: "🙂", label: "Okay", color: "text-sage-300" },
  { emoji: "😊", label: "Good", color: "text-dawn-300" },
  { emoji: "✨", label: "Radiant", color: "text-warmth-300" },
];

const stressorOptions = [
  "Long shift",
  "Difficult patient",
  "Understaffed",
  "Emotional weight",
  "Sleep deprived",
  "Personal life",
  "Feeling unseen",
  "Physical pain",
];

const affirmations: Record<string, string[]> = {
  "😔": [
    "It is okay to not be okay. You are human first, healer second.",
    "This heaviness is temporary. You have survived every hard day so far.",
    "Your tears water the garden of your compassion. Feel what you feel.",
  ],
  "😐": [
    "Numbness is your mind's way of protecting you. Honor it, then gently return.",
    "You don't have to feel everything all at once. One breath at a time.",
    "Even in stillness, your presence matters more than you know.",
  ],
  "🙂": [
    "Okay is enough. You don't need to perform joy to be worthy.",
    "Steady and present — that is a kind of strength few understand.",
    "You are exactly where you need to be in this moment.",
  ],
  "😊": [
    "Let this goodness soak in. You deserve to feel it fully.",
    "Your light doesn't just help others — it sustains you too.",
    "Hold onto this feeling. It is yours. You earned it.",
  ],
  "✨": [
    "You are glowing. The world is better because you showed up today.",
    "Radiance like yours is rare. Share it freely — it regenerates.",
    "This is your soul remembering its purpose. Beautiful.",
  ],
};

const selfCareIdeas = [
  { icon: "🍵", text: "Make yourself a warm drink and savor every sip" },
  { icon: "🌿", text: "Step outside for 5 minutes of fresh air" },
  { icon: "🎵", text: "Listen to one song that makes you feel alive" },
  { icon: "📱", text: "Text someone you love, just to say hello" },
  { icon: "🧘", text: "Try the 2-minute breathing exercise in Meditate" },
  { icon: "✍️", text: "Write 3 things you're grateful for in your Journal" },
  { icon: "🛁", text: "Tonight, take an extra-long shower or bath" },
  { icon: "💤", text: "Give yourself permission to rest without guilt" },
  { icon: "🌸", text: "Look at something beautiful — a photo, the sky, a flower" },
  { icon: "💛", text: "Place your hand on your heart and say: I am enough" },
];

export default function WellnessPage() {
  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState<Partial<CheckInData>>({
    energy: 5,
    stressors: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [randomCare] = useState(() =>
    selfCareIdeas.sort(() => Math.random() - 0.5).slice(0, 3)
  );

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted && checkIn.mood) {
    const moodAffirmations = affirmations[checkIn.mood] || affirmations["🙂"];
    const randomAffirmation = moodAffirmations[Math.floor(Math.random() * moodAffirmations.length)];

    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="text-5xl mb-4 block">{checkIn.mood}</span>
          <h2 className="text-2xl font-serif text-gradient mb-6">
            Thank you for checking in
          </h2>
          <div className="glass-warm rounded-2xl p-8 mb-8">
            <p className="text-white/70 font-serif italic text-lg leading-relaxed">
              &ldquo;{randomAffirmation}&rdquo;
            </p>
          </div>
        </div>

        {/* Self-care suggestions */}
        <div className="animate-fade-in-up delay-300" style={{ animationFillMode: "backwards" }}>
          <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4 text-center">
            Something gentle for you
          </p>
          <div className="space-y-3">
            {randomCare.map((idea, i) => (
              <div
                key={i}
                className="glass rounded-xl p-4 flex items-center gap-4 animate-fade-in-up"
                style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: "backwards" }}
              >
                <span className="text-2xl">{idea.icon}</span>
                <p className="text-white/60 text-sm font-serif">{idea.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Crisis resources */}
        <div className="mt-12 glass rounded-2xl p-6 animate-fade-in-up delay-700" style={{ animationFillMode: "backwards" }}>
          <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-3">
            If you need more support
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-white/50">
              <span className="text-spirit-300">988 Suicide & Crisis Lifeline:</span> Call or text 988
            </p>
            <p className="text-white/50">
              <span className="text-spirit-300">Crisis Text Line:</span> Text HOME to 741741
            </p>
            <p className="text-white/50">
              <span className="text-spirit-300">Nurse Support Line:</span> 1-800-662-4357
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => { setSubmitted(false); setStep(0); setCheckIn({ energy: 5, stressors: [] }); }}
            className="text-white/30 hover:text-white/50 text-sm transition-colors"
          >
            Check in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-up">
        <span className="text-3xl mb-4 block">♡</span>
        <h1 className="text-3xl md:text-4xl font-serif text-gradient mb-3">
          How Are You, Really?
        </h1>
        <p className="text-white/40 font-serif italic">
          This is a safe space. Be honest with yourself.
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-10">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              s === step
                ? "bg-spirit-400 scale-125"
                : s < step
                ? "bg-spirit-400/40"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Step 0: Mood */}
      {step === 0 && (
        <div className="animate-fade-in-up">
          <p className="text-center text-white/50 font-serif mb-8">
            How does your heart feel right now?
          </p>
          <div className="flex justify-center gap-3 md:gap-5">
            {moods.map((mood) => (
              <button
                key={mood.emoji}
                onClick={() => { setCheckIn({ ...checkIn, mood: mood.emoji }); setStep(1); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  checkIn.mood === mood.emoji
                    ? "glass-warm scale-105"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                <span className="text-3xl md:text-4xl">{mood.emoji}</span>
                <span className={`text-xs ${mood.color}`}>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Energy */}
      {step === 1 && (
        <div className="animate-fade-in-up">
          <p className="text-center text-white/50 font-serif mb-8">
            What&apos;s your energy level?
          </p>
          <div className="glass rounded-2xl p-8">
            <div className="flex justify-between text-xs text-white/30 mb-3">
              <span>Running on empty</span>
              <span>Fully charged</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={checkIn.energy || 5}
              onChange={(e) => setCheckIn({ ...checkIn, energy: parseInt(e.target.value) })}
              className="w-full accent-spirit-400"
            />
            <div className="text-center mt-4">
              <span className="text-3xl">
                {(checkIn.energy || 5) <= 3 ? "🔋" : (checkIn.energy || 5) <= 6 ? "⚡" : "✨"}
              </span>
              <p className="text-white/40 text-sm mt-1">{checkIn.energy || 5}/10</p>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(0)} className="text-white/30 hover:text-white/50 text-sm transition-colors">
              Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 rounded-full glass-warm text-spirit-200 hover:scale-105 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Stressors */}
      {step === 2 && (
        <div className="animate-fade-in-up">
          <p className="text-center text-white/50 font-serif mb-8">
            What&apos;s weighing on you? <span className="text-white/25">(Select any that apply)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {stressorOptions.map((stressor) => {
              const isSelected = checkIn.stressors?.includes(stressor);
              return (
                <button
                  key={stressor}
                  onClick={() => {
                    const current = checkIn.stressors || [];
                    setCheckIn({
                      ...checkIn,
                      stressors: isSelected
                        ? current.filter((s) => s !== stressor)
                        : [...current, stressor],
                    });
                  }}
                  className={`p-3 rounded-xl text-sm text-left transition-all duration-300 ${
                    isSelected
                      ? "glass-warm text-spirit-200 border-spirit-400/30"
                      : "glass text-white/40 hover:text-white/60"
                  }`}
                >
                  {stressor}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="text-white/30 hover:text-white/50 text-sm transition-colors">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 rounded-full glass-warm text-spirit-200 hover:scale-105 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Gratitude */}
      {step === 3 && (
        <div className="animate-fade-in-up">
          <p className="text-center text-white/50 font-serif mb-8">
            Name one small thing you&apos;re grateful for today.
          </p>
          <div className="glass rounded-2xl p-6">
            <textarea
              value={checkIn.gratitude || ""}
              onChange={(e) => setCheckIn({ ...checkIn, gratitude: e.target.value })}
              placeholder="Even the smallest light counts..."
              className="w-full bg-transparent text-white/70 placeholder-white/20 font-serif text-lg leading-relaxed resize-none border-none focus:ring-0 min-h-[100px]"
            />
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(2)} className="text-white/30 hover:text-white/50 text-sm transition-colors">
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-full glass-warm text-spirit-200 hover:scale-105 transition-all animate-glow"
            >
              Complete Check-In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
