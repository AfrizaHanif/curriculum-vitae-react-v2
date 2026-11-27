"use client";

import React from "react";
import type { StaticImageData } from "next/image";
import NextImage from "../react/image";
import Button from "./button";
import { toggleAllowed } from "@/types/BootstrapAllowed";
import Link from "next/link";
import { getShimmerDataUrl } from "@/lib/shimmer";

/*  NOTE:
    To fill the children / content of card with correct bootstrap classes, please read docs
    https://getbootstrap.com/docs/5.3/components/card/#:~:text=Card%20body
 */

/**
 * Item in a card list group.
 */
export interface ListGroupItemProps {
  /** Unique ID for the item. */
  id: string;
  /** Label/title content displayed in list item. */
  title: string;
}

/**
 * Props for the {@link Card} component.
 */
export interface CardProps {
  /** Optional card header node rendered in `<div className="card-header">`. */
  header?: React.ReactNode;
  headerClassName?: string;
  /** Optional card footer node rendered in `<div className="card-footer">`. */
  footer?: React.ReactNode;
  footerClassName?: string;
  /** Bootstrap background color scheme for the card. */
  cardColor?:
    | "primary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "transparent";
  /** Contextual border color class. */
  borderColor?:
    | "primary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  /** Image source URL for card image. */
  imgSrc?: string;
  /** Position of image: `"top"`, `"bottom"`, or `"overlay"`. Defaults to `"top"`. */
  imgPosition?: "top" | "bottom" | "overlay";
  /** Image display width in pixels. Defaults to 600. */
  imgWidth?: number;
  /** Image display height in pixels. Defaults to 400. */
  imgHeight?: number;
  /** Alt text for accessibility. */
  imgAlt?: string;
  /** Applies a dark gradient overlay on the image. */
  imgGradient?: boolean;
  /** Inline CSS styles for image element. */
  imgStyle?: React.CSSProperties;
  /** Fallback image URL or StaticImageData when image fails to load. */
  fallbackSrc?: string | StaticImageData;
  /** Image loading strategy: `"lazy"` or `"eager"`. */
  imgLoading?: "lazy" | "eager";
  /** Whether to show a spinner during image loading */
  imgShowSpinner?: boolean;
  /** Whether to show a skeleton shimmer placeholder during loading */
  imgShowSkeleton?: boolean;
  /** Image placeholder type ("blur" or "empty") */
  placeholder?: "blur" | "empty";
  /** Custom base64 blurDataURL for the image */
  blurDataURL?: string;
  /** Optional link URL making the card header/image linkable. */
  linkHref?: string;
  /** Bootstrap modal or offcanvas toggle attribute. */
  linkToggle?: toggleAllowed;
  /** Link target attribute (e.g. `"_blank"`). */
  linkTarget?: string;
  /** Optional array of items rendered as a Bootstrap list group inside the card. */
  listGroupItem?: ListGroupItemProps[];
  /** Layout orientation: `"vertical"` (standard) or `"horizontal"` (side-by-side). Defaults to `"vertical"`. */
  cardLayout?: "horizontal" | "vertical";
  /** Forces card to stretch to 100% height (`h-100`). */
  fullHeight?: boolean;
  /** Additional CSS class names applied to the card wrapper. */
  className?: string;
  /** Additional CSS class names applied to the `<div className="card-body">`. */
  bodyClassName?: string;
  /** When true, renders children directly inside the card without wrapping in `<div className="card-body">`. Defaults to `false`. */
  noBody?: boolean;
  /** Inline CSS styles. */
  style?: React.CSSProperties;
  /** Main card body contents. */
  children?: React.ReactNode;
  /** Click event handler on card container. */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Versatile Bootstrap Card component supporting header/footer, image positions (top, bottom, overlay),
 * horizontal layouts, list groups, and Next.js image loading states.
 */
export default function Card({
  header,
  headerClassName,
  footer,
  footerClassName,
  cardColor,
  borderColor,
  imgSrc,
  imgPosition = "top",
  imgWidth = 600,
  imgHeight = 400,
  imgAlt = "",
  imgGradient = false,
  imgStyle,
  fallbackSrc,
  imgLoading = "lazy",
  imgShowSpinner = false,
  imgShowSkeleton = true,
  placeholder = "empty",
  blurDataURL,
  linkHref,
  linkToggle,
  linkTarget,
  listGroupItem,
  cardLayout = "vertical",
  fullHeight = false,
  className,
  bodyClassName,
  noBody = false,
  style,
  children,
  onClick,
}: CardProps) {
  const effectiveBlurDataURL =
    placeholder === "blur"
      ? blurDataURL || getShimmerDataUrl(imgWidth, imgHeight)
      : undefined;
  const bgClass = cardColor
    ? cardColor === "transparent"
      ? "bg-transparent"
      : `text-bg-${cardColor}`
    : "";
  const borderClass = borderColor ? `border-${borderColor}` : "";
  const h1Class = fullHeight ? "h-100" : "";

  const linkToggleBtn = (
    <Button
      className="stretched-link border-0 bg-transparent p-0"
      dataBsToggle={linkToggle}
      dataBsTarget={linkTarget}
    >
      <span className="visually-hidden">Buka</span>
    </Button>
  );

  const linkHrefBtn = (
    // <Link>
    //   href={linkHref || ""}
    //   className="stretched-link border-0 bg-transparent p-0"
    // >
    //   <span className="visually-hidden">Buka</span>
    // </Link>
    <Link
      href={linkHref || "#"}
      className="stretched-link border-0 bg-transparent p-0"
      target={linkTarget}
      aria-label={imgAlt || "Detail link"}
    />
  );

  return (
    <div
      className={`card ${bgClass} ${borderClass} ${h1Class} ${className || ""}`}
      style={{
        ...(onClick ? { cursor: "pointer" } : {}),
        ...style,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (
                e.target === e.currentTarget &&
                (e.key === "Enter" || e.key === " ")
              ) {
                e.preventDefault();
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
    >
      {cardLayout === "vertical" ? (
        <>
          {imgSrc && imgPosition === "top" && (
            <div
              className="card-img-top-wrapper overflow-hidden position-relative bg-body-secondary bg-opacity-50"
              style={{
                borderTopLeftRadius: "inherit",
                borderTopRightRadius: "inherit",
              }}
            >
              <NextImage
                src={imgSrc}
                width={imgWidth}
                height={imgHeight}
                className="card-img-top"
                alt={imgAlt}
                style={{ objectFit: "cover", height: "auto", ...imgStyle }}
                loading={imgLoading}
                fallbackSrc={fallbackSrc}
                showSpinner={imgShowSpinner}
                showSkeleton={imgShowSkeleton}
                placeholder={placeholder}
                blurDataURL={effectiveBlurDataURL}
                wrapperClassName="w-100 h-100"
              />
            </div>
          )}
          {imgSrc && imgPosition === "overlay" && (
            <>
              <div
                className="position-absolute top-0 start-0 w-100 h-100 bg-body-secondary bg-opacity-50 overflow-hidden"
                style={{
                  borderRadius: "inherit",
                  zIndex: 0,
                }}
              >
                <NextImage
                  src={imgSrc}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover", ...imgStyle }}
                  className="card-img"
                  alt={imgAlt}
                  loading={imgLoading}
                  fallbackSrc={fallbackSrc}
                  showSpinner={imgShowSpinner}
                  showSkeleton={imgShowSkeleton}
                  placeholder={placeholder}
                  blurDataURL={effectiveBlurDataURL}
                />
              </div>
              {imgGradient && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                    pointerEvents: "none",
                    borderRadius: "inherit",
                    zIndex: 1,
                  }}
                />
              )}
            </>
          )}
          {header && (
            <div className={`card-header ${headerClassName || ""}`}>
              {header}
            </div>
          )}
          {listGroupItem && (
            <ul className="list-group list-group-flush">
              {listGroupItem?.map((item) => (
                <li className="list-group-item" key={item.id}>
                  {item.title}
                </li>
              ))}
            </ul>
          )}
          {imgSrc && imgPosition === "overlay" ? (
            <div className={`card-img-overlay ${bodyClassName || ""}`}>
              {children}
              {linkToggle ? linkToggleBtn : linkHref && linkHrefBtn}
            </div>
          ) : noBody ? (
            <>
              {children}
              {linkToggle ? linkToggleBtn : linkHref && linkHrefBtn}
            </>
          ) : (
            <div className={`card-body ${bodyClassName || ""}`}>
              {children}
              {linkToggle ? linkToggleBtn : linkHref && linkHrefBtn}
            </div>
          )}
          {footer && (
            <div className={`card-footer ${footerClassName || ""}`}>
              {footer}
            </div>
          )}
          {imgSrc && imgPosition === "bottom" && (
            <div
              className="card-img-bottom-wrapper overflow-hidden position-relative bg-body-secondary bg-opacity-50"
              style={{
                borderBottomLeftRadius: "inherit",
                borderBottomRightRadius: "inherit",
              }}
            >
              <NextImage
                src={imgSrc}
                width={imgWidth}
                height={imgHeight}
                className="card-img-bottom"
                alt={imgAlt}
                style={{ objectFit: "cover", height: "auto", ...imgStyle }}
                loading={imgLoading}
                fallbackSrc={fallbackSrc}
                showSpinner={imgShowSpinner}
                showSkeleton={imgShowSkeleton}
                placeholder={placeholder}
                blurDataURL={effectiveBlurDataURL}
                wrapperClassName="w-100 h-100"
              />
            </div>
          )}
        </>
      ) : (
        <div className="row g-0">
          <div
            className="col-md-4 position-relative overflow-hidden bg-body-secondary bg-opacity-50"
            style={{
              borderTopLeftRadius: "inherit",
              borderBottomLeftRadius: "inherit",
            }}
          >
            <NextImage
              src={imgSrc!}
              width={imgWidth}
              height={imgHeight}
              className="img-fluid rounded-start"
              alt={imgAlt}
              style={{ objectFit: "cover", height: "auto", ...imgStyle }}
              loading={imgLoading}
              fallbackSrc={fallbackSrc}
              showSpinner={imgShowSpinner}
              showSkeleton={imgShowSkeleton}
              placeholder={placeholder}
              blurDataURL={effectiveBlurDataURL}
              wrapperClassName="w-100 h-100"
            />
          </div>
          <div className="col-md-8">
            {noBody ? (
              <>
                {children}
                {linkToggle ? linkToggleBtn : linkHref && linkHrefBtn}
              </>
            ) : (
              <div className={`card-body ${bodyClassName || ""}`}>
                {children}
                {linkToggle ? linkToggleBtn : linkHref && linkHrefBtn}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export interface CardGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function CardGroup({ children, className = "" }: CardGroupProps) {
  return <div className={`card-group ${className}`}>{children}</div>;
}

export interface CardGridProps {
  children: React.ReactNode;
  cols?: number | string;
  smCols?: number | string;
  mdCols?: number | string;
  lgCols?: number | string;
  xlCols?: number | string;
  xxlCols?: number | string;
  gap?: number | string;
  className?: string;
}

export function CardGrid({
  children,
  cols = 1,
  smCols,
  mdCols = 2,
  lgCols,
  xlCols,
  xxlCols,
  gap = 4,
  className = "",
}: CardGridProps) {
  const colClasses = [
    `row-cols-${cols}`,
    smCols ? `row-cols-sm-${smCols}` : "",
    mdCols ? `row-cols-md-${mdCols}` : "",
    lgCols ? `row-cols-lg-${lgCols}` : "",
    xlCols ? `row-cols-xl-${xlCols}` : "",
    xxlCols ? `row-cols-xxl-${xxlCols}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`row ${colClasses} g-${gap} ${className}`}>
      {React.Children.map(children, (child) => {
        if (!child) return null;
        return <div className="col">{child}</div>;
      })}
    </div>
  );
}
