"use client";

import { useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Global Application Error:", error);
  }, [error]);

  return (
    <html lang="en" data-bs-theme="auto">
      <body className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-body-tertiary p-3">
        <div className="container" style={{ maxWidth: "560px" }}>
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-center bg-body">
            <div className="mb-3">
              {/* <span className="badge text-bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-2 fw-semibold text-uppercase">
                <i className="bi bi-exclamation-triangle-fill me-1.5" />
                Critical Error
              </span> */}
              <Badge
                color="danger"
                className="px-3 py-2 fw-semibold text-uppercase tracking-wider"
                pill
              >
                <i
                  className={`bi bi-exclamation-triangle-fill me-2`}
                  aria-hidden="true"
                />
                Critical Error
              </Badge>
            </div>

            <div
              className="display-1 fw-black text-body-tertiary mb-2 user-select-none"
              style={{
                fontSize: "clamp(4.5rem, 10vw, 6.5rem)",
                fontWeight: 900,
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              500
            </div>

            <h1 className="h3 fw-bold text-body-emphasis mb-3">
              Something Went Wrong
            </h1>

            <p className="text-body-secondary mb-4">
              A critical error occurred in the application layout. Please try
              reloading the page.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-2">
              {/* <button
                type="button"
                className="btn btn-primary rounded-pill px-4 py-2"
                onClick={() => reset()}
              >
                <i className="bi bi-arrow-clockwise me-1.5" />
                Try Again
              </button> */}
              <Button
                color="primary"
                rounded
                className="px-4 py-2"
                onClick={() => reset()}
              >
                <i className="bi bi-arrow-clockwise me-1.5" />
                Try Again
              </Button>
              {/* <Link
                href="/"
                className="btn btn-outline-secondary rounded-pill px-4 py-2"
              >
                <i className="bi bi-house me-1.5" />
                Back to Home
              </Link> */}
              <Link href="/">
                <Button color="outline-secondary" rounded className="px-4 py-2">
                  <i className="bi bi-house me-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
