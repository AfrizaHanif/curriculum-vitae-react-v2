"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface IssuerLogoProps {
  issuer?: string | null;
  /**
   * Optional direct path or URL to logo (.png, .svg, .webp, or external URL).
   * Takes highest priority if provided (e.g., from cert.issuer_logo).
   */
  logo?: string | null;
  size?: number;
  className?: string;
}

/**
 * Resolves the logo source URL/path for an issuer.
 * Priority:
 * 1. Direct custom logo prop (e.g., /images/issuers/my-logo.png or API URL)
 * 2. Local SVG / PNG assets in /images/issuers/
 * 3. SimpleIcons CDN for major tech platforms
 */
export function getIssuerLogoSrc(
  issuer?: string | null,
  customLogo?: string | null,
): string | null {
  // 1. Direct logo (PNG, SVG, or remote URL from API/prop)
  if (customLogo && customLogo.trim() !== "") {
    return customLogo;
  }

  if (!issuer) return null;
  const name = issuer.toLowerCase().trim();

  // 2. Local SVG / PNG assets for custom organizations
  const localMapping: Record<string, string> = {
    digitalent: "/images/issuers/digitalent.png",
    kominfo: "/images/issuers/kominfo.svg",
    komdigi: "/images/issuers/komdigi.svg",
    bps: "/images/issuers/bps.svg",
    statistik: "/images/issuers/bps.svg",
    seal: "/images/issuers/seal.svg",
  };

  const matchedLocal = Object.keys(localMapping).find((key) =>
    name.includes(key),
  );
  if (matchedLocal) {
    return localMapping[matchedLocal];
  }

  // 3. SimpleIcons CDN for popular platforms
  const brandConfigs: Record<string, { slug: string; color: string }> = {
    udemy: { slug: "udemy", color: "A435F0" },
    coursera: { slug: "coursera", color: "0056D2" },
    meta: { slug: "meta", color: "0081FB" },
    google: { slug: "google", color: "4285F4" },
    dicoding: { slug: "dicoding", color: "2D3E50" },
    microsoft: { slug: "microsoft", color: "00A4EF" },
    freecodecamp: { slug: "freecodecamp", color: "0A0A23" },
    linkedin: { slug: "linkedin", color: "0A66C2" },
    aws: { slug: "amazonwebservices", color: "FF9900" },
    amazon: { slug: "amazonwebservices", color: "FF9900" },
    laravel: { slug: "laravel", color: "FF2D20" },
  };

  const matchedBrand = Object.keys(brandConfigs).find((key) =>
    name.includes(key),
  );
  if (matchedBrand) {
    const { slug, color } = brandConfigs[matchedBrand];
    return `https://cdn.simpleicons.org/${slug}/${color}`;
  }

  return null;
}

export function IssuerLogo({
  issuer,
  logo,
  size = 24,
  className = "",
}: IssuerLogoProps) {
  const [imgError, setImgError] = useState(false);

  if (!issuer && !logo) {
    return <i className={`bi bi-award text-secondary fs-4 ${className}`} />;
  }

  const logoSrc = getIssuerLogoSrc(issuer, logo);

  if (logoSrc && !imgError) {
    return (
      <Image
        src={logoSrc}
        alt={issuer || "Issuer Logo"}
        width={size}
        height={size}
        className={`object-fit-contain ${className}`}
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }

  // Clean initial fallback if image is missing or failed to load
  const initial = issuer ? issuer.charAt(0).toUpperCase() : "?";
  return (
    <span
      className={`fw-bold text-primary small d-inline-flex align-items-center justify-content-center ${className}`}
      style={{ width: size, height: size }}
      title={issuer || undefined}
    >
      {initial}
    </span>
  );
}
