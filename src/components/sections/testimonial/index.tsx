"use client";

import { useFetch } from "@/hooks/useFetch";
import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import { TestimonialApiResponse } from "@/types/testimonial";
import { CardGrid } from "@/components/ui/bootstrap/card";
import { useLanguage } from "@/context/LanguageContext";

import TestimonialCard from "./TestimonialCard";
import TestimonialGridSkeleton from "./TestimonialCardSkeleton";
import fallbackTestimonials from "@/data/jsons/testimonials.json";

export default function TestimonialSection() {
  const { t } = useLanguage();

  // Fetch API Data
  const { data, isLoading, error } = useFetch<TestimonialApiResponse>(
    `https://api.afrizahanif.com/api/testimonies?all=true`,
    { fallbackData: { data: fallbackTestimonials } },
  );
  const testimonials = data?.data ?? [];

  // Hide the section if there is an error or no data after loading
  if (error || (!isLoading && testimonials.length === 0)) {
    return null;
  }

  return (
    <Section id="testimonials" minFullHeight>
      {/* Section Header */}
      <SectionHeader
        title={t.sections.testimonial.title}
        subtitle={t.sections.testimonial.subtitle}
      />

      <div className="mt-4">
        {isLoading ? (
          <TestimonialGridSkeleton count={3} />
        ) : testimonials.length === 1 ? (
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <TestimonialCard testimonial={testimonials[0]} />
            </div>
          </div>
        ) : (
          <CardGrid lgCols={3} mdCols={2} smCols={1} gap={4}>
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </CardGrid>
        )}
      </div>
    </Section>
  );
}
