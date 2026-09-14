"use client";

import AboutSection from "@/components/sections/about";
import CertificationSection from "@/components/sections/certification";
import ContactSection from "@/components/sections/contact";
import EduExpSection from "@/components/sections/edu-exp";
import HeroSection from "@/components/sections/hero";
import ProjectSection from "@/components/sections/project";
import SkillSection from "@/components/sections/skill";
import TestimonialSection from "@/components/sections/testimonial";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillSection />
      <ProjectSection />
      <EduExpSection />
      <CertificationSection />
      <TestimonialSection />
      <ContactSection />
    </>
  );
}
