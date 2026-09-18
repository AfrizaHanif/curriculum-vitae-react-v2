// src/app/(pages)/resume/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum Vitae & Resume",
  description:
    "Print-friendly & ATS-compliant Curriculum Vitae of Muhammad Afriza Hanif",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
