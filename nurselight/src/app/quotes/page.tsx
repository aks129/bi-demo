"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { quotes, shuffleQuotes, categoryLabels, categoryEmoji, type Quote } from "@/lib/quotes";

const categories = Object.keys(categoryLabels) as Quote["category"][];

interface Feeling {
  name: string;
  emoji: string;
  colors: string[];
  prompt: string;
  style: "cosmic" | "water" | "organic" | "heart" | "fire" | "stars";
}

const feelings: Feeling[] = [
  {
    name: "Transcendence",
    emoji: "🌌",
    colors: ["#7c3aed", "#a78bfa", "#c4b5fd", "#312e81", "#1e1b4b", "#4c1d95", "#ddd6fe"],
    prompt: "Rise above. You are infinite awareness witnessing the cosmic dance.",
    style: "cosmic",
  },
  {
    name: "Serenity",
    emoji: "🕊️",
    colors: ["#06b6d4", "#67e8f9", "#a5f3fc", "#164e63", "#0c4a6e", "#0891b2", "#e0f2fe"],
    prompt: "Stillness lives within you. Let the waters of your mind become clear.",
    style: "water",
  },
  {
    name: "Healing",
    emoji: "🌿",
    colors: ["#22c55e", "#86efac", "#bbf7d0", "#14532d", "#052e16", "#16a34a", "#dcfce7"],
    prompt: "Every cell in your body is renewing. You are becoming whole again.",
    style: "organic",
  },
  {
    name: "Love",
    emoji: "💜",
    colors: ["#ec4899", "#f9a8d4", "#fce7f3", "#831843", "#500724", "#db2777", "#fdf2f8"],
    prompt: "Love flows through you like light through crystal — radiant and boundless.",
    style: "heart",
  },
  {
    name: "Courage",
    emoji: "🔥",
    colors: ["#f97316", "#fdba74", "#fed7aa", "#7c2d12", "#431407", "#ea580c", "#fff7ed"],
    prompt: "The fire within you burns brighter than the fire around you.",
    style: "fire",
  },
  {
    name: "Wonder",
    emoji: "✨",
    colors: ["#eab308", "#fde047", "#fef9c3", "#713f12", "#422006", "#ca8a04", "#fefce8"],
    prompt: "The universe is not outside of you. Look inside yourself; everything you want, you already are.",
    style: "stars",
  },
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Seeded pseudo-random for deterministic visuals
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function VisualizationCanvas({ feeling, seed }: { feeling: Feeling; seed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 600;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const colors = feeling.colors;
    const rng = seededRandom(seed);
    let animFrame: number;
    let time = 0;

    // Pre-generate particles with seeded positions
    const particles = Array.from({ length: 80 }, (_, i) => ({
      angle: rng() * Math.PI * 2,
      dist: 40 + rng() * 220,
      size: 0.5 + rng() * 2.5,
      speed: 0.1 + rng() * 0.4,
      phase: rng() * Math.PI * 2,
      color: Math.floor(rng() * 3),
      trail: rng() > 0.6,
    }));

    // Pre-generate nebula blobs
    const nebulae = Array.from({ length: 6 }, () => ({
      x: cx + (rng() - 0.5) * size * 0.7,
      y: cy + (rng() - 0.5) * size * 0.7,
      radius: 60 + rng() * 100,
      color: Math.floor(rng() * 3),
      phase: rng() * Math.PI * 2,
      drift: rng() * 0.3,
    }));

    function drawNebulaLayer() {
      if (!ctx) return;
      for (const n of nebulae) {
        const x = n.x + Math.sin(time * 0.3 + n.phase) * 30 * n.drift;
        const y = n.y + Math.cos(time * 0.2 + n.phase) * 25 * n.drift;
        const r = n.radius + Math.sin(time * 0.4 + n.phase) * 15;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, hexToRgba(colors[n.color], 0.12));
        grad.addColorStop(0.4, hexToRgba(colors[n.color], 0.06));
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    }

    function drawFlowerOfLife(layers: number, baseRadius: number, rotation: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.globalAlpha = 0.08 + Math.sin(time * 0.5) * 0.04;
      ctx.strokeStyle = colors[6] || colors[2];
      ctx.lineWidth = 0.6;

      // Center circle
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Rings of circles
      for (let ring = 1; ring <= layers; ring++) {
        const count = ring === 1 ? 6 : ring * 6;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const d = baseRadius * ring;
          ctx.beginPath();
          ctx.arc(Math.cos(angle) * d, Math.sin(angle) * d, baseRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawSriYantra(scale: number, rotation: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.strokeStyle = hexToRgba(colors[2], 0.1 + Math.sin(time * 0.6) * 0.05);
      ctx.lineWidth = 0.8;

      // Nested triangles
      for (let i = 0; i < 9; i++) {
        const s = scale * (1 - i * 0.09);
        const up = i % 2 === 0;
        ctx.beginPath();
        if (up) {
          ctx.moveTo(0, -s);
          ctx.lineTo(-s * 0.866, s * 0.5);
          ctx.lineTo(s * 0.866, s * 0.5);
        } else {
          ctx.moveTo(0, s);
          ctx.lineTo(-s * 0.866, -s * 0.5);
          ctx.lineTo(s * 0.866, -s * 0.5);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawMetatronsCube(scale: number, rotation: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.strokeStyle = hexToRgba(colors[6] || colors[2], 0.07 + Math.sin(time * 0.4) * 0.03);
      ctx.lineWidth = 0.5;

      // 13 circles of Metatron's Cube
      const points: [number, number][] = [[0, 0]];
      for (let ring = 1; ring <= 2; ring++) {
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
          points.push([Math.cos(angle) * scale * ring * 0.4, Math.sin(angle) * scale * ring * 0.4]);
        }
      }

      // Draw circles
      for (const [px, py] of points) {
        ctx.beginPath();
        ctx.arc(px, py, scale * 0.15, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Connect all points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          ctx.beginPath();
          ctx.moveTo(points[i][0], points[i][1]);
          ctx.lineTo(points[j][0], points[j][1]);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // --- Feeling-specific drawing routines ---

    function drawCosmic() {
      if (!ctx) return;
      // Deep space background with stars
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.7);
      bgGrad.addColorStop(0, "#1a0a2e");
      bgGrad.addColorStop(0.5, colors[4]);
      bgGrad.addColorStop(1, "#050510");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, size, size);

      drawNebulaLayer();

      // Spiral galaxy arms
      ctx.globalCompositeOperation = "screen";
      for (let arm = 0; arm < 3; arm++) {
        const armOffset = (arm / 3) * Math.PI * 2;
        for (let i = 0; i < 200; i++) {
          const t = i / 200;
          const spiralAngle = armOffset + t * Math.PI * 4 + time * 0.15;
          const dist = t * size * 0.38;
          const x = cx + Math.cos(spiralAngle) * dist;
          const y = cy + Math.sin(spiralAngle) * dist;
          const brightness = (1 - t) * 0.5;
          const sz = (1 - t) * 3 + Math.sin(time * 2 + i) * 0.5;
          ctx.beginPath();
          ctx.arc(x, y, sz, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(colors[arm % 3], brightness * (0.3 + Math.sin(time + i * 0.1) * 0.15));
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";

      // Flower of Life sacred geometry
      drawFlowerOfLife(2, 35 + Math.sin(time * 0.3) * 5, time * 0.05);

      // Sri Yantra overlay
      drawSriYantra(120 + Math.sin(time * 0.4) * 10, -time * 0.03);

      // Central eye / third eye portal
      const eyeBreath = Math.sin(time * 0.7);
      const eyeW = 50 + eyeBreath * 12;
      const eyeH = 25 + eyeBreath * 8;
      const eyeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeW);
      eyeGrad.addColorStop(0, hexToRgba(colors[6] || "#fff", 0.7));
      eyeGrad.addColorStop(0.3, hexToRgba(colors[0], 0.4));
      eyeGrad.addColorStop(0.7, hexToRgba(colors[1], 0.15));
      eyeGrad.addColorStop(1, "transparent");
      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      ctx.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI * 2);
      ctx.fillStyle = eyeGrad;
      ctx.fill();
      // Iris
      ctx.beginPath();
      ctx.arc(0, 0, 12 + eyeBreath * 3, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(colors[0], 0.8);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 0, 4 + eyeBreath, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();

      // Concentric aura rings
      for (let i = 0; i < 5; i++) {
        const r = 80 + i * 40 + Math.sin(time * 0.5 + i) * 10;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(colors[i % 3], 0.06 + Math.sin(time * 0.8 + i) * 0.03);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    function drawWater() {
      if (!ctx) return;
      // Deep ocean background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
      bgGrad.addColorStop(0, "#0a1628");
      bgGrad.addColorStop(0.4, colors[4]);
      bgGrad.addColorStop(1, "#020617");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, size, size);

      drawNebulaLayer();

      // Ripple rings emanating from center
      for (let i = 0; i < 12; i++) {
        const phase = time * 0.6 - i * 0.5;
        const r = ((phase % 6) / 6) * size * 0.45;
        if (r < 0) continue;
        const fade = 1 - r / (size * 0.45);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(colors[i % 3], fade * 0.15);
        ctx.lineWidth = 1 + fade * 2;
        ctx.stroke();
      }

      // Flowing sine waves (aurora-like water reflections)
      ctx.globalCompositeOperation = "screen";
      for (let wave = 0; wave < 5; wave++) {
        ctx.beginPath();
        const yBase = size * 0.3 + wave * size * 0.1;
        for (let x = 0; x < size; x += 2) {
          const y = yBase +
            Math.sin(x * 0.015 + time * 0.8 + wave * 1.2) * 30 +
            Math.sin(x * 0.008 + time * 0.5 + wave) * 50 +
            Math.cos(x * 0.025 + time * 1.2) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = hexToRgba(colors[wave % 3], 0.08 + Math.sin(time + wave) * 0.03);
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

      // Lotus / Flower of Life
      drawFlowerOfLife(2, 40 + Math.sin(time * 0.25) * 5, time * 0.02);

      // Central moon/pearl glow
      const moonR = 35 + Math.sin(time * 0.5) * 5;
      const moonGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, moonR * 2.5);
      moonGrad.addColorStop(0, hexToRgba(colors[2], 0.6));
      moonGrad.addColorStop(0.3, hexToRgba(colors[1], 0.2));
      moonGrad.addColorStop(0.6, hexToRgba(colors[0], 0.08));
      moonGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, moonR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, moonR, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(colors[6] || colors[2], 0.5);
      ctx.fill();
    }

    function drawOrganic() {
      if (!ctx) return;
      // Forest floor
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.7);
      bgGrad.addColorStop(0, "#0a1f0a");
      bgGrad.addColorStop(0.5, colors[4]);
      bgGrad.addColorStop(1, "#020a02");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, size, size);

      drawNebulaLayer();

      // Growing vine spirals
      ctx.globalCompositeOperation = "screen";
      for (let vine = 0; vine < 4; vine++) {
        const startAngle = (vine / 4) * Math.PI * 2 + time * 0.1;
        ctx.beginPath();
        for (let t = 0; t < 300; t++) {
          const frac = t / 300;
          const angle = startAngle + frac * Math.PI * 5;
          const r = frac * size * 0.35;
          const wobble = Math.sin(frac * 20 + time * 2) * 5;
          const x = cx + Math.cos(angle) * (r + wobble);
          const y = cy + Math.sin(angle) * (r + wobble);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = hexToRgba(colors[vine % 3], 0.1);
        ctx.lineWidth = 2;
        ctx.stroke();

        // Leaf buds along vine
        for (let l = 0; l < 8; l++) {
          const frac = (l + 1) / 9;
          const angle = startAngle + frac * Math.PI * 5;
          const r = frac * size * 0.35;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          const leafSize = 4 + Math.sin(time * 1.5 + l + vine) * 2;
          ctx.beginPath();
          ctx.ellipse(x, y, leafSize * 2, leafSize, angle, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(colors[1], 0.15 + Math.sin(time + l) * 0.08);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";

      // Metatron's cube as cellular structure
      drawMetatronsCube(150 + Math.sin(time * 0.3) * 15, time * 0.02);

      // Central seed of life glow
      const seedR = 30 + Math.sin(time * 0.6) * 8;
      const seedGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, seedR * 3);
      seedGrad.addColorStop(0, hexToRgba(colors[1], 0.5));
      seedGrad.addColorStop(0.4, hexToRgba(colors[0], 0.15));
      seedGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, seedR * 3, 0, Math.PI * 2);
      ctx.fillStyle = seedGrad;
      ctx.fill();

      // Seed circles
      ctx.strokeStyle = hexToRgba(colors[2], 0.2);
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + time * 0.08;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * seedR, cy + Math.sin(a) * seedR, seedR, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, seedR, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawHeart() {
      if (!ctx) return;
      // Rose/warm background
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.7);
      bgGrad.addColorStop(0, "#1f0a1a");
      bgGrad.addColorStop(0.5, colors[4]);
      bgGrad.addColorStop(1, "#0a0208");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, size, size);

      drawNebulaLayer();

      // Heart-shaped cardioid curve
      ctx.globalCompositeOperation = "screen";
      for (let layer = 0; layer < 5; layer++) {
        const scale = 4 + layer * 1.2 + Math.sin(time * 0.5 + layer) * 0.8;
        ctx.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.02) {
          const r = scale * (1 - Math.sin(t)) * 16;
          const x = cx + r * Math.cos(t + Math.PI / 2);
          const y = cy - r * Math.sin(t + Math.PI / 2) + 20;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = hexToRgba(colors[layer % 3], 0.1 + Math.sin(time * 0.8 + layer) * 0.05);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Pulsing rose petals
      for (let p = 0; p < 8; p++) {
        const angle = (p / 8) * Math.PI * 2 + time * 0.12;
        const breathe = 1 + Math.sin(time * 0.8 + p * 0.7) * 0.15;
        const petalLen = 70 * breathe;
        const petalW = 25 * breathe;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(petalLen * 0.6, 0, petalLen * 0.5, petalW, 0, 0, Math.PI * 2);
        const petalGrad = ctx.createRadialGradient(petalLen * 0.6, 0, 0, petalLen * 0.6, 0, petalLen * 0.5);
        petalGrad.addColorStop(0, hexToRgba(colors[0], 0.18));
        petalGrad.addColorStop(1, "transparent");
        ctx.fillStyle = petalGrad;
        ctx.fill();
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";

      // Flower of Life in heart center
      drawFlowerOfLife(1, 25, time * 0.04);

      // Heart center glow - warm pulse
      const heartPulse = Math.sin(time * 1.2);
      const heartR = 40 + heartPulse * 10;
      const heartGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, heartR * 2.5);
      heartGrad.addColorStop(0, hexToRgba(colors[2], 0.5 + heartPulse * 0.2));
      heartGrad.addColorStop(0.3, hexToRgba(colors[0], 0.2));
      heartGrad.addColorStop(0.7, hexToRgba(colors[1], 0.06));
      heartGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, heartR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = heartGrad;
      ctx.fill();
    }

    function drawFire() {
      if (!ctx) return;
      // Ember background
      const bgGrad = ctx.createRadialGradient(cx, size * 0.7, 0, cx, size * 0.5, size * 0.7);
      bgGrad.addColorStop(0, "#1a0800");
      bgGrad.addColorStop(0.5, colors[4]);
      bgGrad.addColorStop(1, "#050200");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, size, size);

      drawNebulaLayer();

      // Rising flame columns
      ctx.globalCompositeOperation = "screen";
      for (let flame = 0; flame < 5; flame++) {
        const baseX = cx + (flame - 2) * 60;
        ctx.beginPath();
        for (let y = size; y > size * 0.15; y -= 2) {
          const frac = 1 - (y / size);
          const turbulence = Math.sin(y * 0.03 + time * 3 + flame * 2) * (30 * frac) +
            Math.sin(y * 0.07 + time * 5 + flame) * (15 * frac);
          const x = baseX + turbulence;
          const width = (1 - frac * frac) * 20;
          if (y === size) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = hexToRgba(colors[flame % 3], 0.08 + Math.sin(time + flame) * 0.03);
        ctx.lineWidth = 8;
        ctx.stroke();
      }

      // Ember particles rising
      for (let i = 0; i < 60; i++) {
        const rise = (time * 40 + i * 47 + seed * 7) % size;
        const x = cx + Math.sin(rise * 0.02 + i * 1.3) * 120 + Math.sin(time * 2 + i) * 15;
        const y = size - rise;
        const sz = 1 + Math.sin(i + time) * 1;
        const alpha = (1 - rise / size) * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, sz, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(colors[i % 3], alpha);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Sri Yantra - fire element geometry
      drawSriYantra(130 + Math.sin(time * 0.5) * 15, time * 0.04);

      // Central phoenix/flame core
      const flameR = 45 + Math.sin(time * 1.5) * 12;
      const flameGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flameR * 2);
      flameGrad.addColorStop(0, hexToRgba(colors[6] || "#fff8e1", 0.7));
      flameGrad.addColorStop(0.2, hexToRgba(colors[1], 0.4));
      flameGrad.addColorStop(0.5, hexToRgba(colors[0], 0.15));
      flameGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, flameR * 2, 0, Math.PI * 2);
      ctx.fillStyle = flameGrad;
      ctx.fill();
    }

    function drawStars() {
      if (!ctx) return;
      // Night sky
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, size, size);

      // Background star field
      const rng2 = seededRandom(seed * 3);
      for (let i = 0; i < 200; i++) {
        const x = rng2() * size;
        const y = rng2() * size;
        const sz = rng2() * 1.5 + 0.3;
        const twinkle = 0.3 + Math.sin(time * 2 + i * 0.8) * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, sz, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(i % 5 === 0 ? colors[0] : i % 3 === 0 ? colors[1] : "#ffffff", twinkle);
        ctx.fill();
      }

      drawNebulaLayer();

      // Golden ratio spiral
      ctx.globalCompositeOperation = "screen";
      const phi = 1.618033988749;
      ctx.beginPath();
      for (let t = 0; t < 600; t++) {
        const frac = t / 600;
        const angle = frac * Math.PI * 8 + time * 0.15;
        const r = Math.pow(phi, frac * 4) * 3;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hexToRgba(colors[0], 0.2);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Second spiral mirrored
      ctx.beginPath();
      for (let t = 0; t < 600; t++) {
        const frac = t / 600;
        const angle = frac * Math.PI * 8 + time * 0.15 + Math.PI;
        const r = Math.pow(phi, frac * 4) * 3;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = hexToRgba(colors[1], 0.15);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Constellation lines connecting bright particles
      const constellationPts: [number, number][] = [];
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + time * 0.05;
        const r = 60 + i * 15 + Math.sin(time * 0.3 + i) * 10;
        constellationPts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      for (let i = 0; i < constellationPts.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(constellationPts[i][0], constellationPts[i][1]);
        ctx.lineTo(constellationPts[i + 1][0], constellationPts[i + 1][1]);
        ctx.strokeStyle = hexToRgba(colors[1], 0.1);
        ctx.lineWidth = 0.5;
        ctx.stroke();
        // Star node
        ctx.beginPath();
        ctx.arc(constellationPts[i][0], constellationPts[i][1], 2 + Math.sin(time * 2 + i) * 1, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(colors[2], 0.6);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Metatron's cube - wonder/universal geometry
      drawMetatronsCube(140, time * 0.03);

      // Central starburst
      const burstR = 30 + Math.sin(time * 0.6) * 8;
      for (let ray = 0; ray < 12; ray++) {
        const angle = (ray / 12) * Math.PI * 2 + time * 0.1;
        const len = burstR + Math.sin(time * 2 + ray) * 15;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
        ctx.strokeStyle = hexToRgba(colors[0], 0.2 + Math.sin(time + ray) * 0.1);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      const starGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, burstR);
      starGrad.addColorStop(0, hexToRgba(colors[6] || "#fff", 0.7));
      starGrad.addColorStop(0.5, hexToRgba(colors[0], 0.2));
      starGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, burstR, 0, Math.PI * 2);
      ctx.fillStyle = starGrad;
      ctx.fill();
    }

    const drawByStyle: Record<string, () => void> = {
      cosmic: drawCosmic,
      water: drawWater,
      organic: drawOrganic,
      heart: drawHeart,
      fire: drawFire,
      stars: drawStars,
    };

    function draw() {
      if (!ctx || !canvas) return;
      time += 0.006;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, size, size);

      // Draw feeling-specific scene
      const drawFn = drawByStyle[feeling.style];
      if (drawFn) drawFn();

      // Universal floating particles on top
      ctx.globalCompositeOperation = "screen";
      for (const p of particles) {
        const angle = p.angle + time * p.speed;
        const wobble = Math.sin(time * 1.5 + p.phase) * 15;
        const x = cx + Math.cos(angle) * (p.dist + wobble);
        const y = cy + Math.sin(angle) * (p.dist + wobble);
        const alpha = 0.2 + Math.sin(time * 1.2 + p.phase) * 0.2;
        const sz = p.size + Math.sin(time * 2 + p.phase) * 0.5;

        if (p.trail) {
          // Trailing glow
          const trailGrad = ctx.createRadialGradient(x, y, 0, x, y, sz * 4);
          trailGrad.addColorStop(0, hexToRgba(colors[p.color], alpha * 0.6));
          trailGrad.addColorStop(1, "transparent");
          ctx.fillStyle = trailGrad;
          ctx.fillRect(x - sz * 4, y - sz * 4, sz * 8, sz * 8);
        }

        ctx.beginPath();
        ctx.arc(x, y, sz, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(colors[p.color], alpha);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Soft vignette overlay
      const vignetteGrad = ctx.createRadialGradient(cx, cy, size * 0.25, cx, cy, size * 0.5);
      vignetteGrad.addColorStop(0, "transparent");
      vignetteGrad.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, size, size);

      animFrame = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [feeling, seed]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl"
      style={{ maxWidth: 600, maxHeight: 600, aspectRatio: "1" }}
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
            <div className="glass rounded-2xl p-4 md:p-6">
              <div className="flex flex-col items-center gap-5">
                {/* Canvas visualization */}
                <div
                  className="relative w-full flex justify-center overflow-hidden rounded-2xl"
                  style={{
                    background: `radial-gradient(circle, ${selectedFeeling.colors[4]}, #050510)`,
                  }}
                >
                  <VisualizationCanvas feeling={selectedFeeling} seed={visSeed} />
                </div>

                {/* Feeling message */}
                <div className="text-center max-w-md">
                  <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: hexToRgba(selectedFeeling.colors[1], 0.5) }}>
                    {selectedFeeling.emoji} {selectedFeeling.name}
                  </p>
                  <p className="text-lg md:text-xl font-serif italic text-white/75 leading-relaxed mb-4">
                    &ldquo;{selectedFeeling.prompt}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
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
