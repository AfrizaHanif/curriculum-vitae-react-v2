"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/bootstrap/button";
import { siteConfig } from "@/config/siteConfig";
import ErrorHeader from "./error-header";
import Badge from "@/components/ui/bootstrap/badge";
import Footer from "../home/footer";
import "./error-footer.css";

export interface QuickLinkItem {
  label: string;
  href: string;
  icon: string;
}

export interface ErrorLayoutProps {
  statusCode: string | number;
  badgeText: string;
  title: string;
  description: string;
  icon?: string;
  badgeVariant?: "primary" | "danger" | "warning" | "info";
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: string;
  };
  showBackButton?: boolean;
  backButtonLabel?: string;
  quickLinks?: QuickLinkItem[];
  quickLinksTitle?: string;
  technicalDetails?: string | null;
  technicalDetailsTitle?: string;
}

export default function ErrorLayout({
  statusCode,
  badgeText,
  title,
  description,
  icon = "bi-exclamation-triangle",
  badgeVariant = "primary",
  primaryAction,
  secondaryAction,
  showBackButton = false,
  backButtonLabel,
  quickLinks,
  quickLinksTitle,
  technicalDetails,
  technicalDetailsTitle = "Technical Details",
}: ErrorLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-body-tertiary">
      {/* Top Header */}
      {/* <header className="smart-header sticky-top border-bottom py-2 py-md-3">
        <div className="container d-flex align-items-center justify-content-between">
          <Link
            href="/"
            className="d-flex align-items-center link-body-emphasis text-decoration-none"
            aria-label="Back to Homepage"
          >
            <Image
              src={logoWhite}
              alt="Logo"
              width={34}
              height={34}
              className="me-2 flex-shrink-0 object-fit-contain logo-light"
              priority
            />
            <Image
              src={logoBlack}
              alt="Logo"
              width={34}
              height={34}
              className="me-2 flex-shrink-0 object-fit-contain logo-dark"
              priority
            />
            <span className="fw-bold text-truncate d-none d-sm-inline fs-5">
              {siteConfig.site.name}
            </span>
          </Link>

          <div className="d-flex align-items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header> */}
      <ErrorHeader />

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3"
      >
        <div className="container" style={{ maxWidth: "680px" }}>
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-center bg-body">
            {/* Status Code Badge */}
            <div className="mb-3">
              {/* <span
                className={`badge text-bg-${badgeVariant}-subtle text-${badgeVariant} border border-${badgeVariant}-subtle rounded-pill px-3 py-2 fw-semibold text-uppercase tracking-wider`}
              >
                <i className={`bi ${icon} me-2`} aria-hidden="true" />
                {badgeText}
              </span> */}
              <Badge
                color={badgeVariant}
                className="px-3 py-2 fw-semibold text-uppercase tracking-wider"
                pill
              >
                <i className={`bi ${icon} me-2`} aria-hidden="true" />
                {badgeText}
              </Badge>
            </div>

            {/* Giant Graphic Number */}
            <div
              className="display-1 fw-black text-body-tertiary mb-2 user-select-none"
              style={{
                fontSize: "clamp(4.5rem, 12vw, 7.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              {statusCode}
            </div>

            {/* Heading */}
            <h1 className="h2 fw-bold text-body-emphasis mb-3">{title}</h1>

            {/* Description */}
            <p
              className="text-body-secondary lead fs-6 mb-4 mx-auto"
              style={{ maxWidth: "520px" }}
            >
              {description}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              {primaryAction &&
                (primaryAction.href ? (
                  <Button
                    as="a"
                    href={primaryAction.href}
                    color="primary"
                    rounded
                    className="px-4 py-2"
                  >
                    {primaryAction.icon && (
                      <i className={`bi ${primaryAction.icon} me-2`} />
                    )}
                    {primaryAction.label}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    rounded
                    onClick={primaryAction.onClick}
                    className="px-4 py-2"
                  >
                    {primaryAction.icon && (
                      <i className={`bi ${primaryAction.icon} me-2`} />
                    )}
                    {primaryAction.label}
                  </Button>
                ))}

              {showBackButton && (
                <Button
                  color="outline-secondary"
                  rounded
                  onClick={handleBack}
                  className="px-4 py-2"
                >
                  <i className="bi bi-arrow-left me-2" />
                  {backButtonLabel || "Go Back"}
                </Button>
              )}

              {secondaryAction &&
                (secondaryAction.href ? (
                  <Button
                    as="a"
                    href={secondaryAction.href}
                    color="outline-secondary"
                    rounded
                    className="px-4 py-2"
                  >
                    {secondaryAction.icon && (
                      <i className={`bi ${secondaryAction.icon} me-2`} />
                    )}
                    {secondaryAction.label}
                  </Button>
                ) : (
                  <Button
                    color="outline-secondary"
                    rounded
                    onClick={secondaryAction.onClick}
                    className="px-4 py-2"
                  >
                    {secondaryAction.icon && (
                      <i className={`bi ${secondaryAction.icon} me-2`} />
                    )}
                    {secondaryAction.label}
                  </Button>
                ))}
            </div>

            {/* Quick Links Section (e.g. for 404) */}
            {quickLinks && quickLinks.length > 0 && (
              <div className="pt-4 border-top">
                {quickLinksTitle && (
                  <p className="small text-body-secondary fw-semibold text-uppercase tracking-wider mb-3">
                    {quickLinksTitle}
                  </p>
                )}
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button color="outline-secondary" rounded size="sm">
                        <i className={`bi ${link.icon} me-2`} />
                        <span>{link.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Technical Details for 500 / Runtime Error */}
            {technicalDetails && (
              <div className="pt-3 text-start">
                <details className="small text-body-secondary">
                  <summary className="cursor-pointer user-select-none text-muted">
                    {technicalDetailsTitle}
                  </summary>
                  <pre className="mt-2 p-3 rounded bg-body-tertiary text-danger border overflow-auto text-break font-monospace small">
                    {technicalDetails}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-top py-3 text-center text-body-secondary small">
        <div className="container">
          &copy; {new Date().getFullYear()} {siteConfig.site.name}. All rights
          reserved.
        </div>
      </footer>
      {/* <Footer className="error-footer" /> */}
    </div>
  );
}
