"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import Spinner from "@/components/ui/bootstrap/spinner";
import { getShimmerDataUrl } from "@/lib/shimmer";
import "./gallery-lightbox.css";

export interface GalleryLightboxProps {
  show: boolean;
  images: string[];
  activeIndex: number;
  title?: string;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function GalleryLightbox({
  show,
  images,
  activeIndex,
  title,
  onClose,
  onIndexChange,
}: GalleryLightboxProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isControlled = typeof onIndexChange === "function";
  const [internalIndex, setInternalIndex] = useState(activeIndex);
  const currentIndex = isControlled ? activeIndex : internalIndex;

  const totalImages = images.length;
  const currentImage = images[currentIndex] || images[0];

  const [prevImage, setPrevImage] = useState(currentImage);
  const [isLoading, setIsLoading] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Reset loading indicator when currentImage changes
  if (currentImage !== prevImage) {
    setPrevImage(currentImage);
    setIsLoading(true);
  }

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (totalImages <= 1) return;
      const nextIdx = (currentIndex - 1 + totalImages) % totalImages;
      setIsLoading(true);
      if (isControlled && onIndexChange) {
        onIndexChange(nextIdx);
      } else {
        setInternalIndex(nextIdx);
      }
    },
    [totalImages, currentIndex, isControlled, onIndexChange],
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (totalImages <= 1) return;
      const nextIdx = (currentIndex + 1) % totalImages;
      setIsLoading(true);
      if (isControlled && onIndexChange) {
        onIndexChange(nextIdx);
      } else {
        setInternalIndex(nextIdx);
      }
    },
    [totalImages, currentIndex, isControlled, onIndexChange],
  );

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onClose, handlePrev, handleNext]);

  // Touch swipe gesture navigation for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (!mounted || !show || !currentImage) return null;

  const lightboxContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Image Lightbox"}
      className="gallery-lightbox-overlay"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header Bar */}
      <header
        className="gallery-lightbox-header"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gallery-lightbox-title-wrap">
          <span className="gallery-lightbox-title" title={title}>
            {title || "Screenshot Preview"}
          </span>
          {totalImages > 1 && (
            <span className="gallery-lightbox-badge">
              {currentIndex + 1} / {totalImages}
            </span>
          )}
        </div>

        <div className="gallery-lightbox-actions">
          {/* Open in New Tab Button */}
          {currentImage && (
            <a
              href={currentImage}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-lightbox-action-btn"
              title="Open current image in new tab"
              aria-label="Open current image in new tab"
            >
              <i className="bi bi-box-arrow-up-right small" />
            </a>
          )}

          {/* Close Button */}
          <button
            type="button"
            className="gallery-lightbox-action-btn"
            onClick={onClose}
            title="Close preview (Esc)"
            aria-label="Close preview"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </header>

      {/* Main Image Viewport */}
      <main
        className="gallery-lightbox-viewport"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div
            className="position-absolute top-50 start-50 translate-middle text-center"
            style={{ zIndex: 5 }}
          >
            <Spinner size="lg" color="light" label="Loading image..." />
          </div>
        )}

        {/* Centered Image Container */}
        <div
          className="gallery-lightbox-stage"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            key={`lightbox-img-${currentIndex}`}
            src={currentImage}
            alt={
              title
                ? `${title} (${currentIndex + 1})`
                : `Preview ${currentIndex + 1}`
            }
            width={1920}
            height={1080}
            placeholder="blur"
            blurDataURL={getShimmerDataUrl(1920, 1080)}
            priority
            className="gallery-lightbox-img"
            style={{
              opacity: isLoading ? 0.35 : 1,
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>

        {/* Previous Button */}
        {totalImages > 1 && (
          <button
            type="button"
            className="gallery-lightbox-nav-btn gallery-lightbox-nav-prev"
            onClick={handlePrev}
            title="Previous image (Left arrow)"
            aria-label="Previous image"
          >
            <i className="bi bi-chevron-left fs-5" />
          </button>
        )}

        {/* Next Button */}
        {totalImages > 1 && (
          <button
            type="button"
            className="gallery-lightbox-nav-btn gallery-lightbox-nav-next"
            onClick={handleNext}
            title="Next image (Right arrow)"
            aria-label="Next image"
          >
            <i className="bi bi-chevron-right fs-5" />
          </button>
        )}
      </main>

      {/* Floating Bottom Dot Indicators */}
      {totalImages > 1 && (
        <footer
          className="gallery-lightbox-footer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="gallery-lightbox-dots-capsule">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`gallery-lightbox-dot ${
                  idx === currentIndex ? "active" : ""
                }`}
                onClick={() => {
                  if (idx !== currentIndex) {
                    setIsLoading(true);
                    if (isControlled && onIndexChange) {
                      onIndexChange(idx);
                    } else {
                      setInternalIndex(idx);
                    }
                  }
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </footer>
      )}
    </div>
  );

  return ReactDOM.createPortal(lightboxContent, document.body);
}
