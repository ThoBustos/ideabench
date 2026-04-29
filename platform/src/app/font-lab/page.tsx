"use client";

import { useState } from "react";
import Link from "next/link";

const SANS = "var(--font-geist-sans), system-ui, sans-serif";

const PALETTES = [
  { name: "Warm",   bg: "#F5EDD8", text: "#1C1208", sub: "rgba(28,18,8,0.42)",    dot: "#C9A96E" },
  { name: "Slate",  bg: "#1A1F2E", text: "#E8EDF5", sub: "rgba(232,237,245,0.42)", dot: "#7B9FE0" },
  { name: "Earth",  bg: "#3D1A0A", text: "#F0CAAA", sub: "rgba(240,202,170,0.42)", dot: "#D4845A" },
  { name: "Stone",  bg: "#EEECE9", text: "#2C2926", sub: "rgba(44,41,38,0.42)",   dot: "#8C8078" },
  { name: "Noir",   bg: "#080604", text: "#EBE5E0", sub: "rgba(235,229,224,0.42)", dot: "#6B5E52" },
];

const VARIANTS = [
  {
    key: "playfair",
    name: "Playfair Display",
    label: "High-Contrast Serif",
    font: "var(--font-playfair), Georgia, serif",
    logoWeight: 400,
    logoStyle: "italic" as const,
    logoTracking: "-0.02em",
    taglineFont: "var(--font-playfair), Georgia, serif",
    taglineStyle: "normal" as const,
    taglineWeight: 400,
    defaultPalette: 0,
  },
  {
    key: "fraunces",
    name: "Fraunces",
    label: "Expressive Optical Serif",
    font: "var(--font-fraunces), Georgia, serif",
    logoWeight: 300,
    logoStyle: "italic" as const,
    logoTracking: "-0.01em",
    taglineFont: "var(--font-fraunces), Georgia, serif",
    taglineStyle: "normal" as const,
    taglineWeight: 300,
    defaultPalette: 3,
  },
  {
    key: "syne",
    name: "Syne",
    label: "Geometric Sans",
    font: "var(--font-syne), system-ui, sans-serif",
    logoWeight: 800,
    logoStyle: "normal" as const,
    logoTracking: "0.08em",
    taglineFont: "var(--font-geist-sans), system-ui, sans-serif",
    taglineStyle: "normal" as const,
    taglineWeight: 400,
    defaultPalette: 4,
  },
];

function Panel({
  variant,
  showDivider,
}: {
  variant: (typeof VARIANTS)[0];
  showDivider: boolean;
}) {
  const [pi, setPi] = useState(variant.defaultPalette);
  const p = PALETTES[pi];

  return (
    <div
      className="relative flex-1 flex flex-col items-center justify-center min-h-dvh md:h-dvh"
      style={{
        background: p.bg,
        borderRight: showDivider ? `1px solid ${p.sub}` : "none",
        transition: "background 0.5s ease",
      }}
    >
      {/* Font label */}
      <div
        className="absolute top-6 inset-x-0 text-center"
        style={{
          fontFamily: SANS,
          fontSize: "0.5625rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: p.sub,
          transition: "color 0.5s ease",
        }}
      >
        {variant.name} · {variant.label}
      </div>

      {/* Logo + tagline */}
      <div className="text-center px-6 select-none">
        <div
          style={{
            fontFamily: variant.font,
            fontSize: "clamp(3rem, 6.5vw, 5.5rem)",
            fontWeight: variant.logoWeight,
            fontStyle: variant.logoStyle,
            letterSpacing: variant.logoTracking,
            color: p.text,
            lineHeight: 0.92,
            transition: "color 0.5s ease",
          }}
        >
          ideabench
        </div>
        <div
          style={{
            fontFamily: variant.taglineFont,
            fontSize: "clamp(0.75rem, 1.1vw, 0.9375rem)",
            fontWeight: variant.taglineWeight,
            fontStyle: variant.taglineStyle,
            color: p.sub,
            marginTop: "1rem",
            letterSpacing: "0.01em",
            transition: "color 0.5s ease",
          }}
        >
          Where my ideas grow.
        </div>
      </div>

      {/* Color swatches */}
      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-2">
          {PALETTES.map((pal, i) => (
            <button
              key={pal.name}
              onClick={() => setPi(i)}
              title={pal.name}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: pal.dot,
                border: `2px solid ${i === pi ? p.text : "transparent"}`,
                cursor: "pointer",
                transition: "border-color 0.3s ease",
                flexShrink: 0,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: SANS,
            fontSize: "0.5rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: p.sub,
            transition: "color 0.5s ease",
          }}
        >
          {p.name}
        </span>
      </div>
    </div>
  );
}

export default function FontLab() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:h-dvh md:overflow-hidden">
        {VARIANTS.map((v, i) => (
          <Panel key={v.key} variant={v} showDivider={i < VARIANTS.length - 1} />
        ))}
      </div>
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 transition-opacity hover:opacity-100 opacity-40"
        style={{
          fontFamily: SANS,
          fontSize: "0.5625rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#888",
        }}
      >
        ← back
      </Link>
    </>
  );
}
