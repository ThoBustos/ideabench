"use client";

import { useState } from "react";
import type { Variants } from "motion/react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  MotionConfig,
} from "motion/react";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { useVideoLoop } from "@/hooks/use-video-loop";

/* ------------------------------------------------------------------ */
/*  Assets                                                             */
/* ------------------------------------------------------------------ */

const SKY_BG = "/assets/hero-bg.png";
const SKY_VIDEO_WEBM = "/assets/video/hero-loop.webm";
const SKY_VIDEO_MP4 = "/assets/video/hero-loop.mp4";

const planeSrcs = [
  "/assets/planes/plane-1.svg",
  "/assets/planes/plane-2.svg",
  "/assets/planes/plane-3.svg",
];

const planes = [
  { src: planeSrcs[0], x: 20, y: 12, w: 55, rot: 10,  parallax: 0.015 },
  { src: planeSrcs[1], x: 70, y: 10, w: 45, rot: -14, parallax: 0.018 },
  { src: planeSrcs[2], x: 12, y: 30, w: 38, rot: 7,   parallax: 0.012 },
  { src: planeSrcs[0], x: 80, y: 28, w: 32, rot: -9,  parallax: 0.01 },
  { src: planeSrcs[1], x: 45, y: 8,  w: 42, rot: 13,  parallax: 0.015 },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RisoBenchHero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { ref, mouse } = useMouseParallax();
  const { videoRef, videoVisible } = useVideoLoop(8000);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div
          ref={ref}
          className="relative flex min-h-dvh flex-col items-center overflow-hidden cursor-default"
          style={{ backgroundColor: "#d4e8e0" }}
        >
          {/* -------- Background: static PNG + video crossfade -------- */}
          <m.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
            style={{
              transform: `translate(${mouse.x * 4}px, ${mouse.y * 3}px) scale(1.03)`,
              transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <picture className="absolute inset-0">
              <source srcSet="/assets/hero-bg.webp" type="image/webp" />
              <img
                src={SKY_BG}
                alt=""
                className="h-full w-full object-cover"
              />
            </picture>
            <video
              ref={videoRef}
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: videoVisible ? 1 : 0,
                transition: "opacity 1.5s ease",
              }}
            >
              <source src={SKY_VIDEO_WEBM} type="video/webm" />
              <source src={SKY_VIDEO_MP4} type="video/mp4" />
            </video>
          </m.div>

          {/* -------- Paper planes — static, gentle parallax on hover -------- */}
          {planes.map((p, i) => (
            <m.div
              key={`plane-${i}`}
              initial={{
                opacity: 0,
                x: i % 2 === 0 ? -120 : 120,
                y: -60,
                rotate: p.rot - 25,
              }}
              animate={{
                opacity: p.w > 40 ? 0.8 : 0.45,
                x: 0,
                y: 0,
                rotate: p.rot,
              }}
              transition={{
                delay: 1.2 + i * 0.25,
                duration: 1.8,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="pointer-events-none absolute z-[2]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.w,
                filter: p.w < 35 ? "blur(0.3px)" : "none",
              }}
            >
              <img
                src={p.src}
                alt=""
                style={{
                  width: "100%",
                  transform: `
                    translate(${mouse.x * p.parallax * 1000}px, ${mouse.y * p.parallax * 1000}px)
                    rotate(${mouse.x * 3}deg)
                  `,
                  transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </m.div>
          ))}

          {/* -------- Text — top area above the figure -------- */}
          <m.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-[4] mt-[6vh] flex max-w-2xl flex-col items-center px-6 text-center"
          >
            <m.h1
              variants={fadeUp}
              className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-tight"
              style={{
                color: "#1a4040",
                textShadow: "0 1px 15px rgba(200,230,220,0.5)",
              }}
            >
              Where my ideas grow.
            </m.h1>

            <m.p
              variants={fadeUp}
              className="mt-5 max-w-md text-lg leading-relaxed"
              style={{ color: "rgba(30,65,65,0.65)" }}
            >
              Vote for the ones that deserve more love.
            </m.p>

            <m.div variants={fadeUp} className="mt-8 w-full max-w-sm">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <m.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="h-12 flex-1 rounded-xl border border-teal-900/10 bg-white/35 px-4 text-sm text-teal-950 placeholder:text-teal-900/35 outline-none backdrop-blur-md transition-all focus:border-teal-900/25 focus:bg-white/50"
                    />
                    <button
                      type="submit"
                      className="h-12 shrink-0 cursor-pointer rounded-xl bg-teal-900/90 px-6 text-sm font-semibold text-teal-50 shadow-lg shadow-teal-900/15 transition-transform hover:scale-[1.03] active:scale-[0.97]"
                    >
                      Notify me
                    </button>
                  </m.form>
                ) : (
                  <m.p
                    key="thanks"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-teal-900/50"
                  >
                    Got it. We&apos;ll let you know when it&apos;s live.
                  </m.p>
                )}
              </AnimatePresence>
            </m.div>
          </m.div>

          {/* -------- Bottom label -------- */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="absolute bottom-6 z-[4] flex items-center gap-2 text-xs text-teal-900/25"
          >
            <span className="tracking-[0.2em] uppercase">ideabench.ai</span>
            <span>·</span>
            <a
              href="https://thomasbustos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-teal-900/50"
            >
              by Thomas Bustos
            </a>
          </m.div>

          {/* -------- Subtle grain overlay -------- */}
          <div
            className="pointer-events-none absolute inset-0 z-[3] opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "256px",
            }}
          />
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
