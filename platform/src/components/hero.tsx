"use client";

import React, { useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
} from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { useVideoLoop } from "@/hooks/use-video-loop";
import Magnet from "@/components/ui/magnet";

const SERIF = "var(--font-instrument-serif), Georgia, serif";
const SANS  = "var(--font-geist-sans), system-ui, sans-serif";

const IDEAS = [
  { id: 1, title: "AI Native Club",    image: "/assets/ideas/ghibli.png",   href: "https://thomasbustos.com", x: 4,  y: 21, rotate: -3   },
  { id: 2, title: "The Writing Tool",  image: "/assets/ideas/desk.png",     href: "https://thomasbustos.com", x: 27, y: 28, rotate: 2    },
  { id: 3, title: "The Coding Tool",   image: "/assets/ideas/abstract.png", href: "https://thomasbustos.com", x: 51, y: 20, rotate: -1.5 },
  { id: 4, title: "The Design System", image: "/assets/ideas/window.png",   href: "https://thomasbustos.com", x: 74, y: 26, rotate: 3    },
];

export default function Hero() {
  const { videoRef, videoVisible } = useVideoLoop(8000);
  const [isTouch, setIsTouch] = useState(false);

  useMountEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  });

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, dragFree: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div
          className="relative h-dvh overflow-hidden"
          style={{
            backgroundImage: "url('/assets/hero-bg.webp'), url('/assets/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

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

          {/* ── Logo ── */}
          <div className="absolute inset-x-0 z-[5] flex justify-center top-0 md:top-[4%]">
            <m.img
              src="/assets/logos/logo-c.svg"
              alt="Ideabench"
              style={{ width: "clamp(200px, 88vw, 320px)", height: "auto", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.28)) drop-shadow(0 2px 4px rgba(0,0,0,0.18))" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            />
          </div>

          {/* ── Mobile: Embla carousel ── */}
          <div
            className="md:hidden absolute inset-x-0 z-[3]"
            style={{ top: "22%", height: "38vh" }}
          >
            <div ref={emblaRef} className="overflow-hidden h-full">
              <div className="flex h-full" style={{ marginLeft: "-7vw" }}>
                {IDEAS.map((idea) => (
                  <div
                    key={idea.id}
                    className="relative flex-none h-full"
                    style={{ paddingLeft: "7vw", width: "79vw" }}
                  >
                    <a
                      href={idea.href}
                      className="group block h-full focus-visible:outline-none"
                      draggable={false}
                    >
                      <div
                        className="relative h-full w-full overflow-hidden"
                        style={{
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,0.3)",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
                        }}
                      >
                        <img src={idea.image} alt={idea.title} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
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
              </div>
            </div>
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
              <Magnet padding={50} magnetStrength={6} disabled={isTouch}>
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
                color:      "rgba(17,24,39,0.45)",
                lineHeight: 1.1,
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
