"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "./footer.css";
import { useFetch } from "@/hooks/useFetch";
import { SocialApiResponse } from "@/types/social";
import Tooltip from "../ui/bootstrap/tooltip";
import Image from "next/image";
// import logoSite from "@/assets/images/logo/logo-only-white.png";
import logoWhite from "@/assets/images/logo/logo-only-white.png";
import logoBlack from "@/assets/images/logo/logo-only-black.png";
import fallbackSocials from "@/data/jsons/socials.json";
import fallbackProfiles from "@/data/jsons/profiles.json";
import { ProfileApiResponse } from "@/types/profile";

// Footer's Props
interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  // Fetch API Data
  const { data: socialData } = useFetch<SocialApiResponse>(
    `https://api.afrizahanif.com/api/socials`,
    { fallbackData: { data: fallbackSocials } },
  );
  const social = socialData?.data;
  const { data: profileData } = useFetch<ProfileApiResponse>(
    `https://api.afrizahanif.com/api/profiles`,
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
    >
      <div className="container py-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-center text-md-start">
        {/* Copyright & Logo */}
        <div className="d-flex align-items-center justify-content-center justify-content-md-start">
          {/* Logo */}
          <Link
            href="/"
            className="me-2 text-body-secondary text-decoration-none lh-1"
            aria-label="CV Portfolio"
          >
            <Image
              src={logoWhite}
              alt="Logo"
              width={24}
              height={24}
              className="object-fit-contain logo-light"
              // priority
              loading="lazy"
            />
            <Image
              src={logoBlack}
              alt="Logo"
              width={24}
              height={24}
              className="object-fit-contain logo-dark"
              // priority
              loading="lazy"
            />
          </Link>
          {/* Copyright */}
          <span className="text-body-secondary small">
            © {new Date().getFullYear()}{" "}
            {profile?.fullname || "Muhammad Afriza Hanif"}. All rights reserved.
          </span>
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
