"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  LazyMotion,
  domAnimation,
  m,
  MotionConfig,
} from "motion/react";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { useVideoLoop } from "@/hooks/use-video-loop";
import { useCenterVideoPlay } from "@/hooks/use-center-video-play";
import Magnet from "@/components/ui/magnet";

const SANS  = "var(--font-geist-sans), system-ui, sans-serif";
const DISPLAY = "var(--font-bricolage), var(--font-geist-sans), system-ui, sans-serif";

const BENCH: string[] = [
  "coding + design problem trainer",
  "writing coach that posts to socials",
  "email cleaner, filter and triage",
  "brand direction generator",
];

function FoldedCornerSticky() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMountEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  });

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
      className="absolute bottom-0 left-0 z-[6] h-[238px] w-[330px] max-w-[100vw] pointer-events-none"
      aria-live="polite"
    >
      <m.div
        onPointerEnter={showFromPointer}
        onPointerLeave={hideFromPointer}
        animate={
          open
            ? { opacity: 1, scale: 1, x: 0, y: 0 }
            : { opacity: 0, scale: 0.98, x: 0, y: 8 }
        }
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-12 left-5 origin-bottom-left pointer-events-auto"
        style={{
          width: "min(78vw, 270px)",
          padding: "12px 0 0",
          borderTop: "1px solid rgba(29, 55, 60, 0.22)",
          background: "transparent",
          color: "rgba(23, 45, 50, 0.74)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p
            style={{
              margin: 0,
              fontFamily: SANS,
              fontSize: "0.58rem",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(22, 48, 54, 0.64)",
              lineHeight: 1,
            }}
          >
            on the bench
          </p>
          <span style={{ fontFamily: SANS, fontSize: "0.58rem", color: "rgba(22, 48, 54, 0.42)" }}>
            {BENCH.length}
          </span>
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
                fontSize: "0.72rem",
                color: "rgba(23, 45, 50, 0.68)",
                lineHeight: 1.55,
                paddingLeft: 0,
                position: "relative",
                letterSpacing: 0,
              }}
            >
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
        onBlur={hideSoon}
        onClick={toggle}
        className="absolute bottom-5 left-5 h-5 cursor-default border-0 bg-transparent p-0 pointer-events-auto focus-visible:outline-none"
      >
        <m.span
          animate={open ? { opacity: 0.95 } : { opacity: 0.62 }}
          transition={{ duration: 0.16 }}
          className="block"
          style={{
            color: "rgba(20, 43, 49, 0.78)",
            fontFamily: SANS,
            fontSize: "0.58rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          bench
        </m.span>
      </button>
    </div>
  );
}

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
  { id: 1, title: "thomasbustos.com", image: "/assets/ideas/thomasbustos.webp", video: "/assets/ideas/thomasbustos.mp4",  href: "https://thomasbustos.com",              github: "ThoBustos/thomasbustosv2", x: 7,  y: 25, rotate: -4   },
  { id: 2, title: "AI Native Club",   image: "/assets/ideas/ainativeclub.webp", video: "/assets/ideas/ainativeclub.mp4",  href: "https://www.ainativeclub.com/",         github: "ThoBustos/ainativeclub",   x: 31, y: 31, rotate: 1.5  },
  { id: 3, title: "LearnRep",         image: "/assets/ideas/learnrep.webp",     video: "/assets/ideas/learnrep.mp4",      href: "https://learnrep.ideabench.ai",         github: "ThoBustos/learnrep",       x: 58, y: 24, rotate: -1.5 },
  { id: 4, title: "small.design",      image: "/assets/ideas/smalldesign.png",   video: "/assets/ideas/smalldesign.mp4",   href: "https://small.design",                 github: "ThoBustos/smalldesign",    x: 78, y: 33, rotate: 3.5  },
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
  isTouch,
}: {
  idea: Idea;
  stars: Record<string, number>;
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

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const card = event.currentTarget.querySelector<HTMLElement>(".idea-card-face");
    if (!card) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: px * 9,
      rotateX: py * -8,
      y: -10,
      scale: 1.045,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setVideoVisible(false);

    const card = event.currentTarget.querySelector<HTMLElement>(".idea-card-face");
    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "elastic.out(1, 0.55)",
        overwrite: "auto",
      });
    }
  };

  return (
    <m.div
      className="sky-card-shell hidden md:block absolute z-[3]"
      data-float={idea.id}
      style={{ left: `${idea.x}%`, top: `${idea.y}%` }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Magnet padding={50} magnetStrength={6} disabled={isTouch}>
        <a href={idea.href} target="_blank" rel="noopener noreferrer" className="block group" style={{ perspective: 900 }}>
          <div
            className="idea-card-face relative overflow-hidden"
            style={{
              width:  "clamp(165px, 16.5vw, 240px)",
              height: "clamp(225px, 22.5vw, 330px)",
              borderRadius: 8,
              border: "1px solid rgba(18, 42, 54, 0.18)",
              background:
                "linear-gradient(145deg, rgba(255,255,246,0.42), rgba(91,146,152,0.16))",
              transform: `rotate(${idea.rotate}deg)`,
              transformStyle: "preserve-3d",
              willChange: "transform",
              boxShadow:
                "0 34px 76px rgba(21, 58, 74, 0.25), 0 10px 22px rgba(18, 36, 48, 0.15)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 z-[1] pointer-events-none"
              style={{
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.32), transparent 26%, transparent 72%, rgba(255,255,255,0.18))",
                mixBlendMode: "screen",
              }}
            />
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
              style={{ background: "linear-gradient(to top, rgba(9,15,20,0.72) 0%, rgba(9,15,20,0.18) 38%, transparent 58%)" }}
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <StarBadge count={stars[idea.github]} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span
                className="mb-1.5 block text-white/0 group-hover:text-white/60 transition-colors duration-200"
                style={{ fontFamily: SANS, fontSize: "clamp(0.6875rem, 0.8vw, 0.8125rem)", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Explore
              </span>
              <h3
                style={{
                  fontFamily: DISPLAY,
                  fontSize:   "clamp(1rem, 1.12vw, 1.18rem)",
                  fontWeight: 500,
                  color:      "#fff",
                  textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  lineHeight: 1.08,
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

function MobileOrbitCard({
  idea,
  stars,
  isCenter,
  index,
  setCardRef,
  onSelect,
}: {
  idea: Idea;
  stars: Record<string, number>;
  isCenter: boolean;
  index: number;
  setCardRef: (index: number, node: HTMLDivElement | null) => void;
  onSelect: () => void;
}) {
  const { videoRef, videoVisible } = useCenterVideoPlay(isCenter);

  return (
    <div
      ref={(node) => setCardRef(index, node)}
      className="mobile-orbit-card absolute left-1/2 top-0 h-full"
      style={{ width: "min(72vw, 330px)", willChange: "transform, opacity" }}
    >
      <a
        href={idea.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => {
          if (!isCenter) {
            event.preventDefault();
            onSelect();
          }
        }}
        className="group block h-full focus-visible:outline-none"
        draggable={false}
        aria-current={isCenter ? "true" : undefined}
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            borderRadius: 14,
            border: "1px solid rgba(21, 47, 54, 0.14)",
            boxShadow: "none",
          }}
        >
          <Image
            src={idea.image}
            alt={idea.title}
            fill
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            sizes="72vw"
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
              fontFamily: DISPLAY,
              fontSize:   "1.15rem",
              fontWeight: 550,
              color:      "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              lineHeight: 1.08,
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

function MobileOrbit({
  ideas,
  stars,
}: {
  ideas: Idea[];
  stars: Record<string, number>;
}) {
  const [active, setActive] = useState(0);
  const scopeRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const touchStartX = useRef<number | null>(null);

  const setCardRef = (index: number, node: HTMLDivElement | null) => {
    cardRefs.current[index] = node;
  };

  const select = (index: number) => {
    setActive((index + ideas.length) % ideas.length);
  };

  useGSAP(
    () => {
      const positions = [
        { x: "-50%", y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 4, filter: "blur(0px)" },
        { x: "18%", y: 26, scale: 0.72, rotate: 7, opacity: 0.72, zIndex: 3, filter: "blur(0px)" },
        { x: "-50%", y: -18, scale: 0.58, rotate: 0, opacity: 0, zIndex: 1, filter: "blur(2px)" },
        { x: "-118%", y: 26, scale: 0.72, rotate: -7, opacity: 0.72, zIndex: 3, filter: "blur(0px)" },
      ];

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const offset = (index - active + ideas.length) % ideas.length;
        const position = positions[offset] ?? positions[2];
        gsap.to(card, {
          ...position,
          duration: 0.68,
          ease: "expo.out",
          overwrite: true,
        });
      });
    },
    { scope: scopeRef, dependencies: [active, ideas.length] }
  );

  return (
    <div
      ref={scopeRef}
      className="md:hidden absolute inset-x-0 z-[3] overflow-hidden"
      style={{ top: "23%", height: "38vh", perspective: 1000, touchAction: "pan-y" }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 34) return;
        select(active + (delta < 0 ? 1 : -1));
      }}
    >
      {ideas.map((idea, index) => (
        <MobileOrbitCard
          key={idea.id}
          idea={idea}
          stars={stars}
          isCenter={active === index}
          index={index}
          setCardRef={setCardRef}
          onSelect={() => select(index)}
        />
      ))}
      <div
        className="absolute bottom-1 left-0 right-0 flex justify-center gap-1.5"
        aria-hidden="true"
      >
        {ideas.map((idea, index) => (
          <span
            key={idea.id}
            style={{
              width: active === index ? 16 : 5,
              height: 5,
              borderRadius: 999,
              background: active === index ? "rgba(22, 55, 63, 0.62)" : "rgba(22, 55, 63, 0.24)",
              transition: "width 0.25s ease, background 0.25s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero({ stars = {} }: { stars?: Record<string, number> }) {
  const { videoRef, videoVisible } = useVideoLoop(8000);
  const [isTouch, setIsTouch] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);

  useMountEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  });

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(".brand-char", { yPercent: 92, opacity: 0, rotateX: -45 });
      gsap.set(".brand-subtitle", { opacity: 0, y: 8 });
      gsap.set(".sky-card-shell", { opacity: 0, y: 24, scale: 0.96, rotate: -1.5 });

      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .to(".brand-char", {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.035,
        })
        .to(".brand-subtitle", { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
        .to(
          ".sky-card-shell",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 1.05,
            stagger: { each: 0.11, from: "center" },
          },
          "-=0.12"
        );

      if (!reducedMotion) {
        gsap.utils.toArray<HTMLElement>(".sky-card-shell").forEach((card, index) => {
          gsap.to(card, {
            y: index % 2 === 0 ? -15 : 13,
            x: index === 1 ? 8 : -5,
            rotate: index % 2 === 0 ? 1.4 : -1.1,
            duration: 4.8 + index * 0.65,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 1 + index * 0.3,
          });
        });
      }
    },
    { scope: scopeRef }
  );

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <div
          ref={scopeRef}
          className="relative h-dvh overflow-hidden"
          style={{
            background: "#d8d8d4",
          }}
        >
          {/* ── Static monochrome background ── */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: "url('/assets/hero-bg.webp'), url('/assets/hero-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(1) saturate(0) contrast(1.18) brightness(0.9)",
            }}
          />

          {/* ── Background overlay ── */}
          <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: "rgba(232, 232, 226, 0.2)" }} />

          {/* ── Background video (crossfades over the CSS bg image) ── */}
          <video
            ref={videoRef}
            muted playsInline preload="metadata"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={{
              opacity: videoVisible ? 1 : 0,
              transition: "opacity 1.5s ease",
              filter: "grayscale(1) saturate(0) contrast(1.34) brightness(0.78)",
              mixBlendMode: "normal",
            }}
          >
            <source src="/assets/video/hero-loop.webm" type="video/webm" />
            <source src="/assets/video/hero-loop.mp4"  type="video/mp4"  />
          </video>

          {/* ── Logo + tagline lockup ── */}
          <div className="absolute inset-x-0 z-[5] flex flex-col items-center top-0 md:top-[4%] pt-3 md:pt-0 gap-1.5">
            <h1
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(2.8rem, 9vw, 5.3rem)",
                fontWeight: 600,
                fontStyle: "normal",
                letterSpacing: 0,
                color: "rgba(18, 43, 51, 0.82)",
                lineHeight: 1,
                userSelect: "none",
                margin: 0,
              }}
            >
              <span className="inline-flex overflow-hidden pb-1" aria-label="ideabench">
                {"ideabench".split("").map((char, index) => (
                  <span key={`${char}-${index}`} className="brand-char inline-block">
                    {char}
                  </span>
                ))}
              </span>
            </h1>
            <p
              className="brand-subtitle"
              style={{
                fontFamily: SANS,
                fontSize: "clamp(0.62rem, 0.9vw, 0.78rem)",
                fontStyle: "normal",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(18, 43, 51, 0.66)",
                lineHeight: 1,
                userSelect: "none",
                margin: "0.35rem 0 0",
              }}
            >
              Where my ideas grow.
            </p>
          </div>

          {/* ── Mobile: GSAP orbit carousel ── */}
          <MobileOrbit ideas={IDEAS} stars={stars} />

          {/* ── Desktop: scattered absolute cards ── */}
          {IDEAS.map((idea) => (
            <DesktopCard
              key={idea.id}
              idea={idea}
              stars={stars}
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
