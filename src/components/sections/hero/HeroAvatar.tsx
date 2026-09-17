"use client";

import NextImage from "@/components/ui/react/image";
import placeholderProfile from "@/assets/images/placeholders/placeholder-profile.png";
import "./HeroAvatar.css";

interface HeroAvatarProps {
  photo?: string | null;
  fullname?: string | null;
}

export default function HeroAvatar({ photo, fullname }: HeroAvatarProps) {
  return (
    <div className="position-relative d-inline-block">
      {/* Outer Glow Ring */}
      <div
        className="p-2 shadow-lg d-inline-block hero-avatar-frame"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
          backdropFilter: "blur(8px)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <NextImage
          src={photo || placeholderProfile}
          alt={
            fullname
              ? `${fullname} - Web Developer Profile Photo`
              : "Muhammad Afriza Hanif - Web Developer Profile Photo"
          }
          width={600}
          height={750}
          // placeholder="blur"
          // blurDataURL={getShimmerDataUrl(600, 750)}
          priority
          loading="eager"
          showSkeleton
          enableZoom
          modalTitle={fullname || "Profile Photo"}
          className="img-fluid hero-avatar-img"
          wrapperClassName="overflow-hidden"
          wrapperStyle={{ borderRadius: "inherit" }}
          style={{
            objectFit: "cover",
            objectPosition: "center 20%",
            maxWidth: "100%",
          }}
        />
      </div>
    </div>
  );
}
