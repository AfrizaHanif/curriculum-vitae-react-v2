import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Muhammad Afriza Hanif",
  description: "Latest articles and thoughts from Muhammad Afriza Hanif",
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
