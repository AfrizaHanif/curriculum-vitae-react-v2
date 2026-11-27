export interface LocalizedText {
  id?: string;
  en?: string;
}

export interface LocalizedList {
  id?: string[];
  en?: string[];
}

function pickText(
  value: string | LocalizedText | null | undefined,
  preferred: "id" | "en" = "id",
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[preferred] || value.en || value.id || "";
}

function pickList(
  value: string[] | LocalizedList | null | undefined,
  preferred: "id" | "en" = "id",
): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value[preferred] || value.en || value.id || [];
}

/**
 * Builds a compact plain-text CV context from bundled JSON data.
 * Dynamically imported only when the backend context endpoint and localStorage cache are unavailable.
 */
export async function buildFallbackCvContext(): Promise<string> {
  const [
    profilesMod,
    experiencesMod,
    educationsMod,
    skillsMod,
    projectsMod,
    portfoliosMod,
    certificatesMod,
    socialsMod,
  ] = await Promise.all([
    import("@/data/jsons/profiles.json"),
    import("@/data/jsons/experiences.json"),
    import("@/data/jsons/educations.json"),
    import("@/data/jsons/skills.json"),
    import("@/data/jsons/projects.json"),
    import("@/data/jsons/portfolios.json"),
    import("@/data/jsons/certificates.json"),
    import("@/data/jsons/socials.json"),
  ]);

  const sections: string[] = [];

  const profile = profilesMod.default?.[0];
  if (profile) {
    sections.push(
      [
        "## Profil",
        `Nama: ${profile.fullname_with_title || profile.fullname}`,
        `Status/Peran: ${profile.status}`,
        `Lokasi: ${profile.current_city}, ${profile.current_province}`,
        `Email: ${profile.email}`,
        `Tagline: ${pickText(profile.tagline)}`,
        `Ringkasan: ${pickText(profile.description)}`,
      ].join("\n"),
    );
  }

  const educations = educationsMod.default ?? [];
  if (educations.length > 0) {
    const lines = educations.map(
      (edu) =>
        `- ${edu.institution} (${pickText(edu.degree_labels)} ${pickText(edu.major)}, ${edu.start_period} s.d. ${edu.finish_period}, IPK ${edu.gpa}/${edu.max_gpa})`,
    );
    sections.push(["## Pendidikan", ...lines].join("\n"));
  }

  const experiences = experiencesMod.default ?? [];
  if (experiences.length > 0) {
    const lines = experiences.map((exp) => {
      const highlights = pickList(exp.description).slice(0, 2).join(" ");
      return `- ${exp.title} di ${exp.company} (${exp.start_period} s.d. ${exp.finish_period || "Sekarang"}): ${highlights}`;
    });
    sections.push(["## Pengalaman Kerja", ...lines].join("\n"));
  }

  const skills = skillsMod.default ?? [];
  if (skills.length > 0) {
    const skillNames = skills.map((s) => s.name).join(", ");
    sections.push(`## Keahlian\n${skillNames}`);
  }

  const projects = [...(portfoliosMod.default ?? []), ...(projectsMod.default ?? [])];
  if (projects.length > 0) {
    const lines = projects.slice(0, 10).map((item) => {
      const tech = Array.isArray(item.technology)
        ? item.technology.join(", ")
        : "";
      const desc = Array.isArray(item.description?.id)
        ? item.description.id[0]
        : pickText(item.description as string | LocalizedText);
      return `- ${pickText(item.title)}${tech ? ` [${tech}]` : ""}: ${desc}`;
    });
    sections.push(["## Proyek & Portofolio", ...lines].join("\n"));
  }

  const featuredCerts = (certificatesMod.default ?? [])
    .filter((c) => c.is_featured)
    .slice(0, 8);
  if (featuredCerts.length > 0) {
    const lines = featuredCerts.map(
      (c) => `- ${c.title} (${c.issuer}, ${c.issued_date})`,
    );
    sections.push(["## Sertifikasi Utama", ...lines].join("\n"));
  }

  const socials = socialsMod.default ?? [];
  if (socials.length > 0) {
    const lines = socials.map((s) => `- ${s.name}: ${s.url}`);
    sections.push(["## Tautan Sosial", ...lines].join("\n"));
  }

  return sections.join("\n\n");
}
