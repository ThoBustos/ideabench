import { useState, useRef } from "react";
import { useMountEffect } from "./use-mount-effect";

export function useVideoLoop(pauseMs = 8000, initialDelayMs = 2000) {
  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useMountEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const video = videoElement;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    let initialTimeout: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    function clearScheduledPlay() {
      if (timeout) clearTimeout(timeout);
      if (initialTimeout) clearTimeout(initialTimeout);
      timeout = undefined;
      initialTimeout = undefined;
    }

    function schedulePlay(delay: number) {
      clearScheduledPlay();
      timeout = setTimeout(safePlay, delay);
    }

    function safePlay() {
      if (disposed || document.hidden) return;
      video.currentTime = 0;
      setVideoVisible(true);
      video.play().catch(() => {
        if (!disposed) {
          setVideoVisible(false);
          schedulePlay(pauseMs);
        }
      });
    }

    const onEnded = () => {
      if (disposed) return;
      setVideoVisible(false);
      schedulePlay(pauseMs);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        // Keep the static image visible while the tab is backgrounded.
        video.pause();
        setVideoVisible(false);
        clearScheduledPlay();
      } else {
        if (!disposed) schedulePlay(500);
      }
    };

    initialTimeout = setTimeout(safePlay, initialDelayMs);

    video.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      video.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearScheduledPlay();
    };
  });

  return { videoRef, videoVisible };
}
