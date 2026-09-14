"use client";

import { useMemo } from "react";
import { useFetch } from "@/hooks/useFetch";
import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import Button from "@/components/ui/bootstrap/button";
import Alert from "@/components/ui/bootstrap/alert";
import Spinner from "@/components/ui/bootstrap/spinner";
import { CardGrid } from "@/components/ui/bootstrap/card";
import type { Certificate } from "@/types/certificate";
import { ApiResponse } from "@/types/api";

import CertificateCard from "./CertificateCard";
import CertificateArchiveModal from "./CertificateArchiveModal";
import { useLanguage } from "@/context/LanguageContext";
import fallbackCertificates from "@/data/jsons/certificates.json";

/*
  Thing that need to be improved:
  1. Featured column on API
 */

const FEATURED_LIMIT = 6;

export default function CertificationSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useFetch<ApiResponse<Certificate[]>>(
    "https://api.afrizahanif.com/api/certificates?all=true",
    { fallbackData: { data: fallbackCertificates } },
  );
  const certificates = useMemo(() => data?.data ?? [], [data]);
  const featuredCertificates = certificates.slice(0, FEATURED_LIMIT);

  return (
    <Section id="certifications" minFullHeight>
      {/* Section Header */}
      <SectionHeader
        title={t.sections.certification.title}
        subtitle={t.sections.certification.subtitle}
      />

      {/* Loading / Error / Empty States */}
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner color="primary" label={t.sections.certification.loading} />
        </div>
      ) : error ? (
        <Alert
          color="danger"
          className="mx-auto"
          style={{ maxWidth: "600px" }}
        >
          {t.sections.certification.error}: {error.message}
        </Alert>
      ) : certificates.length === 0 ? (
        <p className="text-center text-muted">{t.sections.certification.empty}</p>
      ) : (
        <>
          {/* Featured Top Certificates */}
          <CardGrid cols={1} mdCols={2} lgCols={3} gap={4}>
            {featuredCertificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </CardGrid>

          {/* Show More / View All Button trigger for Modal */}
          {certificates.length > FEATURED_LIMIT && (
            <div className="text-center mt-5">
              <Button
                color="primary"
                rounded
                className="px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
                dataBsToggle="modal"
                dataBsTarget="#all-certificates-modal"
              >
                <i className="bi bi-collection-fill" />
                <span>
                  {t.sections.certification.browseAll.replace(
                    "{count}",
                    certificates.length.toString(),
                  )}
                </span>
              </Button>
              <div className="text-muted small mt-2">
                {t.sections.certification.showingCount
                  .replace("{limit}", FEATURED_LIMIT.toString())
                  .replace("{count}", certificates.length.toString())}
              </div>
            </div>
          )}

          {/* Modal for Full Directory / Searchable Archive */}
          <CertificateArchiveModal certificates={certificates} />
        </>
      )}
    </Section>
  );
}
