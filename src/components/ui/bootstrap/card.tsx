"use client";

import React from "react";
import type { StaticImageData } from "next/image";
import NextImage from "../react/image";
import Button from "./button";
import { toggleAllowed } from "@/types/BootstrapAllowed";
import Link from "next/link";

/*  NOTE:
    To fill the children / content of card with correct bootstrap classes, please read docs
    https://getbootstrap.com/docs/5.3/components/card/#:~:text=Card%20body
 */

export interface ListGroupItemProps {
  id: string;
  title: string;
}

export interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  cardColor?:
    | "primary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "transparent";
  borderColor?:
    | "primary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  imgSrc?: string;
  imgPosition?: "top" | "bottom" | "overlay";
  imgWidth?: number;
  imgHeight?: number;
  imgAlt?: string;
  imgGradient?: boolean;
  imgStyle?: React.CSSProperties;
  fallbackSrc?: string | StaticImageData;
  imgLoading?: "lazy" | "eager";
  /** Whether to show a spinner during image loading */
  imgShowSpinner?: boolean;
  linkHref?: string;
  linkToggle?: toggleAllowed;
  linkTarget?: string;
  listGroupItem?: ListGroupItemProps[];
  cardLayout?: "horizontal" | "vertical";
  fullHeight?: boolean;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Card({
  header,
  footer,
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
  linkHref,
  linkToggle,
  linkTarget,
  listGroupItem,
  cardLayout = "vertical",
  fullHeight = false,
  className,
  bodyClassName,
  style,
  children,
  onClick,
}: CardProps) {
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
          {header && <div className="card-header">{header}</div>}
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
          ) : (
            <div className={`card-body ${bodyClassName || ""}`}>
              {children}
              {linkToggle ? linkToggleBtn : linkHref && linkHrefBtn}
            </div>
          )}
          {footer && <div className="card-footer">{footer}</div>}
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
              wrapperClassName="w-100 h-100"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              {children}
              {linkToggle ? linkToggleBtn : linkHref && linkHrefBtn}
            </div>
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
  gap = 4,
  className = "",
}: CardGridProps) {
  const colClasses = [
    `row-cols-${cols}`,
    smCols ? `row-cols-sm-${smCols}` : "",
    mdCols ? `row-cols-md-${mdCols}` : "",
    lgCols ? `row-cols-lg-${lgCols}` : "",
    xlCols ? `row-cols-xl-${xlCols}` : "",
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
