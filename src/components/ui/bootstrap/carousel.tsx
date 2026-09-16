"use client";

import { useRef, useEffect } from "react";
import type { Carousel as BootstrapCarousel } from "bootstrap";
import type { StaticImageData } from "next/image";
import NextImage from "../react/image";
import "@/components/ui/bootstrap/carousel.css";

export interface CarouselProps {
  id?: string;
  items: Array<{
    image: string;
    alt: string;
    title?: string;
    description?: string;
    objectPosition?: string;
    fallbackSrc?: string | StaticImageData;
  }>;
  withIndicators?: boolean;
  withControls?: boolean;
  controlsPosition?: "side" | "bottom";
  crossFade?: boolean;
  autoPlay?: "carousel" | "ride" | boolean;
  interval?: number;
  touch?: boolean;
  className?: string;
  indicatorClassName?: string;
  prevBtnClassName?: string;
  nextBtnClassName?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  objectPosition?: string;
  hoverControlsOnly?: boolean;
  fallbackSrc?: string | StaticImageData;
  /**
   * If true, sets priority preloading on the first slide (index === 0).
   * Recommended when Carousel is placed above-the-fold as an LCP candidate.
   */
  priority?: boolean;
  /**
   * If true, displays a loading spinner on each slide image while loading.
   */
  showSpinner?: boolean;
  /**
   * If true, displays a skeleton shimmer placeholder on each slide while loading.
   */
  showSkeleton?: boolean;
  /**
   * If true, enables clicking slide images to open enlarged preview modal.
   */
  enableZoom?: boolean;
}

export default function Carousel({
  id = "carouselExample",
  items,
  withIndicators = true,
  withControls = true,
  controlsPosition = "side",
  crossFade = false,
  autoPlay = "carousel",
  interval = 5000,
  touch = true,
  className = "",
  indicatorClassName = "",
  prevBtnClassName = "",
  nextBtnClassName = "",
  style,
  width = 1200,
  height = 500,
  objectPosition = "center",
  hoverControlsOnly = false,
  fallbackSrc,
  priority = false,
  showSpinner = false,
  showSkeleton = false,
  enableZoom = false,
}: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const isCycling =
    autoPlay === "carousel" || autoPlay === "ride" || autoPlay === true;
  const autoPlayValue =
    autoPlay === true ? "carousel" : autoPlay === false ? undefined : autoPlay;

  const carouselInstanceRef = useRef<BootstrapCarousel | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const isPointerDownRef = useRef<boolean>(false);

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
        },
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
  };

  return (
    <div
      ref={carouselRef}
      id={id}
      className={`carousel slide ${className} ${crossFade ? "carousel-fade" : ""} ${hoverControlsOnly ? "hover-controls-only" : ""}`}
      data-bs-ride={autoPlayValue}
      data-bs-interval={isCycling ? interval : "false"}
      data-bs-touch={touch ? "true" : "false"}
      style={style}
    >
      {controlsPosition === "side" && withIndicators && items.length > 1 && (
        <div className={`carousel-indicators ${indicatorClassName}`}>
          {items.map((_, index) => (
            <button
              type="button"
              data-bs-target={`#${id}`}
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
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {items.map((item, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={index}
          >
            <div className="carousel-image-container position-relative bg-body-secondary bg-opacity-25">
              <NextImage
                src={item.image}
                className="d-block w-100"
                alt={item.alt}
                width={width}
                height={height}
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: `${width} / ${height}`,
                  objectFit: "cover",
                  objectPosition: item.objectPosition || objectPosition,
                }}
                priority={priority && index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                draggable={false}
                fallbackSrc={item.fallbackSrc || fallbackSrc}
                showSpinner={showSpinner}
                showSkeleton={showSkeleton}
                wrapperClassName="w-100 h-100"
                enableZoom={enableZoom}
                modalTitle={item.title || item.alt}
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              {item.title && <h5>{item.title}</h5>}
              {item.description && <p>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
      {controlsPosition === "side" && withControls && items.length > 1 && (
        <>
          <button
            className={`carousel-control-prev ${prevBtnClassName}`}
            type="button"
            data-bs-target={`#${id}`}
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
            data-bs-target={`#${id}`}
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

      {/* Bottom unified navigation bar if controlsPosition is 'bottom' */}
      {controlsPosition === "bottom" &&
        items.length > 1 &&
        (withControls || withIndicators) && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-3 pt-1">
            {withControls && (
              <button
                className={`btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 ${prevBtnClassName}`}
                style={{ width: "36px", height: "36px", zIndex: 5 }}
                type="button"
                data-bs-target={`#${id}`}
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
                {items.map((_, index) => (
                  <button
                    type="button"
                    data-bs-target={`#${id}`}
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
                className={`btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm p-0 ${nextBtnClassName}`}
                style={{ width: "36px", height: "36px", zIndex: 5 }}
                type="button"
                data-bs-target={`#${id}`}
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
