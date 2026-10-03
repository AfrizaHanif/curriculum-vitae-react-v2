"use client";

import Image, { StaticImageData, type ImageProps } from "next/image";
import { useState } from "react";
import GalleryLightbox from "@/components/ui/customs/gallery-lightbox";
import Spinner, { type SpinnerProps } from "../bootstrap/spinner";
import placeholderImage from "@/assets/images/placeholders/placeholder-image.png";

export interface NextImageProps extends ImageProps {
  fallbackSrc?: string | StaticImageData;
  enableZoom?: boolean;
  modalTitle?: string;
  /** Automatically scales image to 100% width with auto height to preserve aspect ratio */
  responsive?: boolean;
  /** Controls image fitting (e.g. 'cover', 'contain') */
  objectFit?: React.CSSProperties["objectFit"];
  /** Shows a loading spinner while the image is loading */
  showSpinner?: boolean;
  /** Contextual color for the spinner (defaults to "primary") */
  spinnerColor?: SpinnerProps["color"];
  /** Size of the spinner ("sm", "md", "lg", defaults to "md") */
  spinnerSize?: SpinnerProps["size"];
  /** Animation variant of the spinner ("border" or "grow", defaults to "border") */
  spinnerVariant?: SpinnerProps["variant"];
  /** Optional custom CSS class for the spinner container */
  spinnerClassName?: string;
  /** Shows a subtle skeleton/shimmer placeholder while the image is loading */
  showSkeleton?: boolean;
  /** Optional custom CSS class for the skeleton element */
  skeletonClassName?: string;
  /** Optional custom CSS class for the image wrapper (applied when showSpinner or showSkeleton is enabled) */
  wrapperClassName?: string;
  /** Optional custom inline style for the image wrapper (applied when showSpinner or showSkeleton is enabled) */
  wrapperStyle?: React.CSSProperties;
}

export default function NextImage({
  src,
  alt = "",
  fallbackSrc = placeholderImage,
  enableZoom = false,
  modalTitle,
  responsive = false,
  objectFit,
  showSpinner = false,
  spinnerColor = "primary",
  spinnerSize = "md",
  spinnerVariant = "border",
  spinnerClassName,
  showSkeleton = false,
  skeletonClassName,
  wrapperClassName,
  wrapperStyle,
  className,
  onClick,
  style,
  ...rest
}: NextImageProps) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Adjust state during render when `src` prop changes (React recommended pattern without useEffect)
  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
    setIsLoading(true);
  }

  const resolvedSrc = hasError && fallbackSrc ? fallbackSrc : src;
  const previewImageUrl =
    typeof resolvedSrc === "string"
      ? resolvedSrc
      : "default" in resolvedSrc
        ? resolvedSrc.default.src
        : resolvedSrc.src;

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (enableZoom) {
      setIsModalOpen(true);
    }
    if (onClick) onClick(e);
  };

  const isBlur = rest.placeholder === "blur";
  const transitionClass = isBlur
    ? (isLoading ? "image-blur-loading" : "image-blur-loaded")
    : (isLoading ? "image-fade-loading" : "image-fade-loaded");

  const imageElement = (
    <Image
      src={resolvedSrc}
      alt={alt}
      className={`${className || ""} ${transitionClass}`}
      style={{
        ...(responsive ? { width: "100%", height: "auto" } : {}),
        ...(objectFit ? { objectFit } : {}),
        ...style,
        cursor: enableZoom ? "pointer" : style?.cursor,
      }}
      role={enableZoom ? "button" : undefined}
      tabIndex={enableZoom ? 0 : undefined}
      aria-haspopup={enableZoom ? "dialog" : undefined}
      aria-label={
        enableZoom
          ? typeof alt === "string" && alt
            ? `Enlarge image: ${alt}`
            : "Enlarge image"
          : undefined
      }
      onKeyDown={
        enableZoom
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(e as unknown as React.MouseEvent<HTMLImageElement>);
              }
            }
          : undefined
      }
      onLoad={() => setIsLoading(false)}
      onError={() => {
        setHasError(true);
        setIsLoading(false);
      }}
      onClick={handleClick}
      {...rest}
    />
  );

  const hasWrapper = showSpinner || showSkeleton;

  const renderedContent = hasWrapper ? (
    <div
      className={`position-relative overflow-hidden ${
        rest.fill ? "w-100 h-100" : responsive ? "w-100" : "d-inline-block"
      } ${wrapperClassName || ""}`}
      style={{
        ...(rest.fill ? { position: "absolute", inset: 0 } : {}),
        ...(responsive ? { display: "block" } : {}),
        ...wrapperStyle,
      }}
    >
      {/* Skeleton Shimmer Placeholder with Smooth Cross-Fade */}
      {showSkeleton && (
        <div
          className={`position-absolute top-0 start-0 w-100 h-100 bg-body-secondary bg-opacity-50 placeholder-wave ${skeletonClassName || ""}`}
          style={{
            zIndex: 0,
            borderRadius: "inherit",
            opacity: isLoading ? 1 : 0,
            transition: "opacity 0.4s ease-out",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      )}

      {/* Loading Spinner with Smooth Fade-Out */}
      {showSpinner && (
        <div
          className={`position-absolute top-50 start-50 z-1 ${spinnerClassName || ""}`}
          style={{
            opacity: isLoading ? 1 : 0,
            transform: `translate(-50%, -50%) ${isLoading ? "scale(1)" : "scale(0.85)"}`,
            transition: "opacity 0.35s ease-out, transform 0.35s ease-out",
            pointerEvents: "none",
          }}
          aria-hidden={!isLoading}
        >
          <Spinner
            size={spinnerSize}
            color={spinnerColor}
            variant={spinnerVariant}
            label={typeof alt === "string" && alt ? `Loading ${alt}...` : "Loading image..."}
          />
        </div>
      )}
      {imageElement}
    </div>
  ) : (
    imageElement
  );

  return (
    <>
      {renderedContent}

      {enableZoom && (
        <GalleryLightbox
          show={isModalOpen}
          images={[previewImageUrl]}
          activeIndex={0}
          title={modalTitle || (typeof alt === "string" && alt ? alt : undefined)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
