import HomeLayout from "@/components/layouts/home/home-layout";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeLayout>{children}</HomeLayout>;
}
