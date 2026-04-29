import { useState, useRef, useEffect } from "react";

export function useCenterVideoPlay(isCenter: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const showVideo = () => setIsPlaying(true);
    const hideVideo = () => setIsPlaying(false);

    v.addEventListener("playing", showVideo);
    v.addEventListener("pause", hideVideo);
    v.addEventListener("ended", hideVideo);
    v.addEventListener("error", hideVideo);

    return () => {
      v.removeEventListener("playing", showVideo);
      v.removeEventListener("pause", hideVideo);
      v.removeEventListener("ended", hideVideo);
      v.removeEventListener("error", hideVideo);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let disposed = false;

    if (isCenter) {
      v.currentTime = 0;
      v.play().catch(() => {
        if (!disposed) v.pause();
      });
    } else {
      v.pause();
      v.currentTime = 0;
    }

    return () => {
      disposed = true;
    };
  }, [isCenter]);

  return { videoRef, videoVisible: isCenter && isPlaying };
}
