"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
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
import { useCenterVideoPlay } from "@/hooks/use-center-video-play";
import { useEmblaSelected } from "@/hooks/use-embla-selected";
import Magnet from "@/components/ui/magnet";

const SERIF = "var(--font-instrument-serif), Georgia, serif";
const SANS  = "var(--font-geist-sans), system-ui, sans-serif";

const BENCH: string[] = [
  "coding + design problem trainer",
  "writing coach that posts to socials",
  "email cleaner, filter and triage",
  "brand direction generator",
];

function FoldedCornerSticky() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const hideSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const toggle = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen((v) => !v);
  };

  const showFromPointer = (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") show();
  };

  const hideFromPointer = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") hideSoon();
  };

  return (
    <div
      className="absolute bottom-0 left-0 z-[6] h-[230px] w-[330px] max-w-[100vw] pointer-events-none"
      aria-live="polite"
    >
      <m.div
        onPointerEnter={showFromPointer}
        onPointerLeave={hideFromPointer}
        animate={
          open
            ? { opacity: 1, scale: 1, rotate: 1.1, x: 0, y: 0 }
            : { opacity: 0, scale: 0.92, rotate: -3, x: -22, y: 18 }
        }
        transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.7 }}
        className="absolute bottom-9 left-8 origin-bottom-left pointer-events-auto"
        style={{
          width: "min(78vw, 300px)",
          padding: "16px 18px 17px",
          borderRadius: "13px 13px 13px 5px",
          border: "1px solid rgba(255, 255, 255, 0.58)",
          background:
            "linear-gradient(145deg, rgba(255, 254, 240, 0.92) 0%, rgba(248, 249, 232, 0.82) 58%, rgba(222, 243, 240, 0.78) 100%)",
          backdropFilter: "blur(10px) saturate(1.08)",
          boxShadow:
            "0 18px 44px rgba(21, 55, 71, 0.22), 0 1px 0 rgba(255,255,255,0.86) inset",
          color: "rgba(29, 49, 57, 0.86)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-3 top-0 h-px"
          style={{ background: "rgba(255, 255, 255, 0.8)" }}
        />
        <div className="mb-2 flex items-center justify-between gap-3">
          <p
            style={{
              margin: 0,
              fontFamily: FRAUNCES,
              fontSize: "1rem",
              fontWeight: 300,
              color: "rgba(28, 55, 63, 0.78)",
              lineHeight: 1,
            }}
          >
            on the bench
          </p>
          <span
            aria-hidden="true"
            style={{
              height: 6,
              width: 6,
              borderRadius: 999,
              background: "rgba(232, 151, 71, 0.62)",
              boxShadow: "0 0 0 7px rgba(232,151,71,0.08)",
              flex: "0 0 auto",
            }}
          />
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {BENCH.map((idea, index) => (
            <m.li
              key={idea}
              animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
              transition={{
                duration: 0.2,
                delay: open ? 0.04 + index * 0.035 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                fontFamily: SANS,
                fontSize: "0.7rem",
                color: "rgba(25, 45, 54, 0.66)",
                lineHeight: 1.58,
                paddingLeft: "0.95rem",
                position: "relative",
                letterSpacing: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: "0.5em",
                  height: 3,
                  width: 3,
                  borderRadius: 999,
                  background: "rgba(83, 142, 145, 0.46)",
                }}
              />
              {idea}
            </m.li>
          ))}
        </ul>
      </m.div>

      <button
        type="button"
        aria-label={open ? "Hide ideabench notes" : "Show ideabench notes"}
        aria-expanded={open}
        onPointerEnter={showFromPointer}
        onPointerLeave={hideFromPointer}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) show();
        }}
        onClick={(event) => {
          event.preventDefault();
          toggle();
        }}
        className="absolute bottom-0 left-0 h-16 w-16 cursor-default border-0 bg-transparent p-0 pointer-events-auto focus-visible:outline-none"
      >
        <m.span
          aria-hidden="true"
          animate={open ? { width: 68, height: 68 } : { width: 42, height: 42 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute bottom-0 left-0 block"
          style={{
            clipPath: "polygon(0 0, 0 100%, 100% 100%)",
            background:
              "linear-gradient(225deg, rgba(255,255,255,0.18) 0%, rgba(255, 251, 231, 0.88) 48%, rgba(145, 195, 201, 0.52) 100%)",
            filter: "drop-shadow(8px -8px 18px rgba(35, 75, 89, 0.18))",
          }}
        />
        <m.span
          aria-hidden="true"
          animate={open ? { opacity: 1, scale: 1, x: 3, y: -3 } : { opacity: 0.68, scale: 0.84, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute bottom-0 left-0 block h-16 w-16"
          style={{
            background:
              "linear-gradient(45deg, transparent 0 48%, rgba(54, 93, 105, 0.24) 49%, rgba(255,255,255,0.48) 51%, transparent 53%)",
          }}
        />
      </button>
    </div>
  );
}

const FRAUNCES = "var(--font-fraunces), Georgia, serif";

type Idea = {
  id: number;
  title: string;
  image: string;
  video: string;
  href: string;
  github: string;
  x: number;
  y: number;
  rotate: number;
};

const IDEAS: Idea[] = [
  { id: 1, title: "thomasbustos.com", image: "/assets/ideas/thomasbustos.webp", video: "/assets/ideas/thomasbustos.mp4",  href: "https://thomasbustos.com",              github: "ThoBustos/thomasbustosv2", x: 8,  y: 21, rotate: -3   },
  { id: 2, title: "AI Native Club",   image: "/assets/ideas/ainativeclub.webp", video: "/assets/ideas/ainativeclub.mp4",  href: "https://www.ainativeclub.com/",         github: "ThoBustos/ainativeclub",   x: 39, y: 25, rotate: 2    },
  { id: 3, title: "LearnRep",         image: "/assets/ideas/learnrep.webp",     video: "/assets/ideas/learnrep.mp4",      href: "https://learnrep.ideabench.ai",         github: "ThoBustos/learnrep",       x: 67, y: 20, rotate: -1.5 },
];

function StarBadge({ count }: { count: number | undefined }) {
  if (count === undefined) return null;
  const label = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
  return (
    <span
      className="inline-flex items-center gap-1"
      style={{ fontFamily: SANS, fontSize: "0.6875rem", color: "rgba(255,255,255,0.6)" }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {label}
    </span>
  );
}

function DesktopCard({
  idea,
  stars,
  delay,
  isTouch,
}: {
  idea: Idea;
  stars: Record<string, number>;
  delay: number;
  isTouch: boolean;
}) {
  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().then(() => setVideoVisible(true)).catch(() => {});
  };

  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setVideoVisible(false);
  };

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="hidden md:block absolute z-[3]"
      style={{ left: `${idea.x}%`, top: `${idea.y}%` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Magnet padding={50} magnetStrength={6} disabled={isTouch}>
        <a href={idea.href} target="_blank" rel="noopener noreferrer" className="block group">
          <div
            className="relative overflow-hidden"
            style={{
              width:  "clamp(165px, 16.5vw, 240px)",
              height: "clamp(225px, 22.5vw, 330px)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.3)",
              transform: `rotate(${idea.rotate}deg)`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              src={idea.image}
              alt={idea.title}
              fill
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
              sizes="(min-width: 768px) 16.5vw, 79vw"
            />
            {idea.video && (
              <video
                ref={videoRef}
                muted
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: videoVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
              >
                <source src={idea.video} type="video/mp4" />
              </video>
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 35%, transparent 50%)" }}
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <StarBadge count={stars[idea.github]} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span
                className="mb-1.5 block text-white/0 group-hover:text-white/60 transition-colors duration-200"
                style={{ fontFamily: SANS, fontSize: "clamp(0.6875rem, 0.8vw, 0.8125rem)" }}
              >
                Explore
              </span>
              <h3
                style={{
                  fontFamily: SERIF,
                  fontSize:   "clamp(1rem, 1.2vw, 1.25rem)",
                  fontWeight: 400,
                  color:      "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  lineHeight: 1.2,
                }}
              >
                {idea.title}
              </h3>
            </div>
          </div>
        </a>
      </Magnet>
    </m.div>
  );
}

function MobileCard({
  idea,
  stars,
  isCenter,
}: {
  idea: Idea;
  stars: Record<string, number>;
  isCenter: boolean;
}) {
  const { videoRef, videoVisible } = useCenterVideoPlay(isCenter);

  return (
    <div
      className="relative flex-none h-full"
      style={{ paddingLeft: "7vw", width: "79vw" }}
    >
      <a
        href={idea.href}
        target="_blank"
        rel="noopener noreferrer"
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
          <Image
            src={idea.image}
            alt={idea.title}
            fill
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            sizes="79vw"
          />
          {idea.video && (
            <video
              ref={videoRef}
              muted
              playsInline
              loop
              preload="none"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: videoVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
            >
              <source src={idea.video} type="video/mp4" />
            </video>
          )}
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
            <div className="mt-1.5 flex items-center gap-3">
              <span
                className="text-white/70 transition-colors duration-200 group-active:text-white"
                style={{ fontFamily: SANS, fontSize: "0.75rem" }}
              >
                Explore →
              </span>
              <StarBadge count={stars[idea.github]} />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default function Hero({ stars = {} }: { stars?: Record<string, number> }) {
  const { videoRef, videoVisible } = useVideoLoop(8000);
  const [isTouch, setIsTouch] = useState(false);

  useMountEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, dragFree: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const centeredIndex = useEmblaSelected(emblaApi);

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

          {/* ── Background overlay ── */}
          <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: "rgba(90,60,150,0.16)" }} />

          {/* ── Background video (crossfades over the CSS bg image) ── */}
          <video
            ref={videoRef}
            muted playsInline preload="metadata"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={{ opacity: videoVisible ? 1 : 0, transition: "opacity 1.5s ease" }}
          >
            <source src="/assets/video/hero-loop.webm" type="video/webm" />
            <source src="/assets/video/hero-loop.mp4"  type="video/mp4"  />
          </video>

          {/* ── Logo + tagline lockup ── */}
          <div className="absolute inset-x-0 z-[5] flex flex-col items-center top-0 md:top-[4%] pt-3 md:pt-0 gap-1.5">
            <h1
              style={{
                fontFamily: FRAUNCES,
                fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "-0.01em",
                color: "rgba(245,240,255,0.92)",
                lineHeight: 1,
                userSelect: "none",
                margin: 0,
              }}
            >
              ideabench
            </h1>
            <p
              style={{
                fontFamily: FRAUNCES,
                fontSize: "clamp(0.7rem, 1.3vw, 0.9rem)",
                fontStyle: "normal",
                fontWeight: 300,
                color: "rgba(245,240,255,0.52)",
                lineHeight: 1,
                userSelect: "none",
                margin: 0,
              }}
            >
              Where my ideas grow.
            </p>
          </div>

          {/* ── Mobile: Embla carousel ── */}
          <div
            className="md:hidden absolute inset-x-0 z-[3]"
            style={{ top: "22%", height: "38vh" }}
          >
            <div ref={emblaRef} className="overflow-hidden h-full">
              <div className="flex h-full" style={{ marginLeft: "-7vw" }}>
                {IDEAS.map((idea, i) => (
                  <MobileCard
                    key={idea.id}
                    idea={idea}
                    stars={stars}
                    isCenter={centeredIndex === i}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Desktop: scattered absolute cards ── */}
          {IDEAS.map((idea, i) => (
            <DesktopCard
              key={idea.id}
              idea={idea}
              stars={stars}
              delay={0.4 + i * 0.1}
              isTouch={isTouch}
            />
          ))}

          {/* ── Folded corner: on-the-bench ideas ── */}
          <FoldedCornerSticky />

          {/* ── Footer ── */}
          <div
            className="absolute bottom-3 left-0 right-0 z-[5] text-center flex items-center justify-center gap-1.5"
            style={{ fontSize: "0.5625rem", color: "rgba(20,28,45,0.55)", fontFamily: SANS }}
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
