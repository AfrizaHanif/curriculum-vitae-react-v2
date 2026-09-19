"use client";

import type { Profile } from "@/types/profile";
import Card from "@/components/ui/bootstrap/card";
import Badge from "@/components/ui/bootstrap/badge";
import Spinner from "@/components/ui/bootstrap/spinner";
import { formatLocation } from "@/utils/format";
import { useLanguage } from "@/context/LanguageContext";

interface ContactInfoCardProps {
  profile: Profile;
}

export default function ContactInfoCard({ profile }: ContactInfoCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="h-100 shadow-lg p-4 border-0 d-flex flex-column justify-content-between">
      <div>
        {/* Status Availability Badge */}
        <div className="mb-3">
          <Badge
            pill
            className="bg-success-subtle text-success border border-success-subtle px-3 py-2 d-inline-flex align-items-center gap-2"
          >
            <Spinner
              variant="grow"
              size="sm"
              color="success"
              style={{ width: "0.5rem", height: "0.5rem" }}
            />
            <span>{t.sections.contact.infoCard.badgeAvailable}</span>
          </Badge>
        </div>

        {/* Headline & Descriptions */}
        <h4 className="fw-bold mb-2">{t.sections.contact.infoCard.headline}</h4>
        <p className="text-body-secondary small mb-4">
          {t.sections.contact.infoCard.description}
        </p>

        {/* Contact Channels */}
        <address className="d-flex flex-column gap-3 mb-4 fst-normal">
          {/* Email Item */}
          {profile.email && (
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-envelope-fill fs-5" />
              </div>
              <div className="text-truncate">
                <small className="text-body-secondary d-block">
                  {t.sections.contact.infoCard.emailLabel}
                </small>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-decoration-none fw-semibold text-body text-truncate d-block"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          )}

          {/* WhatsApp / Phone */}
          {profile.phone && (
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-whatsapp fs-5" />
              </div>
              <div>
                <small className="text-body-secondary d-block">
                  {t.sections.contact.infoCard.phoneLabel}
                </small>
                <a
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none fw-semibold text-body"
                >
                  {profile.phone}
                </a>
              </div>
            </div>
          )}

          {/* Location */}
          {(profile.current_city || profile.current_province) && (
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-info-subtle text-info-emphasis d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "42px", height: "42px" }}
              >
                <i className="bi bi-geo-alt-fill fs-5" />
              </div>
              <div>
                <small className="text-body-secondary d-block">
                  {t.sections.contact.infoCard.locationLabel}
                </small>
                <span className="fw-semibold text-body">
                  {formatLocation(
                    profile.current_city,
                    profile.current_province,
                  )}
                </span>
              </div>
            </div>
          )}
        </address>
      </div>

      {/* Response Time Note */}
      <div className="pt-3 border-top mt-auto">
        <div className="d-flex align-items-center gap-2 text-body-secondary small">
          <i className="bi bi-lightning-charge-fill text-warning" />
          <span>{t.sections.contact.infoCard.responseTime}</span>
        </div>
      </div>
    </Card>
  );
}
