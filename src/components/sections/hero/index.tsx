"use client";

import { useFetch } from "@/hooks/useFetch";
import type { ApiResponse } from "@/types/api";
import type { Profile } from "@/types/profile";
import type { Social } from "@/types/social";
import Section from "@/components/ui/customs/section";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/bootstrap/button";
import Badge from "@/components/ui/bootstrap/badge";
import Alert from "@/components/ui/bootstrap/alert";
import { formatLocation } from "@/utils/format";
import "./hero.css";

import fallbackProfiles from "@/data/jsons/profiles.json";
import fallbackSocials from "@/data/jsons/socials.json";
import HeroAvatar from "./HeroAvatar";
import HeroSocials from "./HeroSocials";
import HeroSkeleton from "./HeroSkeleton";

export default function HeroSection() {
  const { t } = useLanguage();

  const {
    data: profileResponse,
    isLoading,
    error,
  } = useFetch<ApiResponse<Profile[]>>(
    "https://api.afrizahanif.com/api/profiles",
    { fallbackData: { data: fallbackProfiles } },
  );
  const profile = profileResponse?.data?.[0];

  const { data: socialResponse } = useFetch<ApiResponse<Social[]>>(
    "https://api.afrizahanif.com/api/socials",
    { fallbackData: { data: fallbackSocials } },
  );
  const socials = socialResponse?.data ?? [];

  return (
    <Section
      id="hero"
      className="bg-primary bg-gradient hero-dot-grid position-relative text-white overflow-hidden d-flex flex-column justify-content-center"
      minFullHeight
      container={false}
    >
      {/*  */}
      <div
        className="container position-relative z-2 w-100 my-auto"
        style={{
          paddingTop: "calc(var(--header-height, 4.5rem) + 2rem)",
          paddingBottom: "2rem",
        }}
      >
        <div className="row align-items-center g-4 g-lg-5">
          {/* Left: Avatar dengan Decorative Ring & Status Badge */}
          <div className="col-12 col-md-5 col-lg-5 order-md-2 text-center">
            <HeroAvatar photo={profile?.photo} fullname={profile?.fullname} />
          </div>

          {/* Right: Personal Introduction & Dual CTA */}
          <div className="col-12 col-md-7 col-lg-7 order-md-1 text-center text-md-start">
            {isLoading ? (
              <HeroSkeleton />
            ) : profile ? (
              <div>
                {/* Greeting & Role */}
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
                  <span className="text-white-75 text-uppercase fw-semibold tracking-wider small">
                    {t.hero.greeting}
                  </span>
                  {profile.status && (
                    <Badge
                      pill
                      className="bg-light text-primary px-3 py-1 small"
                    >
                      {profile.status}
                    </Badge>
                  )}
                </div>

                {/* Name */}
                <h1 className="display-4 fw-bold mb-2">{profile.fullname}</h1>

                {/* Tagline */}
                <p className="lead fs-4 text-white-75 mb-3 fw-normal">
                  {profile.tagline || t.hero.role}
                </p>

                {/* Location */}
                {(profile.current_city || profile.current_province) && (
                  <address className="text-white-75 small mb-4 d-flex align-items-center justify-content-center justify-content-md-start gap-1 fst-normal">
                    <i className="bi bi-geo-alt-fill text-warning" aria-hidden="true" />
                    <span>
                      {formatLocation(
                        profile.current_city,
                        profile.current_province,
                      )}
                    </span>
                  </address>
                )}

                {/* Dual Action CTA Buttons */}
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-3 mb-4">
                  {/* Primary CTA: Meluncur ke Proyek */}
                  <Button
                    as="a"
                    href="#projects"
                    color="light"
                    rounded
                    className="text-primary px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                  >
                    <span>{t.hero.cta}</span>
                    <i className="bi bi-arrow-down-circle-fill" />
                  </Button>

                  {/* Secondary CTA: Lihat CV / Resume */}
                  {profile.resume && (
                    <Button
                      as="a"
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="outline-light"
                      rounded
                      className="px-4 py-2 d-inline-flex align-items-center gap-2"
                    >
                      <i className="bi bi-file-earmark-person-fill" />
                      <span>{t.header.viewCv}</span>
                      <i className="bi bi-box-arrow-up-right small" />
                    </Button>
                  )}
                </div>

                {/* Quick Social Media Icons */}
                <HeroSocials socials={socials} />
              </div>
            ) : error ? (
              <Alert color="danger" className="mb-0">
                {t.hero.errorProfile}: {error.message}
              </Alert>
            ) : (
              <div>{t.hero.errorProfile}</div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        className="position-absolute bottom-0 start-50 translate-middle-x mb-3 text-white-75 text-decoration-none d-none d-lg-flex flex-column align-items-center gap-1 small opacity-75 z-2"
        style={{ cursor: "pointer" }}
        aria-label={t.hero.scrollAria}
      >
        <span>{t.hero.scroll}</span>
        <i className="bi bi-chevron-down animate-bounce" aria-hidden="true" />
      </a>
      <div className="hero-bottom-fade" />
    </Section>
  );
}
