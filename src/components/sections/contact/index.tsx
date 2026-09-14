"use client";

import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import Footer from "@/components/layouts/footer";
import { useFetch } from "@/hooks/useFetch";
import fallbackProfiles from "@/data/jsons/profiles.json";
import type { ProfileApiResponse } from "@/types/profile";
import Spinner from "@/components/ui/bootstrap/spinner";
import ContactInfoCard from "./ContactInfoCard";
import ContactForm from "./ContactForm";
import "./contact.css";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactSection() {
  const { t } = useLanguage();
  // Fetch profile data
  const { data, isLoading } = useFetch<ProfileApiResponse>(
    `https://api.afrizahanif.com/api/profiles`,
    { fallbackData: { data: fallbackProfiles } },
  );
  const profile = data?.data?.[0];

  return (
    <Section
      id="contact"
      className="pb-5 bg-primary contact-line-grid text-white"
      minFullHeight
      container={false}
    >
      <div className="contact-top-fade" />
      <div
        className="container position-relative z-2"
        style={{
          paddingBottom: "var(--footer-height, 5rem)",
        }}
      >
        {/* Section Header */}
        <SectionHeader
          title={t.sections.contact.title}
          subtitle={t.sections.contact.subtitle}
          subtitleClassName="text-white-50"
        />

        {isLoading ? (
          <div className="d-flex align-items-center gap-2 mt-3">
            <Spinner
              size="sm"
              color="light"
              label={t.sections.contact.loading}
            />
            <span>{t.sections.contact.loading}</span>
          </div>
        ) : profile ? (
          <div className="row g-4 align-items-stretch">
            {/* Contact Info Card */}
            <div className="col-12 col-lg-4">
              <ContactInfoCard profile={profile} />
            </div>
            {/* Contact Form */}
            <div className="col-12 col-lg-8">
              <ContactForm />
            </div>
          </div>
        ) : (
          <p className="mt-3">{t.sections.contact.empty}</p>
        )}
      </div>
      <Footer />
    </Section>
  );
}
