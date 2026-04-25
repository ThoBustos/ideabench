"use client";

import {
  useState,
  useRef,
  useEffect,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

export default function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}: MagnetProps) {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);
  const magnetStrengthRef = useRef(magnetStrength);
  const paddingRef = useRef(padding);

  disabledRef.current = disabled;
  magnetStrengthRef.current = magnetStrength;
  paddingRef.current = padding;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;
      if (disabledRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + paddingRef.current && distY < height / 2 + paddingRef.current) {
        setIsActive(true);
        setPosition({
          x: (e.clientX - centerX) / magnetStrengthRef.current,
          y: (e.clientY - centerY) / magnetStrengthRef.current,
        });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolvedPosition = disabled ? { x: 0, y: 0 } : position;
  const innerStyle: CSSProperties = {
    transform: `translate3d(${resolvedPosition.x}px, ${resolvedPosition.y}px, 0)`,
    transition: disabled || !isActive ? inactiveTransition : activeTransition,
    willChange: "transform",
  };

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      {...props}
    >
      <div
        className={innerClassName}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}
