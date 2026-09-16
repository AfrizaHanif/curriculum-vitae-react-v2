"use client";

import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import { formatLocation } from "@/utils/format";
import { useFetch } from "@/hooks/useFetch";
import fallbackProfiles from "@/data/jsons/profiles.json";
import fallbackSetups from "@/data/jsons/setups.json";
import type { ProfileApiResponse } from "@/types/profile";
import Card from "@/components/ui/bootstrap/card";
import { useLanguage } from "@/context/LanguageContext";
import Badge from "@/components/ui/bootstrap/badge";
import Button from "@/components/ui/bootstrap/button";
import AboutStats from "./AboutStats";
import { SetupApiResponse } from "@/types/setup";
import ProfileDetailModal from "./ProfileDetailModal";
import SetupModal from "./SetupModal";
import AboutAvatar from "./AboutAvatar";
import AboutSkeleton from "./AboutSkeleton";

export default function AboutSection() {
  const { t } = useLanguage();
  const { data: profileData, isLoading: profileLoading } =
    useFetch<ProfileApiResponse>(`https://api.afrizahanif.com/api/profiles`, {
      fallbackData: { data: fallbackProfiles },
    });
  const profile = profileData?.data?.[0];
  const { data: setupData, isLoading: setupLoading } =
    useFetch<SetupApiResponse>(
      `https://api.afrizahanif.com/api/setups?all=true`,
      {
        fallbackData: { data: fallbackSetups },
      },
    );
  const setup = setupData?.data;

  return (
    <Section id="about" minFullHeight>
      {/* Section Header */}
      <SectionHeader
        title={t.sections.about.title}
        subtitle={t.sections.about.subtitle}
      />

      {/* Main Profile Showcase */}
      <div className="row g-4 g-lg-5 mb-4 mb-md-5">
        {/* Left: Profile Photo & Action Buttons */}
        <div className="col-12 col-lg-5 order-1 order-lg-1">
          {/* Profile Photo Frame with Zoom */}
          <div className="position-relative text-center">
            <AboutAvatar photo={profile?.photo} fullname={profile?.fullname} />
          </div>
        </div>

        {/* Right: Bio & Profile Details */}
        <div className="col-12 col-lg-7 order-2 order-lg-2 align-items-center">
          {profileLoading ? (
            <AboutSkeleton />
          ) : profile ? (
            <div>
              {/* Quick Info Badges */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                {(profile.current_city || profile.current_province) && (
                  <Badge
                    pill
                    className="bg-body-tertiary text-body border px-3 py-2"
                  >
                    <i className="bi bi-geo-alt-fill text-primary me-1" />
                    {formatLocation(
                      profile.current_city,
                      profile.current_province,
                    )}
                  </Badge>
                )}
                {profile.status && (
                  <Badge
                    pill
                    className="bg-success-subtle text-success border border-success-subtle px-3 py-2 d-inline-flex align-items-center gap-1"
                  >
                    <i className="bi bi-circle-fill small" />
                    {profile.status}
                  </Badge>
                )}
              </div>

              {/* Tagline / Subtitle */}
              {profile.tagline && (
                <h4 className="fw-semibold text-primary mb-3">
                  {profile.tagline}
                </h4>
              )}

              {/* Description */}
              <p
                className="lead text-body mb-4"
                style={{ lineHeight: "1.8", fontSize: "1.1rem" }}
              >
                {profile.description || t.sections.about.empty}
              </p>

              {/* Philosophy Quote Card */}
              {profile.philosophy && (
                <Card className="bg-body-tertiary border-0 border-start border-primary border-4 p-1 rounded-3 mb-4 shadow-sm">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-quote fs-3 text-primary opacity-50 lh-1" />
                    <p className="fst-italic text-body mb-0">
                      &ldquo;{profile.philosophy}&rdquo;
                    </p>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="d-flex justify-content-center py-5">
              <p className="text-muted">{t.sections.about.empty}</p>
            </div>
          )}
        </div>
      </div>

      {/* Unified Action Buttons */}
      {profile && (
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 gap-sm-3 mb-4 mb-md-5">
          {/* CV */}
          {profile.resume && (
            <Button
              as="a"
              color="primary"
              rounded
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm"
            >
              <i className="bi bi-file-earmark-person-fill" />
              <span>{t.sections.about.buttons.viewCv}</span>
              <i className="bi bi-box-arrow-up-right small" />
            </Button>
          )}

          {/* Contact Me */}
          <Button
            as="a"
            color="outline-primary"
            rounded
            href="#contact"
            className="px-4 py-2 d-inline-flex align-items-center gap-2"
          >
            <i className="bi bi-envelope-fill" />
            <span>{t.sections.about.buttons.contactMe}</span>
          </Button>

          {/* Profile Details Modal */}
          <Button
            color="outline-secondary"
            rounded
            className="px-4 py-2 d-inline-flex align-items-center gap-2"
            dataBsToggle="modal"
            dataBsTarget="#profile-detail-modal"
            disabled={!profile || profileLoading}
          >
            <i className="bi bi-person-lines-fill" />
            <span>{t.sections.about.buttons.profileInfo}</span>
          </Button>

          {/* Workspace Setup Modal */}
          <Button
            color="outline-secondary"
            rounded
            className="px-4 py-2 d-inline-flex align-items-center gap-2"
            dataBsToggle="modal"
            dataBsTarget="#workspace-setup-modal"
            disabled={setupLoading}
          >
            <i className="bi bi-display" />
            <span>{t.sections.about.buttons.setupGear}</span>
          </Button>
        </div>
      )}

      {/* Highlight Stats Row */}
      <AboutStats />

      {/* Personal Profile Details Modal */}
      <ProfileDetailModal profile={profile} />

      {/* Workspace & Gear Setup Modal */}
      <SetupModal
        setups={setup || []}
        setupImage={profile?.setup_image}
        isLoading={setupLoading}
      />
    </Section>
  );
}
