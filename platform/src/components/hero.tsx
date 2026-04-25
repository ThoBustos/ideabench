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
import Magnet from "@/components/ui/magnet";

const SERIF = "'Instrument Serif', Georgia, serif";
const SANS  = "var(--font-geist-sans), system-ui, sans-serif";

const IDEAS = [
  { id: 1, title: "AI Native Club",    image: "/assets/ideas/ghibli.png",   href: "https://thomasbustos.com", x: 3,  y: 21, rotate: -3   },
  { id: 2, title: "The Writing Tool",  image: "/assets/ideas/desk.png",     href: "https://thomasbustos.com", x: 20, y: 27, rotate: 2    },
  { id: 3, title: "The Coding Tool",   image: "/assets/ideas/abstract.png", href: "https://thomasbustos.com", x: 58, y: 19, rotate: -1.5 },
  { id: 4, title: "The Design System", image: "/assets/ideas/window.png",   href: "https://thomasbustos.com", x: 76, y: 25, rotate: 3    },
  { id: 5, title: "Feedback Widget",   image: "/assets/ideas/ghibli.png",   href: "https://thomasbustos.com", x: 40, y: 23, rotate: -2   },
];

const N       = IDEAS.length;
// Triple array — start in the middle set so both sides have infinite buffer
const TRACK   = [...IDEAS, ...IDEAS, ...IDEAS];   // 15 items, indices 0-14
const MID     = N;                                // middle set starts at index 5

const CARD_VW = 72;
const GAP_VW  = 7;
const STEP_VW = CARD_VW + GAP_VW;
const LEFT_VW = (100 - CARD_VW) / 2;             // centers a card in viewport

const SPRING  = { type: "spring" as const, stiffness: 55, damping: 18, mass: 1 };

function trackToX(trackIdx: number) {
  const vw = window.innerWidth / 100;
  return (LEFT_VW - trackIdx * STEP_VW) * vw;
}

export default function Hero() {
  const { videoRef, videoVisible } = useVideoLoop(8000);

  const x      = useMotionValue(0);
  const posRef = useRef(MID);           // current track index, starts at middle set
  const isBusy = useRef(false);

  // Animate to newIdx, then silently re-centre in middle set if we drifted
  const goTo = useCallback((newIdx: number) => {
    animate(x, trackToX(newIdx), SPRING).then(() => {
      let settled = newIdx;
      if (newIdx >= N * 2) settled = newIdx - N;
      else if (newIdx < N) settled = newIdx + N;
      if (settled !== newIdx) x.set(trackToX(settled));
      posRef.current = settled;
      isBusy.current = false;
    });
  }, [x]);

  // SSR-safe: start at index 0 (x=0) on server, jump to random mid-set card on client
  useMountEffect(() => {
    const rand = MID + Math.floor(Math.random() * N);
    posRef.current = rand;
    x.set(trackToX(rand));
  });

  // Auto-advance every 4 s
  useMountEffect(() => {
    const id = setInterval(() => {
      if (isBusy.current) return;
      isBusy.current = true;
      goTo(posRef.current + 1);
    }, 4000);
    return () => clearInterval(id);
  });

  // ── Pointer-event drag (reliable on both touch and mouse) ──────────────
  const dragStartX      = useRef<number | null>(null);
  const dragStartMX     = useRef(0);
  const lastPtrSample   = useRef<{ x: number; t: number } | null>(null);

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

    // Estimate velocity from last sample (px/s)
    let vel = 0;
    if (lastPtrSample.current) {
      const dt = Date.now() - lastPtrSample.current.t;
      if (dt > 0 && dt < 150) {
        vel = (e.clientX - lastPtrSample.current.x) / dt * 1000;
      }
    }

    dragStartX.current    = null;
    lastPtrSample.current = null;

    if (delta < -40 || vel < -400) {
      goTo(posRef.current + 1);
    } else if (delta > 40 || vel > 400) {
      goTo(posRef.current - 1);
    } else {
      isBusy.current = false;
      animate(x, trackToX(posRef.current), SPRING);
    }
  }, [goTo, x]);

  const onPointerCancel = useCallback(() => {
    if (dragStartX.current === null) return;
    dragStartX.current    = null;
    lastPtrSample.current = null;
    isBusy.current        = false;
    animate(x, trackToX(posRef.current), SPRING);
  }, [x]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');`}</style>

        <div className="relative h-dvh overflow-hidden">

          {/* ── Background ── */}
          <div className="absolute inset-0 z-0">
            <picture>
              <source srcSet="/assets/hero-bg.webp" type="image/webp" />
              <img src="/assets/hero-bg.png" alt="" className="h-full w-full object-cover" />
            </picture>
            <video
              ref={videoRef}
              muted playsInline preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: videoVisible ? 1 : 0, transition: "opacity 1.5s ease" }}
            >
              <source src="/assets/video/hero-loop.webm" type="video/webm" />
              <source src="/assets/video/hero-loop.mp4"  type="video/mp4"  />
            </video>
          </div>

          {/* ── Logo: mobile large, desktop smaller ── */}
          <div className="absolute inset-x-0 z-[5] flex justify-center" style={{ top: "4%" }}>
            {/* mobile */}
            <img src="/assets/logos/logo-c.svg" alt="Ideabench"
              className="md:hidden" style={{ width: "88vw", height: "auto" }} />
            {/* desktop */}
            <img src="/assets/logos/logo-c.svg" alt="Ideabench"
              className="hidden md:block" style={{ width: "320px", height: "auto" }} />
          </div>

          {/* ── Mobile: swipeable infinite carousel ── */}
          <div
            className="md:hidden absolute inset-x-0 z-[3] overflow-hidden"
            style={{ top: "15%", height: "38vh" }}
          >
            <m.div
              style={{
                x,
                display:     "flex",
                height:      "100%",
                gap:         `${GAP_VW}vw`,
                touchAction: "none",
                cursor:      "grab",
                userSelect:  "none",
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerCancel}
              onPointerCancel={onPointerCancel}
            >
              {TRACK.map((idea, i) => (
                <div
                  key={`${idea.id}-${i}`}
                  style={{ width: `${CARD_VW}vw`, flexShrink: 0, height: "100%" }}
                >
                  <a
                    href={idea.href}
                    className="group block h-full focus-visible:outline-none"
                  >
                    <div
                      className="relative h-full w-full overflow-hidden"
                      style={{
                        borderRadius: 16,
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
                      }}
                    >
                      <img src={idea.image} alt={idea.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 40%, transparent 55%)" }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 style={{
                          fontFamily: SERIF,
                          fontSize:   "1.15rem",
                          fontWeight: 400,
                          color:      "#fff",
                          textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                          lineHeight: 1.2,
                        }}>
                          {idea.title}
                        </h3>
                        <span
                          className="mt-1.5 inline-block text-white/70 transition-colors duration-200 group-active:text-white"
                          style={{ fontFamily: SANS, fontSize: "0.75rem" }}
                        >
                          Explore →
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </m.div>
          </div>

          {/* ── Desktop: scattered absolute cards ── */}
          {IDEAS.map((idea, i) => (
            <m.div
              key={idea.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block absolute z-[3]"
              style={{ left: `${idea.x}%`, top: `${idea.y}%` }}
            >
              <Magnet padding={50} magnetStrength={6}>
                <a href={idea.href} className="block group">
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width:  "clamp(180px, 14vw, 220px)",
                      height: "clamp(240px, 19vw, 300px)",
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.3)",
                      transform: `rotate(${idea.rotate}deg)`,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <img src={idea.image} alt={idea.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 35%, transparent 50%)" }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 style={{
                        fontFamily: SERIF,
                        fontSize:   "clamp(1rem, 1.2vw, 1.25rem)",
                        fontWeight: 400,
                        color:      "#fff",
                        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                        lineHeight: 1.2,
                      }}>
                        {idea.title}
                      </h3>
                      <span
                        className="inline-block mt-1.5 text-white/0 group-hover:text-white/60 transition-colors duration-200"
                        style={{ fontFamily: SANS, fontSize: "clamp(0.6875rem, 0.8vw, 0.8125rem)" }}
                      >
                        Explore →
                      </span>
                    </div>
                  </div>
                </a>
              </Magnet>
            </m.div>
          ))}

          {/* ── Tagline ── */}
          <div className="absolute inset-0 z-[5] flex items-end justify-center pointer-events-none pb-[4vh]">
            <m.h1
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center px-6"
              style={{
                fontFamily: SERIF,
                fontStyle:  "italic",
                fontSize:   "clamp(1rem, 2vw, 1.5rem)",
                fontWeight: 400,
                color:      "rgba(255,255,255,0.9)",
                lineHeight: 1.1,
                textShadow: "0 1px 12px rgba(0,0,0,0.35)",
              }}
            >
              Where my ideas grow.
            </m.h1>
          </div>

          {/* ── Footer ── */}
          <div
            className="absolute bottom-3 left-0 right-0 z-[5] text-center flex items-center justify-center gap-1.5"
            style={{ fontSize: "0.5625rem", color: "rgba(17,24,39,0.45)", fontFamily: SANS }}
          >
            <a
              href="https://ideabench.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="tracking-[0.15em] uppercase transition-colors hover:text-teal-900/70"
              style={{ color: "inherit" }}
            >
              ideabench.ai
            </a>
            <span>·</span>
            <a
              href="https://thomasbustos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-teal-900/70"
              style={{ color: "inherit" }}
            >
              by Thomas Bustos
            </a>
          </div>

        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
