"use client";

import Card, { CardGrid } from "@/components/ui/bootstrap/card";
import Placeholder from "@/components/ui/bootstrap/placeholder";

export function CertificateCardSkeleton() {
  return (
    <Card
      fullHeight
      className="shadow-sm rounded-4 border h-100"
      header={
        <Placeholder.Glow className="d-flex justify-content-between align-items-center">
          <Placeholder
            rounded="pill"
            style={{ width: "90px", height: "24px" }}
            className="opacity-50"
          />
          <Placeholder as="div" col={3} className="rounded py-1 opacity-50" />
        </Placeholder.Glow>
      }
      footer={
        <Placeholder.Glow className="d-flex justify-content-between align-items-center gap-2">
          <Placeholder as="div" col={4} className="rounded py-1 opacity-50" />
          <Placeholder
            rounded="pill"
            style={{ width: "80px", height: "30px" }}
            className="opacity-75 ms-auto"
          />
        </Placeholder.Glow>
      }
    >
      <Placeholder.Glow>
        {/* Certificate Title Skeleton */}
        <div className="mb-2">
          <Placeholder as="div" col={10} size="lg" className="rounded py-1" />
        </div>
        {/* Issuer Name Skeleton */}
        <div className="d-flex align-items-center gap-2">
          <Placeholder
            rounded="circle"
            style={{ width: "16px", height: "16px" }}
            className="opacity-50"
          />
          <Placeholder as="div" col={6} className="rounded py-1 opacity-75" />
        </div>
      </Placeholder.Glow>
    </Card>
  );
}

export default function CertificateGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <CardGrid lgCols={3} mdCols={2} smCols={1} gap={4}>
      {Array.from({ length: count }).map((_, idx) => (
        <CertificateCardSkeleton key={idx} />
      ))}
    </CardGrid>
  );
}
