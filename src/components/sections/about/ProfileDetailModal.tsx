"use client";

import { useState } from "react";
import type { Profile } from "@/types/profile";
import Modal from "@/components/ui/bootstrap/modal";
import Badge from "@/components/ui/bootstrap/badge";
import Card from "@/components/ui/bootstrap/card";
import Button from "@/components/ui/bootstrap/button";
import NextImage from "@/components/ui/react/image";
import placeholderImage from "@/assets/images/placeholders/placeholder-image.png";
import { getShimmerDataUrl } from "@/lib/shimmer";
import { formatLocation } from "@/utils/format";
import { formatDate } from "@/utils/date";
import { useLanguage } from "@/context/LanguageContext";

interface ProfileDetailModalProps {
  profile?: Profile | null;
}

export default function ProfileDetailModal({
  profile,
}: ProfileDetailModalProps) {
  const { t, lang } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const formattedBirthday = profile?.birthday
    ? formatDate(profile.birthday, lang === "id" ? "id-ID" : "en-US")
    : null;

  const location = profile
    ? formatLocation(profile.current_city, profile.current_province)
    : "";

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (!profile) return null;

  return (
    <Modal
      id="profile-detail-modal"
      title={t.sections.about.profileModal.title}
      size="lg"
      centered
      scrollable
      buttonItems={[
        ...(profile.resume
          ? [
              {
                label: (
                  <span className="d-inline-flex align-items-center gap-2">
                    <i className="bi bi-file-earmark-person-fill" />
                    <span>{t.sections.about.profileModal.downloadCv}</span>
                    <i className="bi bi-box-arrow-up-right small" />
                  </span>
                ),
                as: "a" as const,
                href: profile.resume,
                target: "_blank",
                rel: "noopener noreferrer",
                color: "primary" as const,
                size: "sm" as const,
              },
            ]
          : []),
        {
          label: t.common.close,
          color: "secondary",
          size: "sm" as const,
          dismiss: true,
        },
      ]}
    >
      <div className="p-2">
        {/* Header Profile Summary */}
        <Card
          className="border-0 bg-body-tertiary rounded-4 mb-4 shadow-sm"
          bodyClassName="p-3 p-md-4"
        >
          <div className="row align-items-center g-3">
            <div className="col-auto">
              <div
                className="rounded-circle overflow-hidden border border-2 border-primary shadow-sm"
                style={{ width: 84, height: 84 }}
              >
                <NextImage
                  src={profile.photo || placeholderImage}
                  alt={profile.fullname}
                  width={84}
                  height={84}
                  placeholder="blur"
                  blurDataURL={getShimmerDataUrl(84, 84)}
                  className="w-100 h-100 object-fit-cover"
                  loading="eager"
                />
              </div>
            </div>
            <div className="col">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h4 className="fw-bold mb-0 text-body">{profile.fullname}</h4>
                {profile.status && (
                  <Badge
                    pill
                    className="bg-success-subtle text-success border border-success-subtle px-2.5 py-1 small"
                  >
                    <i className="bi bi-circle-fill small me-1" />
                    {profile.status}
                  </Badge>
                )}
              </div>
              {profile.tagline && (
                <p className="text-primary fw-medium mb-0 small">
                  {profile.tagline}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Detailed Information Grid */}
        <div className="row g-3 mb-4">
          {/* Email */}
          <div className="col-12 col-md-6">
            <Card
              fullHeight
              className="border rounded-3 bg-body"
              bodyClassName="p-3"
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="text-primary p-2 d-inline-flex">
                    <i className="bi bi-envelope-fill fs-5" />
                  </div>
                  <div>
                    <small className="text-body-secondary d-block">
                      {t.sections.about.profileModal.email}
                    </small>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-body text-decoration-none fw-medium text-break"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
                <Button
                  color="outline-secondary"
                  size="sm"
                  className="border-0"
                  onClick={() => handleCopyEmail(profile.email)}
                  dataBsToggle="tooltip"
                  dataBsTitle={
                    copiedEmail
                      ? t.sections.about.profileModal.emailCopied
                      : t.sections.about.profileModal.copyEmail
                  }
                  aria-label={
                    copiedEmail
                      ? t.sections.about.profileModal.emailCopied
                      : t.sections.about.profileModal.copyEmail
                  }
                >
                  <i
                    className={`bi ${copiedEmail ? "bi-check2 text-success" : "bi-clipboard"}`}
                    aria-hidden="true"
                  />
                  <span className="visually-hidden" aria-live="polite">
                    {copiedEmail
                      ? t.sections.about.profileModal.emailCopied
                      : ""}
                  </span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Phone */}
          <div className="col-12 col-md-6">
            <Card
              fullHeight
              className="border rounded-3 bg-body"
              bodyClassName="p-3"
            >
              <div className="d-flex align-items-center gap-2">
                <div className="text-success p-2 d-inline-flex">
                  <i className="bi bi-whatsapp fs-5" />
                </div>
                <div>
                  <small className="text-body-secondary d-block">
                    {t.sections.about.profileModal.phone}
                  </small>
                  <a
                    href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body text-decoration-none fw-medium"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Location */}
          {location && (
            <div className="col-12 col-md-6">
              <Card
                fullHeight
                className="border rounded-3 bg-body"
                bodyClassName="p-3"
              >
                <div className="d-flex align-items-center gap-2">
                  <div className="text-info-emphasis p-2 d-inline-flex">
                    <i className="bi bi-geo-alt-fill fs-5" />
                  </div>
                  <div>
                    <small className="text-body-secondary d-block">
                      {t.sections.about.profileModal.location}
                    </small>
                    <span className="text-body fw-medium">{location}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Birthday */}
          {formattedBirthday && (
            <div className="col-12 col-md-6">
              <Card
                fullHeight
                className="border rounded-3 bg-body"
                bodyClassName="p-3"
              >
                <div className="d-flex align-items-center gap-2">
                  <div className="text-warning-emphasis p-2 d-inline-flex">
                    <i className="bi bi-calendar-event-fill fs-5" />
                  </div>
                  <div>
                    <small className="text-body-secondary d-block">
                      {t.sections.about.profileModal.birthday}
                    </small>
                    <span className="text-body fw-medium">
                      {formattedBirthday}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Philosophy Quote */}
        {profile.philosophy && (
          <div className="p-3 bg-body-tertiary rounded-3 border-start border-primary border-4 mb-3">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-quote fs-4 text-primary opacity-50 lh-1" />
              <p className="fst-italic text-body mb-0 small">
                &ldquo;{profile.philosophy}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
