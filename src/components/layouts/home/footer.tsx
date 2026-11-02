"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "./footer.css";
import { useLanguage } from "@/context/LanguageContext";
import { useFetch } from "@/hooks/useFetch";
import { SocialApiResponse } from "@/types/social";
import Tooltip from "../../ui/bootstrap/tooltip";
import Image from "next/image";
import logoWhite from "@/assets/images/logo/logo-only-white.png";
import logoBlack from "@/assets/images/logo/logo-only-black.png";
import fallbackSocials from "@/data/jsons/socials.json";
import fallbackProfiles from "@/data/jsons/profiles.json";
import { ProfileApiResponse } from "@/types/profile";
import { getApiUrl } from "@/config/siteConfig";

// Footer's Props
interface FooterProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Footer({ className = "", style }: FooterProps) {
  const { t } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);

  // Fetch API Data
  const { data: socialData } = useFetch<SocialApiResponse>(
    getApiUrl("socials"),
    { fallbackData: { data: fallbackSocials } },
  );
  const social = socialData?.data;
  const { data: profileData } = useFetch<ProfileApiResponse>(
    getApiUrl("profiles"),
    { fallbackData: { data: fallbackProfiles } },
  );
  const profile = profileData?.data?.[0];

  // Resize Observer (For Dynamic Footer Height)
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const height =
          entry.borderBoxSize?.[0]?.blockSize ?? entry.target.clientHeight;
        document.documentElement.style.setProperty(
          "--footer-height",
          `${height}px`,
        );
      }
    });

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`position-absolute bottom-0 start-0 glass-footer w-100 ${className}`}
      style={style}
    >
      <div className="container py-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-center text-md-start">
        {/* Copyright & Credits */}
        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-center">
          {/* Logo */}
          <Link
            href="/"
            className="mb-2 mb-md-0 me-md-3 text-body-secondary text-decoration-none lh-1 flex-shrink-0"
            aria-label="CV Portfolio"
          >
            <Image
              src={logoWhite}
              alt="Logo"
              width={24}
              height={24}
              className="object-fit-contain logo-light"
              loading="lazy"
            />
            <Image
              src={logoBlack}
              alt="Logo"
              width={24}
              height={24}
              className="object-fit-contain logo-dark"
              loading="lazy"
            />
          </Link>

          {/* Text Block */}
          <div className="d-flex flex-column align-items-center align-items-md-start">
            {/* Copyright */}
            <span className="text-body-secondary small">
              © {new Date().getFullYear()}{" "}
              {profile?.fullname || "Muhammad Afriza Hanif"}. {t.footer.allRightsReserved}
            </span>

            {/* Tech Stack & AI Mention */}
            <div
              className="text-body-tertiary mt-1 d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-1"
              style={{ fontSize: "0.8rem" }}
            >
              <span>{t.footer.designedAndBuilt}</span>
              <span className="opacity-50">·</span>
              <span>{t.footer.aiAssisted}</span>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <ul className="nav justify-content-center justify-content-md-end list-unstyled d-flex mb-0">
          {social?.map((item) => (
            <li key={item.id} className="ms-3">
              <Tooltip title={item.name}>
                <a
                  className="text-body-secondary"
                  href={item.url}
                  aria-label={item.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`bi bi-${item.icon} fs-5`} aria-hidden="true" />
                </a>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
