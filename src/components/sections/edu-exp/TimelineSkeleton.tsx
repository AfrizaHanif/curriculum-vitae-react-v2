"use client";

import Placeholder from "@/components/ui/bootstrap/placeholder";

export function TimelineItemSkeleton() {
  return (
    <div className="timeline-item">
      {/* Circle marker skeleton */}
      <div className="timeline-dot" aria-hidden="true">
        <span
          className="placeholder rounded-circle bg-primary opacity-50"
          style={{ width: "12px", height: "12px" }}
        />
      </div>

      {/* Content Card Skeleton */}
      <div className="timeline-card">
        <Placeholder.Glow>
          {/* Header Badges */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
            <Placeholder
              rounded="pill"
              className="opacity-50"
              style={{ width: "120px", height: "24px" }}
            />
            <Placeholder
              rounded="pill"
              className="opacity-50"
              style={{ width: "80px", height: "24px" }}
            />
          </div>

          {/* Title Skeleton */}
          <div className="mb-2">
            <Placeholder as="div" col={7} size="lg" className="rounded py-1" />
          </div>

          {/* Subtitle & Location Skeleton */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <Placeholder as="div" col={4} className="rounded py-1 opacity-50" />
            <Placeholder as="div" col={3} className="rounded py-1 opacity-50" />
          </div>

          {/* Description Lines Skeleton */}
          <div className="d-flex flex-column gap-1">
            <Placeholder as="div" col={12} className="rounded py-1 opacity-50" />
            <Placeholder as="div" col={10} className="rounded py-1 opacity-50" />
          </div>
        </Placeholder.Glow>
      </div>
    </div>
  );
}

export default function TimelineSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="timeline-container">
      <div className="timeline">
        {Array.from({ length: count }).map((_, idx) => (
          <TimelineItemSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
