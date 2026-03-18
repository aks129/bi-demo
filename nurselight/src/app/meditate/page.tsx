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

// --- Audio Soundscape Definitions ---

interface Soundscape {
  name: string;
  icon: string;
  description: string;
  color: string;
}

const soundscapes: Soundscape[] = [
  {
    name: "Singing Bowl",
    icon: "🔔",
    description: "Tibetan singing bowl resonance",
    color: "spirit",
  },
  {
    name: "Ocean Waves",
    icon: "🌊",
    description: "Gentle ocean surf and shoreline",
    color: "ocean",
  },
  {
    name: "Rain",
    icon: "🌧️",
    description: "Soft rainfall on quiet ground",
    color: "sage",
  },
  {
    name: "Binaural Calm",
    icon: "🧠",
    description: "Theta binaural beats for deep calm",
    color: "spirit",
  },
  {
    name: "Forest",
    icon: "🌲",
    description: "Wind through leaves and birdsong",
    color: "sage",
  },
  {
    name: "Deep Drone",
    icon: "🕉️",
    description: "Om-like harmonic drone meditation",
    color: "warmth",
  },
];

// --- Audio Engine using Web Audio API ---

class MeditationAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private sources: (AudioBufferSourceNode | OscillatorNode)[] = [];
  private animFrame: number | null = null;
  private isRunning = false;

  start(soundscapeName: string, volume: number) {
    this.stop();
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = volume;
    this.masterGain.connect(this.ctx.destination);
    this.isRunning = true;

    switch (soundscapeName) {
      case "Singing Bowl":
        this.createSingingBowl();
        break;
      case "Ocean Waves":
        this.createOcean();
        break;
      case "Rain":
        this.createRain();
        break;
      case "Binaural Calm":
        this.createBinaural();
        break;
      case "Forest":
        this.createForest();
        break;
      case "Deep Drone":
        this.createDrone();
        break;
    }
  }

  setVolume(v: number) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(v, this.ctx!.currentTime, 0.1);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.sources.forEach((s) => { try { s.stop(); } catch {} });
    this.sources = [];
    this.nodes = [];
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.masterGain = null;
  }

  private createSingingBowl() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    const playBowl = () => {
      if (!this.isRunning) return;
      // Fundamental + harmonics
      const freqs = [261.6, 523.2, 784.8, 1046.4];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq + (Math.random() - 0.5) * 2;
        const amp = 0.15 / (i + 1);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(amp, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6);
        osc.connect(gain);
        gain.connect(master);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 6);
        this.sources.push(osc);
      });

      // Schedule next bowl strike
      setTimeout(() => playBowl(), 5000 + Math.random() * 3000);
    };
    playBowl();
  }

  private createOcean() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    // Brown noise base
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500;

    const gain = ctx.createGain();
    gain.gain.value = 0.3;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    source.start();
    this.sources.push(source);
    this.nodes.push(filter, gain);

    // Modulate filter for wave motion
    const modulate = () => {
      if (!this.isRunning) return;
      const t = ctx.currentTime;
      const wave = Math.sin(t * 0.15) * 0.5 + 0.5;
      filter.frequency.setTargetAtTime(300 + wave * 400, t, 0.5);
      gain.gain.setTargetAtTime(0.15 + wave * 0.2, t, 0.3);
      this.animFrame = requestAnimationFrame(modulate);
    };
    modulate();
  }

  private createRain() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    // White noise through bandpass for rain texture
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 4000;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 10000;

    const gain = ctx.createGain();
    gain.gain.value = 0.12;

    source.connect(hp);
    hp.connect(lp);
    lp.connect(gain);
    gain.connect(master);
    source.start();
    this.sources.push(source);
    this.nodes.push(hp, lp, gain);

    // Soft low rumble underneath
    const rumbleBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const rumbleData = rumbleBuf.getChannelData(0);
    let rl = 0;
    for (let i = 0; i < bufferSize; i++) {
      rl = (rl + 0.01 * (Math.random() * 2 - 1)) / 1.01;
      rumbleData[i] = rl * 5;
    }
    const rumbleSrc = ctx.createBufferSource();
    rumbleSrc.buffer = rumbleBuf;
    rumbleSrc.loop = true;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.06;
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = "lowpass";
    rumbleFilter.frequency.value = 200;
    rumbleSrc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(master);
    rumbleSrc.start();
    this.sources.push(rumbleSrc);

    // Gentle variation
    const modulate = () => {
      if (!this.isRunning) return;
      const t = ctx.currentTime;
      const v = 0.08 + Math.sin(t * 0.1) * 0.04 + Math.sin(t * 0.23) * 0.02;
      gain.gain.setTargetAtTime(v, t, 0.5);
      this.animFrame = requestAnimationFrame(modulate);
    };
    modulate();
  }

  private createBinaural() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    // Theta binaural: 200Hz left, 206Hz right (6Hz theta difference)
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.type = "sine";
    oscR.type = "sine";
    oscL.frequency.value = 200;
    oscR.frequency.value = 206;

    const merger = ctx.createChannelMerger(2);
    const gainL = ctx.createGain();
    const gainR = ctx.createGain();
    gainL.gain.value = 0.2;
    gainR.gain.value = 0.2;

    oscL.connect(gainL);
    oscR.connect(gainR);
    gainL.connect(merger, 0, 0);
    gainR.connect(merger, 0, 1);
    merger.connect(master);

    oscL.start();
    oscR.start();
    this.sources.push(oscL, oscR);
    this.nodes.push(gainL, gainR, merger);

    // Add soft pad underneath
    const padFreqs = [130.8, 196, 261.6];
    padFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 0.03;
      osc.connect(g);
      g.connect(master);
      osc.start();
      this.sources.push(osc);
      this.nodes.push(g);
    });
  }

  private createForest() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    // Wind: filtered noise
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let prev = 0;
    for (let i = 0; i < bufferSize; i++) {
      prev = (prev + 0.04 * (Math.random() * 2 - 1)) / 1.04;
      data[i] = prev * 4;
    }
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buffer;
    windSrc.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "bandpass";
    windFilter.frequency.value = 800;
    windFilter.Q.value = 0.5;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.1;
    windSrc.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);
    windSrc.start();
    this.sources.push(windSrc);
    this.nodes.push(windFilter, windGain);

    // Bird chirps
    const chirp = () => {
      if (!this.isRunning) return;
      const freq = 2000 + Math.random() * 2000;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, ctx.currentTime + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(g);
      g.connect(master);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
      this.sources.push(osc);
      setTimeout(() => chirp(), 3000 + Math.random() * 6000);
    };
    setTimeout(() => chirp(), 1000);
    setTimeout(() => chirp(), 2500);

    // Wind modulation
    const modulate = () => {
      if (!this.isRunning) return;
      const t = ctx.currentTime;
      windFilter.frequency.setTargetAtTime(600 + Math.sin(t * 0.08) * 400, t, 1);
      windGain.gain.setTargetAtTime(0.06 + Math.sin(t * 0.12) * 0.05, t, 0.5);
      this.animFrame = requestAnimationFrame(modulate);
    };
    modulate();
  }

  private createDrone() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const master = this.masterGain;

    // Om drone: fundamental + harmonics
    const fundamental = 130.8; // C3
    const harmonics = [1, 2, 3, 4, 5, 6];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sawtooth" : "sine";
      osc.frequency.value = fundamental * h;
      const g = ctx.createGain();
      g.gain.value = (0.08 / (h * h)) * (i === 0 ? 3 : 1);
      osc.connect(g);
      g.connect(master);
      osc.start();
      this.sources.push(osc);
      this.nodes.push(g);
    });

    // Gentle LFO on the fundamental
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.1;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    // Connect to first oscillator frequency
    if (this.sources[0] instanceof OscillatorNode) {
      lfoGain.connect(this.sources[0].frequency);
    }
    lfo.start();
    this.sources.push(lfo);

    // Low pass to soften
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    // Reconnect through filter
    master.disconnect();
    master.connect(filter);
    filter.connect(ctx.destination);
    this.nodes.push(filter);
  }
}

export default function MeditatePage() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(patterns[0]);
  const [selectedDuration, setSelectedDuration] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Audio state
  const [activeSoundscape, setActiveSoundscape] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState(0.5);
  const audioRef = useRef<MeditationAudio | null>(null);

  useEffect(() => {
    audioRef.current = new MeditationAudio();
    return () => {
      audioRef.current?.stop();
    };
  }, []);

  const toggleSoundscape = useCallback((name: string) => {
    if (activeSoundscape === name) {
      audioRef.current?.stop();
      setActiveSoundscape(null);
    } else {
      audioRef.current?.start(name, audioVolume);
      setActiveSoundscape(name);
    }
  }, [activeSoundscape, audioVolume]);

  const handleVolumeChange = useCallback((v: number) => {
    setAudioVolume(v);
    audioRef.current?.setVolume(v);
  }, []);

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
          const order: BreathPhase[] = ["inhale", "hold", "exhale", "rest"];
          const currentIndex = order.indexOf(phase);
          let nextIndex = (currentIndex + 1) % order.length;
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

  // --- Audio Soundscape Section (shared between views) ---
  const audioSection = (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-[0.2em]">
              Audio Soundscape
            </p>
            {activeSoundscape && (
              <p className="text-white/25 text-xs mt-1 font-serif italic">
                Now playing: {activeSoundscape}
              </p>
            )}
          </div>
          {activeSoundscape && (
            <div className="flex items-center gap-2">
              <span className="text-white/25 text-xs">Vol</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 accent-spirit-400 opacity-50"
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {soundscapes.map((s) => (
            <button
              key={s.name}
              onClick={() => toggleSoundscape(s.name)}
              className={`rounded-xl p-3 text-center transition-all duration-300 ${
                activeSoundscape === s.name
                  ? `bg-${s.color}-500/15 border border-${s.color}-400/30 scale-[1.03]`
                  : "glass hover:bg-white/[0.03]"
              }`}
            >
              <span className="text-xl block mb-1">{s.icon}</span>
              <span className={`text-[10px] block ${
                activeSoundscape === s.name ? "text-white/70" : "text-white/35"
              }`}>
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isComplete) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 gap-8">
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
        {audioSection}
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        {/* Breathing orb */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-12">
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

        {/* Audio controls during session */}
        <div className="w-64 md:w-80 mb-6">
          {audioSection}
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

      {/* Audio Soundscapes */}
      <div className="mb-10 animate-fade-in-up delay-100" style={{ animationFillMode: "backwards" }}>
        <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4 text-center">
          Audio companion — play anytime
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {soundscapes.map((s) => (
            <button
              key={s.name}
              onClick={() => toggleSoundscape(s.name)}
              className={`glass rounded-2xl p-4 text-left transition-all duration-300 ${
                activeSoundscape === s.name
                  ? `border-${s.color}-400/30 bg-${s.color}-500/10 scale-[1.02]`
                  : "hover:border-white/10 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <h3 className={`text-sm font-serif ${
                    activeSoundscape === s.name ? "text-white/80" : "text-white/60"
                  }`}>{s.name}</h3>
                  <p className="text-white/30 text-[10px] mt-0.5">{s.description}</p>
                </div>
              </div>
              {activeSoundscape === s.name && (
                <div className="flex items-center gap-1 mt-3">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-0.5 bg-${s.color}-400/60 rounded-full`}
                        style={{
                          height: `${8 + i * 4}px`,
                          animation: `pulse-soft 1.${i + 2}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30 ml-1">Playing</span>
                </div>
              )}
            </button>
          ))}
        </div>
        {activeSoundscape && (
          <div className="flex items-center justify-center gap-3 mt-4 animate-fade-in-up">
            <span className="text-white/25 text-xs">Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-32 h-1 accent-spirit-400 opacity-60"
            />
            <button
              onClick={() => { audioRef.current?.stop(); setActiveSoundscape(null); }}
              className="text-white/25 text-xs hover:text-white/50 transition-colors ml-2"
            >
              Stop
            </button>
          </div>
        )}
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
