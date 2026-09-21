import Header from "@/components/layouts/home/header";
import SideNav from "@/components/ui/customs/side-nav";
import ScrollToTop from "@/components/ui/customs/scroll-to-top";
import { NavigationProvider } from "@/context/NavigationContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <a
        href="#main-content"
        className="visually-hidden-focusable position-fixed top-0 start-0 m-3 btn btn-primary z-3"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <SideNav />
      <ScrollToTop />
    </NavigationProvider>
  );
}
