"use client";

import { Testimonial } from "@/types/testimonial";
import Card from "@/components/ui/bootstrap/card";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card
      key={testimonial.id}
      className="h-100 p-4 border-0 shadow-sm rounded-4 position-relative overflow-hidden d-flex flex-column justify-content-between transition-all"
    >
      {/* Decorative Quote Watermark in Corner */}
      <i
        className="bi bi-quote position-absolute top-0 end-0 m-3 text-primary opacity-10 display-3"
        style={{ pointerEvents: "none", lineHeight: 1 }}
        aria-hidden="true"
      />

      <div>
        {/* 5 Stars Rating */}
        <div
          className="d-flex align-items-center gap-1 text-warning mb-3"
          role="img"
          aria-label="5 out of 5 stars"
        >
          {[...Array(5)].map((_, i) => (
            <i key={i} className="bi bi-star-fill small" aria-hidden="true" />
          ))}
        </div>

        {/* Testimonial Quote Content */}
        {testimonial.content && (
          <p
            className="text-body fst-italic mb-4"
            style={{ lineHeight: "1.7", fontSize: "1.05rem" }}
          >
            &ldquo;{testimonial.content}&rdquo;
          </p>
        )}
      </div>

      {/* Author Footer Info */}
      <div className="d-flex align-items-center gap-3 pt-3 border-top mt-auto">
        <div
          className="rounded-circle bg-primary-subtle text-primary border border-primary-subtle d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0"
          style={{ width: 48, height: 48 }}
        >
          {testimonial.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h6 className="fw-bold text-body mb-0 text-truncate">
            {testimonial.name}
          </h6>
          <small className="text-body-secondary d-block text-truncate">
            {testimonial.role}
          </small>
        </div>
      </div>
    </Card>
  );
}
