import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const devOrigins =
  "http://localhost:8000 http://127.0.0.1:8000 http://localhost:8001 http://127.0.0.1:8001";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://api.afrizahanif.com ${isDev ? devOrigins : ""} https://*.ytimg.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://www.gstatic.com https://cdn.simpleicons.org;
    font-src 'self' data:;
    connect-src 'self' https://api.afrizahanif.com ${isDev ? devOrigins : ""} https://*.tile.openstreetmap.org https://formspree.io https://www.google.com https://www.gstatic.com https://recaptcha.google.com;
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://formspree.io;
    frame-ancestors 'self';
    ${isDev ? "" : "upgrade-insecure-requests;"}
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(process.cwd(), "node_modules")],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.afrizahanif.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
