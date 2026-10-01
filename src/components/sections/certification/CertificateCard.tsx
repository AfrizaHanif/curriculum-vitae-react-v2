"use client";

import type { Certificate } from "@/types/certificate";
import Card from "@/components/ui/bootstrap/card";
import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import { formatMonthYear } from "@/utils/date";
import { useLanguage } from "@/context/LanguageContext";
import { IssuerLogo } from "./cert-utils";

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
          {/* Type + Featured + Validity Badges */}
          <div className="d-flex flex-wrap align-items-center gap-1">
            <Badge
              pill
              className="bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"
            >
              <i className="bi bi-award-fill me-1" />
              {cert.type || t.sections.certification.card.defaultType}
            </Badge>

            {/* Featured Badge */}
            {/* {cert.is_featured && (
              <Badge
                pill
                className="bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1"
              >
                <i className="bi bi-star-fill text-warning me-1" />
                {t.sections.certification.card.featured}
              </Badge>
            )} */}

            {/* Validity / Expiry Status Badge */}
            {cert.expired_date && (
              <Badge
                pill
                className={
                  new Date(cert.expired_date) >= new Date()
                    ? "bg-success-subtle text-success border border-success-subtle px-2 py-1"
                    : "bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"
                }
              >
                <i
                  className={`bi ${
                    new Date(cert.expired_date) >= new Date()
                      ? "bi-check-circle-fill"
                      : "bi-exclamation-triangle-fill"
                  } me-1`}
                />
                {new Date(cert.expired_date) >= new Date()
                  ? t.sections.certification.card.active
                  : t.sections.certification.card.expired}
              </Badge>
            )}
          </div>

          {/* Issuer date */}
          <small className="text-muted ms-auto flex-shrink-0">
            <i className="bi bi-calendar-event me-1" />
            {cert.issued_date ? (
              <time dateTime={cert.issued_date}>
                {formatMonthYear(
                  cert.issued_date,
                  dateLocale,
                  t.common.present,
                )}
              </time>
            ) : (
              "N/A"
            )}
          </small>
        </div>
      }
      footer={
        <div className="d-flex justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 text-truncate">
            {/* Credential ID */}
            {cert.credential_id && (
              <small
                className="text-muted text-truncate"
                title={`Credential ID: ${cert.credential_id}`}
                style={{ maxWidth: "140px" }}
              >
                ID: <code>{cert.credential_id}</code>
              </small>
            )}
          </div>
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
                color="primary"
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
      {/* Top: Issuer Logo + Title & Issuer */}
      <div className="d-flex align-items-start gap-3">
        {/* Issuer Logo Container */}
        <div
          className="rounded-3 bg-body-tertiary border d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 44, height: 44 }}
        >
          <IssuerLogo
            issuer={cert.issuer}
            logo={cert.issuer_logo || cert.logo}
            size={24}
          />
        </div>

        {/* Title and Issuer */}
        <div className="flex-grow-1 min-w-0" style={{ minWidth: 0 }}>
          <h3 className="h6 fw-bold mb-1 text-truncate-2" title={cert.title}>
            {cert.title}
          </h3>
          <div className="d-flex align-items-center gap-2 text-muted small flex-wrap">
            <span className="fw-semibold text-truncate">{cert.issuer}</span>
            {/* Verified Credential Badge */}
            {cert.credential_url && (
              <Badge
                pill
                className="bg-success-subtle text-success border border-success-subtle px-2 py-0"
                style={{ fontSize: "0.7rem", lineHeight: "1.4" }}
                title="Online verifiable credential"
              >
                <i className="bi bi-patch-check-fill me-1" />
                {t.sections.certification.card.verified}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
