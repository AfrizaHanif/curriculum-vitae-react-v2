"use client";

import Card, { CardGrid } from "@/components/ui/bootstrap/card";
import Placeholder from "@/components/ui/bootstrap/placeholder";

export function TestimonialCardSkeleton() {
  return (
    <Card className="h-100 p-4 border-0 shadow-sm rounded-4 position-relative overflow-hidden d-flex flex-column justify-content-between">
      <Placeholder.Glow>
        {/* Stars Placeholder */}
        <div className="d-flex align-items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Placeholder
              key={i}
              rounded="circle"
              style={{ width: "14px", height: "14px" }}
              className="opacity-50"
            />
          ))}
        </div>

        {/* Quote Content Skeleton */}
        <div className="d-flex flex-column gap-2 mb-4">
          <Placeholder as="div" col={12} className="rounded py-1 opacity-75" />
          <Placeholder as="div" col={10} className="rounded py-1 opacity-75" />
          <Placeholder as="div" col={7} className="rounded py-1 opacity-50" />
        </div>

        {/* Author Footer Skeleton */}
        <div className="d-flex align-items-center gap-3 pt-3 border-top mt-auto">
          <Placeholder
            rounded="circle"
            style={{ width: 48, height: 48 }}
            className="flex-shrink-0 opacity-50"
          />
          <div className="flex-grow-1 d-flex flex-column gap-1">
            <Placeholder as="div" col={6} className="rounded py-1" />
            <Placeholder as="div" col={4} className="rounded py-1 opacity-50" />
          </div>
        </div>
      </Placeholder.Glow>
    </Card>
  );
}

export default function TestimonialGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <CardGrid lgCols={3} mdCols={2} smCols={1} gap={4}>
      {Array.from({ length: count }).map((_, idx) => (
        <TestimonialCardSkeleton key={idx} />
      ))}
    </CardGrid>
  );
}
