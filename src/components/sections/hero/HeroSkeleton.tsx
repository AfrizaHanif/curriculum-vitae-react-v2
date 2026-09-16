"use client";

import Placeholder, { PlaceholderGlow } from "@/components/ui/bootstrap/placeholder";

export default function HeroSkeleton() {
  return (
    <PlaceholderGlow>
      {/* 1. Greeting & Status Pill */}
      <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
        <Placeholder
          color="light"
          rounded="pill"
          col={3}
          className="col-md-2 py-2 opacity-50"
        />
        <Placeholder
          color="light"
          rounded="pill"
          col={2}
          className="col-md-2 py-2 opacity-75"
        />
      </div>

      {/* 2. Large Display Heading (Fullname) */}
      <h1 className="display-4 fw-bold mb-3">
        <Placeholder
          color="light"
          rounded
          col={9}
          className="col-md-8 py-3"
        />
      </h1>

      {/* 3. Subtitle / Tagline */}
      <p className="lead mb-3">
        <Placeholder
          color="light"
          rounded
          col={10}
          className="col-md-9 py-2 opacity-75"
        />
      </p>

      {/* 4. Location */}
      <p className="mb-4">
        <Placeholder
          color="light"
          rounded
          col={5}
          className="col-md-4 py-1 opacity-50"
        />
      </p>

      {/* 5. CTA Button Skeletons */}
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-3 mb-4">
        <Placeholder
          color="light"
          rounded="pill"
          className="opacity-100"
          style={{ width: "160px", height: "42px" }}
        />
        <Placeholder
          color="light"
          rounded="pill"
          className="opacity-50"
          style={{ width: "140px", height: "42px" }}
        />
      </div>

      {/* 6. Social Media Circle Skeletons */}
      <div className="d-flex justify-content-center justify-content-md-start gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Placeholder
            key={i}
            color="light"
            rounded="circle"
            className="opacity-50"
            style={{ width: "36px", height: "36px" }}
          />
        ))}
      </div>
    </PlaceholderGlow>
  );
}
