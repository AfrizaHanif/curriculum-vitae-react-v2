"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface UnderConstructionProps {
  title?: string;
  subtitle?: string;
}

export default function UnderConstruction({
  title,
  subtitle,
}: UnderConstructionProps) {
  const { t } = useLanguage();

  return (
    <div className="text-center py-5">
      <i className="bi bi-cone-striped display-3 text-warning mb-3 d-block"></i>
      <h1 className="h3 fw-bold mb-2">
        {title || t.common.underConstruction.title}
      </h1>
      <p className="lead text-muted mb-4">
        {subtitle || t.common.underConstruction.subtitle}
      </p>
      <Link href="/" className="btn btn-outline-primary">
        <i className="bi bi-arrow-left me-2"></i>
        {t.common.underConstruction.backHome}
      </Link>
    </div>
  );
}
