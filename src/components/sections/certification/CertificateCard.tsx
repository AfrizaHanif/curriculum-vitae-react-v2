"use client";

import type { Certificate } from "@/types/certificate";
import Card from "@/components/ui/bootstrap/card";
import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import { formatMonthYear } from "@/utils/date";
import { useLanguage } from "@/context/LanguageContext";

interface CertificateCardProps {
  certificate: Certificate;
}

export default function CertificateCard({
  certificate: cert,
}: CertificateCardProps) {
  const { t, lang } = useLanguage();
  const dateLocale = lang === "id" ? "id-ID" : "en-US";

  return (
    <Card
      fullHeight
      className="shadow-sm rounded-4 border transition-all h-100"
      header={
        <div className="d-flex justify-content-between align-items-center">
          {/* Type of certificate */}
          <Badge
            pill
            className="bg-primary-subtle text-primary border border-primary-subtle px-3 py-1"
          >
            <i className="bi bi-award-fill me-1" />
            {cert.type || t.sections.certification.card.defaultType}
          </Badge>
          {/* Issuer date */}
          <small className="text-muted">
            <i className="bi bi-calendar-event me-1" />
            {cert.issue_date
              ? formatMonthYear(cert.issue_date, dateLocale, t.common.present)
              : "N/A"}
          </small>
        </div>
      }
      footer={
        <div className="d-flex justify-content-between align-items-center gap-2">
          {/* Credential ID */}
          {cert.credential_id && (
            <small
              className="text-muted text-truncate"
              title={`Credential ID: ${cert.credential_id}`}
              style={{ maxWidth: "160px" }}
            >
              ID: <code>{cert.credential_id}</code>
            </small>
          )}
          {/* Action buttons */}
          <div className="ms-auto d-flex gap-2">
            {/* View Certificate PDF */}
            {cert.file && (
              <Button
                as="a"
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                color="outline-secondary"
                size="sm"
                dataBsToggle="tooltip"
                dataBsTitle={t.sections.certification.card.viewPdf}
              >
                <i className="bi bi-file-earmark-pdf" />
              </Button>
            )}
            {/* Verify URL */}
            {cert.credential_url && (
              <Button
                as="a"
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                color="outline-primary"
                size="sm"
                className="d-inline-flex align-items-center gap-1"
              >
                <span>{t.sections.certification.card.verify}</span>
                <i className="bi bi-box-arrow-up-right small" />
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* Certificate Title */}
      <h3 className="h5 fw-bold mb-2" title={cert.name}>
        {cert.name}
      </h3>
      {/* Issuer name */}
      <div className="d-flex align-items-center text-muted small mb-2">
        <i className="bi bi-patch-check-fill text-primary me-2" />
        <span className="fw-semibold">{cert.issuer}</span>
      </div>
    </Card>
  );
}
