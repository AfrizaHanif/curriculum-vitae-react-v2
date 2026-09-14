import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import Header from "@/components/layouts/header";
// import Footer from "@/components/layouts/footer";
import SideNav from "@/components/ui/customs/side-nav";
import ScrollToTop from "@/components/ui/customs/scroll-to-top";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavigationProvider } from "@/context/NavigationContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afrizahanif.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Muhammad Afriza Hanif | Web Developer & Software Engineer Portfolio",
    template: "%s | Muhammad Afriza Hanif",
  },
  description:
    "Curriculum Vitae & Professional Portfolio of Muhammad Afriza Hanif. Web Developer specializing in modern frontend, React, Next.js, and web application solutions.",
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
  authors: [{ name: "Muhammad Afriza Hanif", url: siteUrl }],
  creator: "Muhammad Afriza Hanif",
  openGraph: {
    type: "profile",
    locale: "en_US",
    alternateLocale: ["id_ID"],
    url: siteUrl,
    title: "Muhammad Afriza Hanif | Web Developer Portfolio",
    description:
      "Explore projects, verified certifications, and professional background of Muhammad Afriza Hanif.",
    siteName: "Muhammad Afriza Hanif Portfolio",
    images: [
      {
        url: "https://api.afrizahanif.com/api/storage/images/Profile.jpg",
        width: 1200,
        height: 630,
        alt: "Muhammad Afriza Hanif Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Afriza Hanif | Web Developer Portfolio",
    description:
      "Explore projects, verified certifications, and professional background of Muhammad Afriza Hanif.",
    images: ["https://api.afrizahanif.com/api/storage/images/Profile.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: process.env.NODE_ENV === "production",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Afriza Hanif",
  url: "https://afrizahanif.com",
  image: "https://api.afrizahanif.com/api/storage/images/Profile.jpg",
  jobTitle: "Web Developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sidoarjo",
    addressRegion: "Jawa Timur",
    addressCountry: "ID",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universitas Dinamika",
  },
  sameAs: [
    "https://github.com/afrizahanif",
    "https://linkedin.com/in/afrizahanif",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-bs-theme="auto" suppressHydrationWarning>
      <head>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            {/* <PageLoader /> */}
            <NavigationProvider>
              <BootstrapClient />
              <main>
                <Header />
                {children}
              </main>
              <SideNav />
              <ScrollToTop />
            </NavigationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
