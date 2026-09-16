"use client";

import { ReactNode, useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { sortByLatestPeriod } from "@/utils/date";
import { ApiResponse } from "@/types/api";
import { Education } from "@/types/education";
import { Experience } from "@/types/experience";
import Section from "@/components/ui/customs/section";
import SectionHeader from "@/components/ui/customs/section-header";
import NavTab, { NavTabItem } from "@/components/ui/bootstrap/nav-tab";
import Alert from "@/components/ui/bootstrap/alert";
const LocationMapModal = dynamic(() => import("./location-map-modal"), {
  ssr: false,
});

import TimelineItem, { TimelineItemData } from "./TimelineItem";
import TimelineSkeleton from "./TimelineSkeleton";
import "./timeline.css";
import { useLanguage } from "@/context/LanguageContext";
import fallbackEducations from "@/data/jsons/educations.json";
import fallbackExperiences from "@/data/jsons/experiences.json";
import dynamic from "next/dynamic";

interface TimelineTabContentProps {
  isLoading: boolean;
  error: Error | null;
  itemsCount: number;
  loadingLabel?: string;
  errorLabel: string;
  emptyLabel: string;
  children: ReactNode;
}

function TimelineTabContent({
  isLoading,
  error,
  itemsCount,
  errorLabel,
  emptyLabel,
  children,
}: TimelineTabContentProps) {
  // Loading state
  if (isLoading) {
    return <TimelineSkeleton count={3} />;
  }

  // Error state
  if (error) {
    return (
      <Alert color="danger" className="mx-auto" style={{ maxWidth: "600px" }}>
        {errorLabel}: {error.message}
      </Alert>
    );
  }

  // Empty state
  if (itemsCount === 0) {
    return <p className="text-center text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="timeline-container">
      <div className="timeline">{children}</div>
    </div>
  );
}

export default function EduExpSection() {
  const { t } = useLanguage();
  // Fetch education data
  const {
    data: eduData,
    isLoading: eduLoading,
    error: eduError,
  } = useFetch<ApiResponse<Education[]>>(
    "https://api.afrizahanif.com/api/educations?all=true",
    { fallbackData: { data: fallbackEducations } },
  );
  const educations = useMemo(
    () => sortByLatestPeriod(eduData?.data ?? []),
    [eduData?.data],
  );

  // Fetch experience data
  const {
    data: expData,
    isLoading: expLoading,
    error: expError,
  } = useFetch<ApiResponse<Experience[]>>(
    "https://api.afrizahanif.com/api/experiences?all=true",
    { fallbackData: { data: fallbackExperiences } },
  );
  const experiences = useMemo(
    () => sortByLatestPeriod(expData?.data ?? []),
    [expData?.data],
  );

  // Selected item for Location Map Modal
  const [selectedMapItem, setSelectedMapItem] =
    useState<TimelineItemData | null>(null);

  // Tab items
  const tabItems: NavTabItem[] = [
    {
      id: "edu-tab",
      title: t.sections.eduExp.tabs.education,
      content: (
        <TimelineTabContent
          isLoading={eduLoading}
          error={eduError}
          itemsCount={educations.length}
          loadingLabel={t.sections.eduExp.loadingEducation}
          errorLabel={t.sections.eduExp.errorEducation}
          emptyLabel={t.sections.eduExp.emptyEducation}
        >
          {educations.map((edu) => (
            <TimelineItem
              key={edu.id}
              icon="bi-mortarboard-fill"
              locationIcon="bi-bank"
              item={{
                id: edu.id,
                title: `${edu.degree} — ${edu.major}`,
                location: edu.location,
                start_period: edu.start_period,
                finish_period: edu.finish_period,
                status: edu.status,
                address: edu.address,
                gpa: edu.gpa,
                description: edu.description,
                latitude: edu.latitude,
                longitude: edu.longitude,
              }}
              onViewMap={setSelectedMapItem}
            />
          ))}
        </TimelineTabContent>
      ),
    },
    {
      id: "exp-tab",
      title: t.sections.eduExp.tabs.experience,
      content: (
        <TimelineTabContent
          isLoading={expLoading}
          error={expError}
          itemsCount={experiences.length}
          loadingLabel={t.sections.eduExp.loadingExperience}
          errorLabel={t.sections.eduExp.errorExperience}
          emptyLabel={t.sections.eduExp.emptyExperience}
        >
          {experiences.map((exp) => (
            <TimelineItem
              key={exp.id}
              icon="bi-briefcase-fill"
              locationIcon="bi-building"
              item={{
                id: exp.id,
                title: exp.title,
                location: exp.location,
                start_period: exp.start_period,
                finish_period: exp.finish_period,
                status: exp.status,
                address: exp.address,
                description: exp.description,
                latitude: exp.latitude,
                longitude: exp.longitude,
              }}
              onViewMap={setSelectedMapItem}
            />
          ))}
        </TimelineTabContent>
      ),
    },
  ];

  return (
    <Section id="edu-exp" minFullHeight>
      {/* Section Header */}
      <SectionHeader
        className="text-center mb-4"
        title={t.sections.eduExp.title}
        subtitle={t.sections.eduExp.subtitle}
      />

      {/* Tabs */}
      <NavTab
        id="experience-education-tabs"
        items={tabItems}
        variant="pills"
        className="timeline-pills-container"
        navClassName="justify-content-center gap-1"
        defaultActiveIndex={0}
      />

      {/* Reusable Location Map Modal */}
      {selectedMapItem &&
        selectedMapItem.latitude &&
        selectedMapItem.longitude && (
          <LocationMapModal
            show={!!selectedMapItem}
            onClose={() => setSelectedMapItem(null)}
            title={selectedMapItem.location}
            subtitle={selectedMapItem.title}
            address={selectedMapItem.address}
            latitude={selectedMapItem.latitude}
            longitude={selectedMapItem.longitude}
          />
        )}
    </Section>
  );
}
