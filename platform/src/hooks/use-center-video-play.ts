import { useState, useRef, useEffect } from "react";

export function useCenterVideoPlay(isCenter: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isCenter) {
      v.currentTime = 0;
      v.play().then(() => setVideoVisible(true)).catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
      setVideoVisible(false);
    }
  }, [isCenter]);

  return { videoRef, videoVisible };
}
