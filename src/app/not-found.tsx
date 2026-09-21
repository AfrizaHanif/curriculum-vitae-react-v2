"use client";

import ErrorLayout from "@/components/layouts/errors/error-layout";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <ErrorLayout
      statusCode={t.errorPages.notFound.code}
      badgeText={t.errorPages.notFound.badge}
      title={t.errorPages.notFound.title}
      description={t.errorPages.notFound.description}
      icon="bi-compass"
      badgeVariant="primary"
      primaryAction={{
        label: t.errorPages.notFound.backHome,
        href: "/",
        icon: "bi-house",
      }}
      showBackButton
      backButtonLabel={t.errorPages.notFound.backPrev}
      quickLinksTitle={t.errorPages.notFound.quickLinksTitle}
      quickLinks={[
        {
          label: t.errorPages.notFound.projects,
          href: "/#projects",
          icon: "bi-folder2",
        },
        {
          label: t.errorPages.notFound.resume,
          href: "/resume",
          icon: "bi-file-earmark-person",
        },
        {
          label: t.errorPages.notFound.contact,
          href: "/#contact",
          icon: "bi-envelope",
        },
      ]}
    />
  );
}
