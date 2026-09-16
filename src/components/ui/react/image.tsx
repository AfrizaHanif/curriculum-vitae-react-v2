"use client";

import Image, { StaticImageData, type ImageProps } from "next/image";
import { useState, useId } from "react";
import Modal from "../bootstrap/modal";
import Spinner, { type SpinnerProps } from "../bootstrap/spinner";
import placeholderImage from "@/assets/images/placeholders/placeholder-image.png";

export interface NextImageProps extends ImageProps {
  fallbackSrc?: string | StaticImageData;
  enableZoom?: boolean;
  modalTitle?: string;
  modalSize?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  modalZIndex?: number;
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
  modalSize = "xl",
  modalZIndex = 1090,
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
  const [isModalLoading, setIsModalLoading] = useState(true);
  const uniqueId = useId().replace(/:/g, "_");

  // Adjust state during render when `src` prop changes (React recommended pattern without useEffect)
  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
    setIsLoading(true);
    setIsModalLoading(true);
  }

  const resolvedSrc = hasError && fallbackSrc ? fallbackSrc : src;

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (enableZoom) {
      setIsModalLoading(true);
      setIsModalOpen(true);
    }
    if (onClick) onClick(e);
  };

  const imageElement = (
    <Image
      src={resolvedSrc}
      alt={alt}
      className={`${className || ""} ${isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}`}
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
      {/* Skeleton Shimmer Placeholder */}
      {showSkeleton && isLoading && (
        <div
          className={`position-absolute top-0 start-0 w-100 h-100 bg-body-secondary bg-opacity-50 placeholder-wave ${skeletonClassName || ""}`}
          style={{
            zIndex: 0,
            borderRadius: "inherit",
          }}
          aria-hidden="true"
        />
      )}

      {/* Loading Spinner */}
      {showSpinner && isLoading && (
        <div
          className={`position-absolute top-50 start-50 translate-middle z-1 ${spinnerClassName || ""}`}
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
        <Modal
          id={`modal-image-preview-${uniqueId}`}
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalTitle || alt || "Image Preview"}
          size={modalSize}
          animation={false}
          centered
          scrollable
          style={{ zIndex: modalZIndex }}
          noFooter
        >
          <div
            className="d-flex justify-content-center align-items-center w-100 position-relative rounded overflow-hidden"
            style={{ minHeight: "300px" }}
          >
            {isModalLoading && (
              <>
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 bg-body-secondary bg-opacity-25 placeholder-wave"
                  style={{ zIndex: 0 }}
                  aria-hidden="true"
                />
                <div className="position-absolute top-50 start-50 translate-middle z-1">
                  <Spinner
                    size="lg"
                    color="primary"
                    label={
                      typeof alt === "string" && alt
                        ? `Loading ${alt}...`
                        : "Loading image preview..."
                    }
                  />
                </div>
              </>
            )}
            <Image
              src={resolvedSrc}
              alt={alt || "Enlarged Preview"}
              width={1200}
              height={800}
              className={`transition-opacity duration-300 ${isModalLoading ? "opacity-0" : "opacity-100"}`}
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
                zIndex: 1,
              }}
              onLoad={() => setIsModalLoading(false)}
              onError={() => {
                setHasError(true);
                setIsModalLoading(false);
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
