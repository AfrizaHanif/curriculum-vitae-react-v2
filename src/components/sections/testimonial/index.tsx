"use client";

import { useFetch } from "@/hooks/useFetch";
import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import { TestimonialApiResponse } from "@/types/testimonial";
import { CardGrid } from "@/components/ui/bootstrap/card";
import { useLanguage } from "@/context/LanguageContext";

import Spinner from "@/components/ui/bootstrap/spinner";
import TestimonialCard from "./TestimonialCard";
import fallbackTestimonials from "@/data/jsons/testimonials.json";

export default function TestimonialSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useFetch<TestimonialApiResponse>(
    `https://api.afrizahanif.com/api/testimonies?all=true`,
    { fallbackData: { data: fallbackTestimonials } },
  );
  const testimonials = data?.data ?? [];

  // Sembunyikan section hanya jika terjadi error atau data kosong setelah selesai dimuat
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
          <div className="d-flex justify-content-center py-5">
            <Spinner color="primary" label={t.sections.testimonial.loading} />
          </div>
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
