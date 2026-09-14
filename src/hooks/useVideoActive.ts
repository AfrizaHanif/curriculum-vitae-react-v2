"use client";

import { useEffect, useRef, useState } from "react";

export function useVideoActive() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.05, // Trigger when at least 5% of the video is visible
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlayPause = () => {
      const isPageVisible = document.visibilityState === "visible";
      if (isIntersecting && isPageVisible) {
        video.play().catch(() => {
          // Prevent unhandled promise rejection if autoplay is temporarily blocked by browser policies
        });
      } else {
        video.pause();
      }
    };

    handlePlayPause();

    document.addEventListener("visibilitychange", handlePlayPause);
    return () => {
      document.removeEventListener("visibilitychange", handlePlayPause);
    };
  }, [isIntersecting]);

  return videoRef;
}
