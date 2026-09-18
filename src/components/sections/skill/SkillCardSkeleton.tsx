"use client";

import Card from "@/components/ui/bootstrap/card";
import { CardGrid } from "@/components/ui/bootstrap/card";
import Placeholder from "@/components/ui/bootstrap/placeholder";

export function SkillCardSkeleton() {
  return (
    <Card className="h-100 p-1 border-0 shadow-sm rounded-4">
      <Placeholder.Glow>
        <div className="d-flex align-items-center gap-3 mb-3">
          {/* Tech Icon Box Skeleton */}
          <Placeholder
            className="rounded-3 opacity-50 flex-shrink-0"
            style={{ width: 48, height: 48 }}
          />

          <div className="flex-grow-1 min-w-0 d-flex flex-column gap-1">
            <Placeholder as="div" col={8} className="rounded py-1" />
            <Placeholder
              rounded="pill"
              className="opacity-50"
              style={{ width: "65px", height: "18px" }}
            />
          </div>
        </div>

        {/* Since / Experience Info Skeleton */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
          <Placeholder as="div" col={5} className="rounded py-1 opacity-50" />
          <Placeholder
            rounded="pill"
            className="opacity-50"
            style={{ width: "50px", height: "18px" }}
          />
        </div>
      </Placeholder.Glow>
    </Card>
  );
}

export default function SkillGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <CardGrid
      xxlCols={5}
      xlCols={4}
      lgCols={4}
      mdCols={3}
      smCols={2}
      cols={1}
      gap={3}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <SkillCardSkeleton key={idx} />
      ))}
    </CardGrid>
  );
}
