import { useState, useRef } from "react";
import { useMountEffect } from "./use-mount-effect";

/**
 * Plays a video, fades it out when done, waits `pauseMs`,
 * then fades it back in and replays. Static image stays
 * underneath so there's never a flash.
 *
 * Handles browser power-saving interruptions gracefully —
 * if play() is rejected, hides the video and retries next cycle.
 */
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
        // Browser paused video to save power — hide and retry next cycle
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

    const initialTimeout = setTimeout(safePlay, initialDelayMs);

    video.addEventListener("ended", onEnded);
    return () => {
      disposed = true;
      video.removeEventListener("ended", onEnded);
      clearTimeout(timeout);
      clearTimeout(initialTimeout);
    };
  });

  return { videoRef, videoVisible };
}
