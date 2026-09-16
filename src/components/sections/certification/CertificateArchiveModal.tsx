"use client";

import { useMemo, useState } from "react";
import type { Certificate } from "@/types/certificate";
import Modal from "@/components/ui/bootstrap/modal";
import Button from "@/components/ui/bootstrap/button";
import Badge from "@/components/ui/bootstrap/badge";
import Input from "@/components/forms/input";
import { formatMonthYear } from "@/utils/date";
import { useLanguage } from "@/context/LanguageContext";

interface CertificateArchiveModalProps {
  certificates: Certificate[];
}

export default function CertificateArchiveModal({
  certificates,
}: CertificateArchiveModalProps) {
  const { t, lang } = useLanguage();
  const dateLocale = lang === "id" ? "id-ID" : "en-US";

  // Set states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState("All");

  // Memoized list of unique issuers
  const issuers = useMemo(() => {
    const set = new Set<string>();
    certificates.forEach((c) => {
      if (c.issuer) set.add(c.issuer);
    });
    return ["All", ...Array.from(set)];
  }, [certificates]);

  // Memoized list of filtered certificates based on search and issuer
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchesIssuer =
        selectedIssuer === "All" || cert.issuer === selectedIssuer;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cert.name?.toLowerCase().includes(q) ||
        cert.issuer?.toLowerCase().includes(q) ||
        cert.type?.toLowerCase().includes(q) ||
        cert.credential_id?.toLowerCase().includes(q);

      return matchesIssuer && matchesSearch;
    });
  }, [certificates, selectedIssuer, searchQuery]);

  // Modal close handler
  const handleClose = () => {
    setSearchQuery("");
    setSelectedIssuer("All");
  };

  return (
    <Modal
      id="all-certificates-modal"
      onClose={handleClose}
      title={t.sections.certification.archiveModal.title.replace(
        "{count}",
        certificates.length.toString(),
      )}
      size="xl"
      scrollable
      centered
      contentClassName="h-100"
      buttonItems={[
        {
          label: t.common.close,
          color: "secondary",
          size: "sm" as const,
          dismiss: true,
        },
      ]}
    >
      <div className="p-1">
        {/* Search & Filter Controls */}
        <div className="row g-3 mb-4 align-items-center">
          {/* Search bar */}
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-body-tertiary">
                <i className="bi bi-search" />
              </span>
              <Input
                name="searchCertificates"
                id="search-certificates"
                type="text"
                placeholder={
                  t.sections.certification.archiveModal.searchPlaceholder
                }
                aria-label={
                  t.sections.certification.archiveModal.searchPlaceholder
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  color="outline-secondary"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>

          {/* Filter Pills for Issuers */}
          <div className="col-12 col-md-6">
            <div className="d-flex flex-wrap gap-1 justify-content-md-end">
              {issuers.map((issuer) => {
                const isSelected = selectedIssuer === issuer;
                const count =
                  issuer === "All"
                    ? certificates.length
                    : certificates.filter((c) => c.issuer === issuer).length;
                const label =
                  issuer === "All"
                    ? t.sections.certification.archiveModal.filterAll
                    : issuer;

                return (
                  <Button
                    key={issuer}
                    color={isSelected ? "primary" : "outline-secondary"}
                    size="sm"
                    rounded
                    className="px-3"
                    onClick={() => setSelectedIssuer(issuer)}
                    aria-pressed={isSelected}
                  >
                    {label} <span className="opacity-75">({count})</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
          {/* Result count text */}
          <span>
            {t.sections.certification.archiveModal.showingResults
              .replace("{current}", filteredCertificates.length.toString())
              .replace("{total}", certificates.length.toString())}
          </span>
          {/* Reset filters button */}
          {(searchQuery || selectedIssuer !== "All") && (
            <Button
              color="link"
              size="sm"
              className="text-decoration-none p-0"
              onClick={() => {
                setSearchQuery("");
                setSelectedIssuer("All");
              }}
            >
              {t.sections.certification.archiveModal.resetFilters}
            </Button>
          )}
        </div>

        {/* Compact Certificate Directory List */}
        {filteredCertificates.length === 0 ? (
          <div className="text-center py-5 my-auto text-muted">
            <i className="bi bi-journal-x fs-1 d-block mb-2" />
            {t.sections.certification.archiveModal.noMatch}
          </div>
        ) : (
          <div className="list-group list-group-flush rounded-3 border">
            {filteredCertificates.map((cert) => (
              <div
                key={cert.id}
                className="list-group-item list-group-item-action py-3 px-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
              >
                {/* Certificate details */}
                <div className="flex-grow-1">
                  {/* Badge and date */}
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <Badge
                      pill
                      className="bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle"
                    >
                      {cert.issuer}
                    </Badge>
                    {cert.type && (
                      <Badge className="bg-secondary border border-secondary">
                        {cert.type}
                      </Badge>
                    )}
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1" />
                      {cert.issue_date
                        ? formatMonthYear(
                            cert.issue_date,
                            dateLocale,
                            t.common.present,
                          )
                        : "N/A"}
                    </small>
                  </div>

                  {/* Certificate name */}
                  <h6 className="mb-1 fw-bold text-body">{cert.name}</h6>

                  {/* Certificate description */}
                  {cert.description && (
                    <p className="text-muted small mb-1 text-truncate-2">
                      {cert.description}
                    </p>
                  )}

                  {/* Certificate ID */}
                  {cert.credential_id && (
                    <small className="text-muted">
                      ID: <code>{cert.credential_id}</code>
                    </small>
                  )}
                </div>

                {/* Action buttons */}
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  {/* View Certificate PDF */}
                  {cert.file && (
                    <Button
                      as="a"
                      href={cert.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="outline-secondary"
                      size="sm"
                      className="d-inline-flex align-items-center gap-1"
                      dataBsToggle="tooltip"
                      dataBsTitle={
                        t.sections.certification.archiveModal.viewPdf
                      }
                    >
                      <i className="bi bi-file-earmark-pdf" />
                      <span className="d-none d-sm-inline">
                        {t.sections.certification.archiveModal.viewPdf}
                      </span>
                    </Button>
                  )}

                  {/* Verify URL */}
                  {cert.credential_url ? (
                    <Button
                      as="a"
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="outline-primary"
                      size="sm"
                      className="d-inline-flex align-items-center gap-1"
                    >
                      <span>
                        {t.sections.certification.archiveModal.verify}
                      </span>
                      <i className="bi bi-box-arrow-up-right small" />
                    </Button>
                  ) : (
                    <Button disabled color="outline-secondary" size="sm">
                      <i className="bi bi-link-slash" />
                      <span className="d-none d-sm-inline">
                        {t.sections.certification.archiveModal.noUrl}
                      </span>
                    </Button>
                    // <Badge className="bg-secondary border border-secondary">
                    //   {t.sections.certification.archiveModal.noUrl}
                    // </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
