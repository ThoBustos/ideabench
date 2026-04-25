"use client";

import React, { useCallback, useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
  useMotionValue,
  animate,
} from "motion/react";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { useVideoLoop } from "@/hooks/use-video-loop";

/* ── Logos ── */
const LOGOS = [
  { id: "a", src: "/assets/logos/logo-a.svg", label: "A — Balloon inflate" },
  { id: "b", src: "/assets/logos/logo-b.svg", label: "B — Balloon inflate 2" },
  { id: "c", src: "/assets/logos/logo-c.svg", label: "C — Whimsical cloud" },
  { id: "d", src: "/assets/logos/logo-d.svg", label: "D — Cumulus wordmark" },
];

/* ── Carousel (same as hero) ── */
const IDEAS = [
  { id: 1, title: "AI Native Club",    image: "/assets/ideas/ghibli.png"   },
  { id: 2, title: "The Writing Tool",  image: "/assets/ideas/desk.png"     },
  { id: 3, title: "The Coding Tool",   image: "/assets/ideas/abstract.png" },
  { id: 4, title: "The Design System", image: "/assets/ideas/window.png"   },
  { id: 5, title: "Feedback Widget",   image: "/assets/ideas/ghibli.png"   },
];

const N       = IDEAS.length;
const TRACK   = [...IDEAS, ...IDEAS, ...IDEAS];
const MID     = N;
const CARD_VW = 72;
const GAP_VW  = 7;
const STEP_VW = CARD_VW + GAP_VW;
const LEFT_VW = (100 - CARD_VW) / 2;
const SPRING  = { type: "spring" as const, stiffness: 55, damping: 18, mass: 1 };
const SERIF   = "'Instrument Serif', Georgia, serif";

function trackToX(idx: number) {
  const vw = window.innerWidth / 100;
  return (LEFT_VW - idx * STEP_VW) * vw;
}

/* ── One panel per logo ── */
function Panel({ logo }: { logo: typeof LOGOS[number] }) {
  const { videoRef, videoVisible } = useVideoLoop(8000);
  const x      = useMotionValue(0);
  const posRef = useRef(MID + 2);
  const isBusy = useRef(false);

  const goTo = useCallback((newIdx: number) => {
    animate(x, trackToX(newIdx), SPRING).then(() => {
      let settled = newIdx;
      if (newIdx >= N * 2) settled = newIdx - N;
      else if (newIdx < N)  settled = newIdx + N;
      if (settled !== newIdx) x.set(trackToX(settled));
      posRef.current = settled;
      isBusy.current = false;
    });
  }, [x]);

  useMountEffect(() => {
    x.set(trackToX(posRef.current));
  });

  useMountEffect(() => {
    const id = setInterval(() => {
      if (isBusy.current) return;
      isBusy.current = true;
      goTo(posRef.current + 1);
    }, 4000);
    return () => clearInterval(id);
  });

  const dragStartX    = useRef<number | null>(null);
  const dragStartMX   = useRef(0);
  const lastPtrSample = useRef<{ x: number; t: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isBusy.current = true;
    dragStartX.current    = e.clientX;
    dragStartMX.current   = x.get();
    lastPtrSample.current = { x: e.clientX, t: Date.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [x]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    x.set(dragStartMX.current + (e.clientX - dragStartX.current));
    lastPtrSample.current = { x: e.clientX, t: Date.now() };
  }, [x]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    let vel = 0;
    if (lastPtrSample.current) {
      const dt = Date.now() - lastPtrSample.current.t;
      if (dt > 0 && dt < 150) vel = (e.clientX - lastPtrSample.current.x) / dt * 1000;
    }
    dragStartX.current = null; lastPtrSample.current = null;
    if      (delta < -40 || vel < -400) goTo(posRef.current + 1);
    else if (delta >  40 || vel >  400) goTo(posRef.current - 1);
    else { isBusy.current = false; animate(x, trackToX(posRef.current), SPRING); }
  }, [goTo, x]);

  const onPointerCancel = useCallback(() => {
    dragStartX.current = null; lastPtrSample.current = null;
    isBusy.current = false;
    animate(x, trackToX(posRef.current), SPRING);
  }, [x]);

  return (
    <div className="relative h-dvh w-full overflow-hidden flex-shrink-0" style={{ backgroundColor: "#d4e8e0" }}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/assets/hero-bg.webp" type="image/webp" />
          <img src="/assets/hero-bg.png" alt="" className="h-full w-full object-cover" />
        </picture>
        <video ref={videoRef} muted playsInline preload="none"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: videoVisible ? 1 : 0, transition: "opacity 1.5s ease" }}>
          <source src="/assets/video/hero-loop.webm" type="video/webm" />
          <source src="/assets/video/hero-loop.mp4"  type="video/mp4"  />
        </video>
      </div>

      {/* Logo */}
      <div className="absolute z-[5] inset-x-0 flex justify-center" style={{ top: "6%" }}>
        <img
          src={logo.src}
          alt="Ideabench"
          style={{ height: "clamp(48px, 10vh, 80px)", width: "auto", maxWidth: "80vw", objectFit: "contain" }}
        />
      </div>

      {/* Label */}
      <div className="absolute z-[6] top-3 left-4 text-[10px] font-mono text-black/30">{logo.label}</div>

      {/* Card carousel */}
      <div className="absolute inset-x-0 z-[3] overflow-hidden" style={{ top: "22%", height: "38vh" }}>
        <m.div
          style={{ x, display: "flex", height: "100%", gap: `${GAP_VW}vw`, touchAction: "none", userSelect: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerCancel}
          onPointerCancel={onPointerCancel}
        >
          {TRACK.map((idea, i) => (
            <div key={`${idea.id}-${i}`} style={{ width: `${CARD_VW}vw`, flexShrink: 0, height: "100%" }}>
              <div className="relative overflow-hidden w-full h-full" style={{
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
              }}>
                <img src={idea.image} alt={idea.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 40%, transparent 55%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 style={{ fontFamily: SERIF, fontSize: "1.15rem", fontWeight: 400, color: "#fff", lineHeight: 1.2 }}>{idea.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </m.div>
      </div>

      {/* Tagline */}
      <div className="absolute inset-0 z-[5] flex items-end justify-center pointer-events-none pb-[30vh]">
        <p className="text-center px-6" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(2.2rem, 5.5vw, 4rem)", fontWeight: 400, color: "#1a1a18", lineHeight: 1.1, textShadow: "0 0 40px rgba(255,255,255,0.3)" }}>
          Where my ideas grow.
        </p>
      </div>
    </div>
  );
}

/* ── Page: 2×2 grid of logos, then full panels below ── */
export default function LogoPick() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>

        {/* Quick comparison grid */}
        <div className="bg-[#d4e8e0] px-6 py-8">
          <p className="mb-4 text-xs font-mono text-teal-900/40 uppercase tracking-widest">Pick a logo — scroll down for full preview</p>
          <div className="grid grid-cols-2 gap-4">
            {LOGOS.map(logo => (
              <a key={logo.id} href={`#panel-${logo.id}`} className="group">
                <div className="rounded-2xl overflow-hidden bg-white/60 border border-white/50 p-4 flex flex-col items-center gap-3 transition hover:bg-white/80">
                  <img src={logo.src} alt="Ideabench" className="w-full h-16 object-contain" />
                  <span className="text-[11px] font-mono text-teal-900/40">{logo.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Full-height panels */}
        {LOGOS.map(logo => (
          <div key={logo.id} id={`panel-${logo.id}`} className="h-dvh">
            <Panel logo={logo} />
          </div>
        ))}
      </LazyMotion>
    </MotionConfig>
  );
}
