"use client";

import NextImage from "@/components/ui/react/image";
import placeholderProfile from "@/assets/images/placeholders/placeholder-profile.png";
import "./AboutAvatar.css";

interface AboutAvatarProps {
  photo?: string | null;
  fullname?: string | null;
}

export default function AboutAvatar({ photo, fullname }: AboutAvatarProps) {
  return (
    <div className="about-avatar-container position-relative">
      {/* Outer Glassmorphic Frame dari Hero */}
      <div className="p-2 shadow-lg about-avatar-frame">
        <div className="about-avatar-img-wrapper">
          <NextImage
            src={photo || placeholderProfile}
            alt={
              fullname
                ? `${fullname} - About Profile Photo`
                : "Muhammad Afriza Hanif - About Profile Photo"
            }
            width={600}
            height={750}
            enableZoom
            modalTitle={fullname || "Profile Photo"}
            className="about-avatar-img"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
