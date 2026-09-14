"use client";

import type { Social } from "@/types/social";
import Tooltip from "@/components/ui/bootstrap/tooltip";
import Button from "@/components/ui/bootstrap/button";
import "./HeroSocials.css";

interface HeroSocialsProps {
  socials: Social[];
}

export default function HeroSocials({ socials }: HeroSocialsProps) {
  if (socials.length === 0) return null;

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 pt-2 border-top border-white border-opacity-25">
      <small className="text-white-50 me-2">Hubungkan:</small>
      {socials.map((social) => (
        <Tooltip key={social.id} title={social.name} placement="top">
          <Button
            as="a"
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            color="outline-light"
            size="sm"
            className="hero-social-btn rounded-circle d-inline-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36 }}
            aria-label={social.name}
          >
            <i className={`bi bi-${social.icon}`} />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
