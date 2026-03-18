"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

interface BreathingPattern {
  name: string;
  description: string;
  icon: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
}

const patterns: BreathingPattern[] = [
  {
    name: "Calming Breath",
    description: "Gentle 4-4-4 pattern to ease anxiety",
    icon: "🌊",
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 0,
  },
  {
    name: "Deep Peace",
    description: "Extended exhale for deep relaxation",
    icon: "🌙",
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 0,
  },
  {
    name: "Nurse's Reset",
    description: "Quick 2-minute reset between shifts",
    icon: "✦",
    inhale: 3,
    hold: 3,
    exhale: 6,
    rest: 2,
  },
  {
    name: "Heart Opening",
    description: "Compassion-focused slow breathing",
    icon: "💛",
    inhale: 5,
    hold: 5,
    exhale: 5,
    rest: 3,
  },
];

const durations = [
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
];

const phaseMessages: Record<BreathPhase, string> = {
  inhale: "Breathe in",
  hold: "Hold gently",
  exhale: "Release slowly",
  rest: "Rest in stillness",
};

export default function MeditatePage() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(patterns[0]);
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phaseDuration = selectedPattern[phase];

  const stop = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setTotalElapsed((prev) => {
        if (prev + 1 >= selectedDuration) {
          stop();
          setIsComplete(true);
          return selectedDuration;
        }
        return prev + 1;
      });

      setPhaseTime((prev) => {
        const currentPhaseDuration = selectedPattern[phase];
        if (prev + 1 >= currentPhaseDuration) {
          // Move to next phase
          const order: BreathPhase[] = ["inhale", "hold", "exhale", "rest"];
          const currentIndex = order.indexOf(phase);
          let nextIndex = (currentIndex + 1) % order.length;
          // Skip phases with 0 duration
          while (selectedPattern[order[nextIndex]] === 0) {
            nextIndex = (nextIndex + 1) % order.length;
          }
          setPhase(order[nextIndex]);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, phase, selectedPattern, selectedDuration, stop]);

  const start = () => {
    setIsActive(true);
    setPhase("inhale");
    setPhaseTime(0);
    setTotalElapsed(0);
    setIsComplete(false);
  };

  const reset = () => {
    stop();
    setPhase("inhale");
    setPhaseTime(0);
    setTotalElapsed(0);
    setIsComplete(false);
  };

  const progress = phaseDuration > 0 ? phaseTime / phaseDuration : 0;
  const totalProgress = totalElapsed / selectedDuration;

  const phaseColor = {
    inhale: "text-ocean-300",
    hold: "text-spirit-300",
    exhale: "text-sage-300",
    rest: "text-warmth-300",
  };

  const orbColor = {
    inhale: "bg-ocean-400/30 shadow-ocean-400/20",
    hold: "bg-spirit-400/30 shadow-spirit-400/20",
    exhale: "bg-sage-400/30 shadow-sage-400/20",
    rest: "bg-warmth-400/30 shadow-warmth-400/20",
  };

  if (isComplete) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        <div className="text-center animate-fade-in-up max-w-md">
          <div className="text-5xl mb-6">🙏</div>
          <h2 className="text-3xl font-serif text-gradient mb-4">Namaste</h2>
          <p className="text-white/50 font-serif italic mb-2">
            You gave yourself {Math.round(selectedDuration / 60)} minutes of peace.
          </p>
          <p className="text-white/30 text-sm mb-8">
            The care you give yourself flows into the care you give others.
          </p>
          <button
            onClick={reset}
            className="px-8 py-3 rounded-full glass-warm text-spirit-200 hover:scale-105 transition-all duration-300"
          >
            Return
          </button>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        {/* Breathing orb */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12">
          {/* Outer ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-white/5 ${
              phase === "inhale" ? "animate-breathe-ring" : ""
            }`}
          />
          <div
            className={`absolute inset-4 rounded-full border border-white/5 ${
              phase === "exhale" ? "animate-breathe-ring" : ""
            } delay-200`}
          />

          {/* Main orb */}
          <div
            className={`w-40 h-40 md:w-52 md:h-52 rounded-full ${orbColor[phase]} transition-all duration-1000 shadow-2xl flex items-center justify-center ${
              phase === "inhale"
                ? "scale-110"
                : phase === "exhale"
                ? "scale-90"
                : "scale-100"
            }`}
            style={{
              transition: `transform ${phaseDuration}s ease-in-out, background-color 1s ease`,
            }}
          >
            <div className="text-center">
              <p className={`text-2xl md:text-3xl font-serif ${phaseColor[phase]} transition-colors duration-500`}>
                {phaseMessages[phase]}
              </p>
              <p className="text-white/30 text-4xl font-light mt-2">
                {phaseDuration - phaseTime}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 md:w-80 mb-6">
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-spirit-400 to-ocean-400 transition-all duration-1000"
              style={{ width: `${totalProgress * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/25">
            <span>{Math.floor(totalElapsed / 60)}:{(totalElapsed % 60).toString().padStart(2, "0")}</span>
            <span>{Math.floor(selectedDuration / 60)}:{(selectedDuration % 60).toString().padStart(2, "0")}</span>
          </div>
        </div>

        {/* Stop button */}
        <button
          onClick={reset}
          className="text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          End session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-up">
        <span className="text-3xl mb-4 block">◎</span>
        <h1 className="text-3xl md:text-4xl font-serif text-gradient mb-3">
          Find Your Stillness
        </h1>
        <p className="text-white/40 font-serif italic">
          Even two minutes can transform your shift
        </p>
      </div>

      {/* Pattern Selection */}
      <div className="mb-10 animate-fade-in-up delay-200" style={{ animationFillMode: "backwards" }}>
        <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4 text-center">
          Choose your breathing pattern
        </p>
        <div className="grid grid-cols-2 gap-3">
          {patterns.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => setSelectedPattern(pattern)}
              className={`glass rounded-2xl p-5 text-left transition-all duration-300 ${
                selectedPattern.name === pattern.name
                  ? "border-spirit-400/30 bg-spirit-500/10 scale-[1.02]"
                  : "hover:border-white/10 hover:bg-white/[0.02]"
              }`}
            >
              <span className="text-xl mb-2 block">{pattern.icon}</span>
              <h3 className="text-white/80 font-serif text-sm mb-1">{pattern.name}</h3>
              <p className="text-white/30 text-xs">{pattern.description}</p>
              <div className="flex gap-2 mt-3 text-[10px] text-white/20">
                <span>In {pattern.inhale}s</span>
                {pattern.hold > 0 && <span>· Hold {pattern.hold}s</span>}
                <span>· Out {pattern.exhale}s</span>
                {pattern.rest > 0 && <span>· Rest {pattern.rest}s</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="mb-12 animate-fade-in-up delay-300" style={{ animationFillMode: "backwards" }}>
        <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4 text-center">
          Duration
        </p>
        <div className="flex justify-center gap-3">
          {durations.map((d) => (
            <button
              key={d.seconds}
              onClick={() => setSelectedDuration(d.seconds)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                selectedDuration === d.seconds
                  ? "bg-spirit-500/20 text-spirit-200 border border-spirit-400/30"
                  : "glass text-white/40 hover:text-white/60"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center animate-fade-in-up delay-500" style={{ animationFillMode: "backwards" }}>
        <button
          onClick={start}
          className="group relative w-32 h-32 rounded-full animate-glow transition-all duration-500 hover:scale-105"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-spirit-500/30 to-ocean-500/20 border border-spirit-400/20" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-spirit-600/20 to-ocean-600/10 border border-spirit-400/10 flex items-center justify-center">
            <span className="text-spirit-200 font-serif text-lg tracking-wider group-hover:text-white transition-colors">
              Begin
            </span>
          </div>
        </button>
        <p className="text-white/20 text-xs mt-6 font-serif italic">
          Close your eyes. Let the world wait.
        </p>
      </div>
    </div>
  );
}
