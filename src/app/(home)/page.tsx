import dynamic from "next/dynamic";

import HeroSection from "@/components/sections/hero";
import AboutSection from "@/components/sections/about";
import SkillSection from "@/components/sections/skill";
import ProjectSection from "@/components/sections/project";
import EduExpSection from "@/components/sections/edu-exp";
const CertificationSection = dynamic(
  () => import("@/components/sections/certification"),
);
const TestimonialSection = dynamic(
  () => import("@/components/sections/testimonial"),
);
const ContactSection = dynamic(() => import("@/components/sections/contact"));

export default function Home() {
  return (
    <>
      {/* Above-the-fold */}
      <HeroSection />
      <AboutSection />
      <SkillSection />
      <ProjectSection />
      <EduExpSection />
      {/* Below-the-fold */}
      <CertificationSection />
      <TestimonialSection />
      <ContactSection />
    </>
  );
}

/*
  Notes
  - For landing page, below-the-fold is usually last 3-5 sections. Use <dynamic> to import those sections (except when importing sections that are already imported). Do not add ssr: false.
  - Sections should be ordered from top to bottom (from above-the-fold to below-the-fold).
*/
