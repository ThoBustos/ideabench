"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
            <span
              aria-label="Ideabench"
              style={{
                fontFamily: FRAUNCES,
                fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "-0.01em",
                color: "rgba(245,240,255,0.92)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              ideabench
            </span>
            <span
              style={{
                fontFamily: FRAUNCES,
                fontSize: "clamp(0.7rem, 1.3vw, 0.9rem)",
                fontStyle: "normal",
                fontWeight: 300,
                color: "rgba(245,240,255,0.52)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              Where my ideas grow.
            </span>
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
            <span>·</span>
            <Link
              href="/font-lab"
              className="tracking-[0.15em] uppercase transition-colors hover:text-teal-900/70"
              style={{ color: "inherit" }}
            >
              font lab
            </Link>
          </div>

        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
