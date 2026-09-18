/**
 * Centralized Site Configuration
 *
 * Single source of truth for application settings, navigation behaviors,
 * pagination/display limits, API routes, and third-party integrations.
 */

export interface SectionConfigItem {
  id: string;
  icon: string;
}

export interface ResponsiveItemsPerPageConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
  ultrawide: number;
}

export const siteConfig = {
  /**
   * Site & Author Information for SEO, OpenGraph, and Schema.org JSON-LD
   */
  site: {
    name: "Muhammad Afriza Hanif",
    jobTitle: "Web Developer & Software Engineer",
    description:
      "Curriculum Vitae & Professional Portfolio of Muhammad Afriza Hanif. Web Developer specializing in modern frontend, React, Next.js, and web application solutions.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://afrizahanif.com",
    profileImage: "https://api.afrizahanif.com/api/storage/images/Profile.jpg",
    address: {
      locality: "Sidoarjo",
      region: "Jawa Timur",
      country: "ID",
    },
    alumniOf: "Universitas Dinamika",
    socials: {
      github: "https://github.com/afrizahanif",
      linkedin: "https://linkedin.com/in/afrizahanif",
    },
  },

  /**
   * Navigation Settings
   */
  navigation: {
    /**
     * URL hash update behavior when scrolling or clicking section links:
     * - false (Option A - Clean URL): hides '#' from the URL bar while smoothly scrolling.
     * - true (Option B - Deep Linking): updates the browser address bar with '#section-id' for history & sharing.
     */
    updateUrlHash: false,

    /**
     * Sections displayed in navigation menu and side nav.
     */
    sections: [
      { id: "hero", icon: "bi-house-door" },
      { id: "about", icon: "bi-person" },
      { id: "skills", icon: "bi-tools" },
      { id: "projects", icon: "bi-code-square" },
      { id: "edu-exp", icon: "bi-briefcase" },
      { id: "certifications", icon: "bi-award" },
      { id: "testimonials", icon: "bi-chat-quote" },
      { id: "contact", icon: "bi-envelope" },
    ] as const satisfies readonly SectionConfigItem[],
  },

  /**
   * Projects & Portfolios Section Configuration
   */
  projects: {
    /**
     * Responsive items per slide/page matching CardGrid breakpoints:
     * - mobile (< 768px): 1 card
     * - tablet (768px - 991px): 2 cards
     * - desktop (992px - 1199px): 3 cards
     * - wide (1200px - 1399px / Large Desktop): 3 cards
     * - ultrawide (>= 1400px / Ultrawide & 4K displays): 4 cards
     */
    itemsPerPage: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 3,
      ultrawide: 4,
    } as ResponsiveItemsPerPageConfig,
    /** Default maximum number of technology badges visible before "+N more" badge */
    technologyBadgesLimit: 3,
  },

  /**
   * Certification Section Configuration
   */
  certifications: {
    /** Number of featured certificates shown on main page before opening archive modal */
    featuredLimit: 6,
  },

  /**
   * Contact Section & Third-Party Integration Configuration
   */
  contact: {
    formspreeFormId: process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "",
    isMockSubmission: process.env.NEXT_PUBLIC_MOCK_SUBMISSION === "true",
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
  },

  /**
   * Map Settings (Leaflet / OpenStreetMap)
   */
  map: {
    defaultZoom: 15,
    tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
  },

  /**
   * API Base URL & Endpoints
   */
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.afrizahanif.com/api",
    endpoints: {
      profiles: "/profiles",
      setups: "/setups?all=true",
      experiences: "/experiences?all=true",
      educations: "/educations?all=true",
      skills: "/skills?all=true",
      projects: "/projects?all=true",
      featureProjects: "/feature-projects?all=true",
      portfolios: "/portfolios?all=true",
      features: "/features?all=true",
      repositories: "/repositories?all=true",
      caseStudies: "/case-studies?all=true",
      diagrams: "/diagrams?all=true",
      solutions: "/solutions?all=true",
      certificates: "/certificates?all=true",
      testimonies: "/testimonies?all=true",
      socials: "/socials",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type ApiEndpointKey = keyof typeof siteConfig.api.endpoints;

/**
 * Returns the fully qualified API URL for a given configured endpoint key.
 * Example: getApiUrl("certificates") -> "https://api.afrizahanif.com/api/certificates?all=true"
 */
export function getApiUrl(key: ApiEndpointKey): string {
  return `${siteConfig.api.baseUrl}${siteConfig.api.endpoints[key]}`;
}
