import { useState, useRef } from "react";
import { useMountEffect } from "./use-mount-effect";

export function useVideoLoop(pauseMs = 8000, initialDelayMs = 2000) {
  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useMountEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let timeout: ReturnType<typeof setTimeout>;
    let disposed = false;

    const safePlay = () => {
      video.currentTime = 0;
      setVideoVisible(true);
      video.play().catch(() => {
        if (!disposed) {
          setVideoVisible(false);
          timeout = setTimeout(safePlay, pauseMs);
        }
      });
    };

    const onEnded = () => {
      if (disposed) return;
      setVideoVisible(false);
      timeout = setTimeout(safePlay, pauseMs);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden — hide video so image shows when tab is restored
        video.pause();
        setVideoVisible(false);
        clearTimeout(timeout);
      } else {
        // Tab visible again — restart cycle after brief delay
        if (!disposed) timeout = setTimeout(safePlay, 500);
      }
    };

    const initialTimeout = setTimeout(safePlay, initialDelayMs);

    video.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      video.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimeout(timeout);
      clearTimeout(initialTimeout);
    };
  });

  return { videoRef, videoVisible };
}
