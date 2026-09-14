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
  imgAlt = "Card image",
  imgGradient = false,
  imgStyle,
  fallbackSrc,
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
    <Link
      href={linkHref || ""}
      className="stretched-link border-0 bg-transparent p-0"
    >
      <span className="visually-hidden">Buka</span>
    </Link>
  );

  return (
    <div
      className={`card ${bgClass} ${borderClass} ${h1Class} ${className || ""}`}
      style={{
        ...(onClick ? { cursor: "pointer" } : {}),
        ...style,
      }}
      onClick={onClick}
    >
      {cardLayout === "vertical" ? (
        <>
          {imgSrc && imgPosition === "top" && (
            <NextImage
              src={imgSrc}
              width={imgWidth}
              height={imgHeight}
              className="card-img-top"
              alt={imgAlt}
              style={{ objectFit: "cover", height: "auto", ...imgStyle }}
              loading="eager"
              fallbackSrc={fallbackSrc}
            />
          )}
          {imgSrc && imgPosition === "overlay" && (
            <>
              <NextImage
                src={imgSrc}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover", ...imgStyle }}
                className="card-img"
                alt={imgAlt}
                loading="eager"
                fallbackSrc={fallbackSrc}
              />
              {imgGradient && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 rounded"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                    pointerEvents: "none",
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
            <NextImage
              src={imgSrc}
              width={imgWidth}
              height={imgHeight}
              className="card-img-bottom"
              alt={imgAlt}
              style={{ objectFit: "cover", height: "auto", ...imgStyle }}
              loading="eager"
              fallbackSrc={fallbackSrc}
            />
          )}
        </>
      ) : (
        <div className="row g-0">
          <div className="col-md-4">
            <NextImage
              src={imgSrc!}
              width={imgWidth}
              height={imgHeight}
              className="img-fluid rounded-start"
              alt={imgAlt}
              style={{ objectFit: "cover", height: "auto", ...imgStyle }}
              loading="eager"
              fallbackSrc={fallbackSrc}
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
