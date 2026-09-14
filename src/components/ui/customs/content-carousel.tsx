"use client";

import React, { useId, useRef, useEffect } from "react";
import type { Carousel as BootstrapCarousel } from "bootstrap";
import "@/components/ui/bootstrap/carousel.css";
import "./content-carousel.css";

export interface ContentCarouselProps {
  id?: string;
  items?: React.ReactNode[];
  children?: React.ReactNode;
  withIndicators?: boolean;
  withControls?: boolean;
  controlsPosition?: "bottom" | "side";
  crossFade?: boolean;
  autoPlay?: "carousel" | "ride" | boolean;
  interval?: number;
  touch?: boolean;
  className?: string;
  itemClassName?: string;
  indicatorClassName?: string;
  prevBtnClassName?: string;
  nextBtnClassName?: string;
  style?: React.CSSProperties;
}

export default function ContentCarousel({
  id,
  items,
  children,
  withIndicators = true,
  withControls = true,
  controlsPosition = "bottom",
  crossFade = false,
  autoPlay = false,
  interval = 5000,
  touch = true,
  className = "",
  itemClassName = "",
  indicatorClassName = "",
  prevBtnClassName = "",
  nextBtnClassName = "",
  style,
}: ContentCarouselProps) {
  const generatedId = useId().replace(/:/g, "");
  const carouselId = id || `contentCarousel-${generatedId}`;
  const carouselRef = useRef<HTMLDivElement>(null);

  const carouselInstanceRef = useRef<BootstrapCarousel | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const hasDraggedRef = useRef<boolean>(false);
  const isPointerDownRef = useRef<boolean>(false);

  // Extract items from either `items` prop or `children`
  const carouselItems = items || React.Children.toArray(children);

  const isCycling =
    autoPlay === "carousel" || autoPlay === "ride" || autoPlay === true;
  const autoPlayValue =
    autoPlay === true ? "carousel" : autoPlay === false ? undefined : autoPlay;

  useEffect(() => {
    if (!carouselRef.current) return;
    let isMounted = true;

    import("bootstrap").then((bootstrap) => {
      if (!isMounted || !carouselRef.current) return;
      const instance = bootstrap.Carousel.getOrCreateInstance(
        carouselRef.current,
        {
          touch,
          interval: isCycling ? interval : false,
        }
      );
      carouselInstanceRef.current = instance;
    });

    return () => {
      isMounted = false;
      const instance = carouselInstanceRef.current;
      carouselInstanceRef.current = null;
      if (instance) {
        try {
          instance.pause();
          instance.dispose();
        } catch {
          // Ignore disposal errors during unmount
        }
      }
    };
  }, [touch, isCycling, interval]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary) return;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !pointerStartRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    if (Math.abs(deltaX) > 8) {
      hasDraggedRef.current = true;
    }
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !pointerStartRef.current) {
      isPointerDownRef.current = false;
      return;
    }

    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    const elapsed = Date.now() - pointerStartRef.current.time;

    isPointerDownRef.current = false;
    pointerStartRef.current = null;

    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 0.8;
    const isSwipe = Math.abs(deltaX) > 35;
    const isFlick = elapsed < 350 && Math.abs(deltaX) > 20;

    if (isHorizontal && (isSwipe || isFlick)) {
      if (deltaX < 0) {
        carouselInstanceRef.current?.next();
      } else {
        carouselInstanceRef.current?.prev();
      }
    }

    if (hasDraggedRef.current) {
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 80);
    }
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (carouselItems.length === 0) return null;

  return (
    <div
      ref={carouselRef}
      id={carouselId}
      className={`carousel slide ${className} ${crossFade ? "carousel-fade" : ""}`}
      data-bs-ride={autoPlayValue}
      data-bs-interval={isCycling ? interval : "false"}
      data-bs-touch={touch ? "true" : "false"}
      style={style}
    >
      {/* Side floating indicators if controlsPosition is 'side' */}
      {controlsPosition === "side" && withIndicators && carouselItems.length > 1 && (
        <div className={`carousel-indicators ${indicatorClassName}`}>
          {carouselItems.map((_, index) => (
            <button
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Slide ${index + 1}`}
              key={index}
            ></button>
          ))}
        </div>
      )}

      <div
        className="carousel-inner"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        {carouselItems.map((item, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""} ${itemClassName}`}
            key={index}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Side floating controls if controlsPosition is 'side' */}
      {controlsPosition === "side" && withControls && carouselItems.length > 1 && (
        <>
          <button
            className={`carousel-control-prev ${prevBtnClassName}`}
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className={`carousel-control-next ${nextBtnClassName}`}
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}

      {/* Bottom unified navigation bar: avoids overlapping cards on mobile and side-nav on tablet */}
      {controlsPosition === "bottom" && carouselItems.length > 1 && (withControls || withIndicators) && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 pt-1">
          {withControls && (
            <button
              className={`content-carousel-btn ${prevBtnClassName}`}
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide="prev"
              aria-label="Previous slide"
            >
              <i className="bi bi-chevron-left" />
            </button>
          )}

          {withIndicators && (
            <div
              className={`carousel-indicators position-static m-0 d-flex align-items-center ${indicatorClassName}`}
            >
              {carouselItems.map((_, index) => (
                <button
                  type="button"
                  data-bs-target={`#${carouselId}`}
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : undefined}
                  aria-label={`Slide ${index + 1}`}
                  key={index}
                ></button>
              ))}
            </div>
          )}

          {withControls && (
            <button
              className={`content-carousel-btn ${nextBtnClassName}`}
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide="next"
              aria-label="Next slide"
            >
              <i className="bi bi-chevron-right" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
