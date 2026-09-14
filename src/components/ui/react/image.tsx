"use client";

import Image, { StaticImageData, type ImageProps } from "next/image";
import { useState, useId } from "react";
import Modal from "../bootstrap/modal";
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
  className,
  onClick,
  style,
  ...rest
}: NextImageProps) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const uniqueId = useId().replace(/:/g, "_");

  // Adjust state during render when `src` prop changes (React recommended pattern without useEffect)
  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
    setIsLoading(true);
  }

  const resolvedSrc = hasError && fallbackSrc ? fallbackSrc : src;

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (enableZoom) {
      setIsModalOpen(true);
    }
    if (onClick) onClick(e);
  };

  return (
    <>
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
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onClick={handleClick}
        {...rest}
      />

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
            className="d-flex justify-content-center align-items-center w-100 position-relative"
            style={{ minHeight: "300px" }}
          >
            <Image
              src={resolvedSrc}
              alt={alt || "Enlarged Preview"}
              width={1200}
              height={800}
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              onError={() => {
                setHasError(true);
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
