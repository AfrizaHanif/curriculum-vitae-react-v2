import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { siteConfig } from "@/config/siteConfig";

// Site URL
const siteUrl = siteConfig.site.url;

// Metadata
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.site.name} | Web Developer & Software Engineer Portfolio`,
    template: `%s | ${siteConfig.site.name}`,
  },
  description: siteConfig.site.description,
  keywords: [
    "Muhammad Afriza Hanif",
    "Web Developer",
    "Frontend Developer",
    "Fullstack Developer",
    "Laravel Developer",
    "React",
    "Next.js",
    "Portofolio",
    "Curriculum Vitae",
  ],
  authors: [{ name: siteConfig.site.name, url: siteUrl }],
  creator: siteConfig.site.name,
  openGraph: {
    type: "profile",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    url: siteUrl,
    title: `${siteConfig.site.name} | Web Developer Portfolio`,
    description:
      "Explore projects, verified certifications, and professional background of Muhammad Afriza Hanif.",
    siteName: `${siteConfig.site.name} Portfolio`,
    images: [
      {
        url: siteConfig.site.profileImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.site.name} Portfolio Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.site.name} | Web Developer Portfolio`,
    description:
      "Explore projects, verified certifications, and professional background of Muhammad Afriza Hanif.",
    images: [siteConfig.site.profileImage],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
};

// JSON-LD
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.site.name,
  url: siteConfig.site.url,
  image: siteConfig.site.profileImage,
  jobTitle: siteConfig.site.jobTitle,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.site.address.locality,
    addressRegion: siteConfig.site.address.region,
    addressCountry: siteConfig.site.address.country,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: siteConfig.site.alumniOf,
  },
  sameAs: [siteConfig.site.socials.github, siteConfig.site.socials.linkedin],
};

export default function RootLayout(
  // { children }: LayoutProps<"/">
  { children }: { children: React.ReactNode },
) {
  return (
    <html
      lang="en"
      data-bs-theme="auto"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Scripts (Exclusively on Head) */}
        {/* Theme Detection (Vanilla Script) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'auto';
                  var resolved = theme === 'auto'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                  document.documentElement.setAttribute('data-bs-theme', resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <BootstrapClient />
            {/* <PageLoader /> */}
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

/*
  Notes
  - This is a global layout. The router will render the page inside this layout.
  - Do not change the HTML code (Except when adding provider, or layout component (Like Header, Sidebar, or Footer))
  - Do not edit meta, json-ld, or scripts tag, unless if there's a need to update
  - Only put `<script>` tags before `</body>` for heavy executable JavaScript files (e.g., third-party widgets, analytics, large bundles) to prevent them from blocking HTML rendering.
  - Only put `<script>` tags in `<head>` if the script is required for the page to function (e.g., theme detection, polyfills, essential third-party scripts).
*/
