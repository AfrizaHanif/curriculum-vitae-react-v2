"use client";

import Placeholder from "@/components/ui/bootstrap/placeholder";

export default function AboutSkeleton() {
  return (
    <Placeholder.Glow>
      {/* Quick Info Badges Skeleton */}
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <Placeholder
          rounded="pill"
          color="secondary"
          className="opacity-50"
          style={{ width: "160px", height: "36px" }}
        />
        <Placeholder
          rounded="pill"
          color="secondary"
          className="opacity-50"
          style={{ width: "120px", height: "36px" }}
        />
      </div>

      {/* Tagline / Subtitle Skeleton */}
      <div className="mb-3">
        <Placeholder as="div" col={8} size="lg" className="rounded py-2" />
      </div>

      {/* Description Paragraph Skeleton */}
      <div className="mb-4 d-flex flex-column gap-2">
        <Placeholder as="div" col={12} className="rounded py-1 opacity-75" />
        <Placeholder as="div" col={11} className="rounded py-1 opacity-75" />
        <Placeholder as="div" col={9} className="rounded py-1 opacity-75" />
        <Placeholder as="div" col={6} className="rounded py-1 opacity-50" />
      </div>

      {/* Philosophy Quote Card Skeleton */}
      <div className="card bg-body-tertiary border-0 border-start border-primary border-4 p-3 rounded-3 mb-4 shadow-sm">
        <div className="d-flex flex-column gap-2">
          <Placeholder as="div" col={10} className="rounded py-1 opacity-75" />
          <Placeholder as="div" col={7} className="rounded py-1 opacity-50" />
        </div>
      </div>
    </Placeholder.Glow>
  );
}
