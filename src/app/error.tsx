"use client";

import { useEffect } from "react";
import ErrorLayout from "@/components/layouts/errors/error-layout";
import { useLanguage } from "@/context/LanguageContext";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Log error to console (or third-party error tracker in production)
    console.error("Runtime Application Error:", error);
  }, [error]);

  const technicalDetails =
    process.env.NODE_ENV === "development" || error?.digest
      ? `${error.name ? `${error.name}: ` : ""}${error.message || "Unknown error"}${
          error.digest ? `\nDigest: ${error.digest}` : ""
        }${error.stack ? `\n\n${error.stack}` : ""}`
      : null;

  return (
    <ErrorLayout
      statusCode={t.errorPages.serverError.code}
      badgeText={t.errorPages.serverError.badge}
      title={t.errorPages.serverError.title}
      description={t.errorPages.serverError.description}
      icon="bi-exclamation-octagon"
      badgeVariant="danger"
      primaryAction={{
        label: t.errorPages.serverError.retry,
        onClick: () => reset(),
        icon: "bi-arrow-clockwise",
      }}
      secondaryAction={{
        label: t.errorPages.serverError.backHome,
        href: "/",
        icon: "bi-house",
      }}
      showBackButton
      backButtonLabel={t.errorPages.notFound.backPrev}
      technicalDetails={technicalDetails}
      technicalDetailsTitle={t.errorPages.serverError.technicalDetails}
    />
  );
}
