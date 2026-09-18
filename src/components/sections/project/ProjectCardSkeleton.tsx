"use client";

import Card, { CardGrid } from "@/components/ui/bootstrap/card";
import Placeholder from "@/components/ui/bootstrap/placeholder";

export function ProjectCardSkeleton() {
  return (
    <Card
      className="shadow-sm rounded-4 border h-100"
      fullHeight
      header={
        <Placeholder.Glow className="d-flex justify-content-between align-items-center">
          <Placeholder
            rounded="pill"
            style={{ width: "90px", height: "24px" }}
            className="opacity-50"
          />
          <Placeholder
            rounded="pill"
            style={{ width: "70px", height: "24px" }}
            className="opacity-50"
          />
        </Placeholder.Glow>
      }
      footer={
        <Placeholder.Glow className="d-flex justify-content-between align-items-center w-100">
          <Placeholder as="div" col={4} className="rounded py-1 opacity-50" />
          <Placeholder
            rounded="pill"
            style={{ width: "90px", height: "32px" }}
            className="opacity-75"
          />
        </Placeholder.Glow>
      }
    >
      <Placeholder.Glow>
        {/* 16:9 Image Thumbnail Skeleton */}
        <div
          className="w-100 rounded-3 mb-3 overflow-hidden"
          style={{ aspectRatio: "16 / 9" }}
        >
          <Placeholder
            className="w-100 h-100 d-block"
            color="secondary"
            style={{ opacity: 0.3 }}
          />
        </div>

        {/* Title Skeleton */}
        <div className="mb-2">
          <Placeholder as="div" col={8} size="lg" className="rounded py-1" />
        </div>

        {/* Description Skeleton */}
        <div className="d-flex flex-column gap-1 mb-3">
          <Placeholder as="div" col={12} className="rounded py-1 opacity-50" />
          <Placeholder as="div" col={10} className="rounded py-1 opacity-50" />
        </div>

        {/* Tech Badges Skeleton */}
        <div className="d-flex flex-wrap gap-1">
          <Placeholder
            rounded="pill"
            style={{ width: "60px", height: "20px" }}
            className="opacity-50"
          />
          <Placeholder
            rounded="pill"
            style={{ width: "75px", height: "20px" }}
            className="opacity-50"
          />
          <Placeholder
            rounded="pill"
            style={{ width: "55px", height: "20px" }}
            className="opacity-50"
          />
        </div>
      </Placeholder.Glow>
    </Card>
  );
}

export default function ProjectGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <CardGrid xxlCols={4} xlCols={3} lgCols={3} mdCols={2} smCols={1}>
      {Array.from({ length: count }).map((_, idx) => (
        <ProjectCardSkeleton key={idx} />
      ))}
    </CardGrid>
  );
}
