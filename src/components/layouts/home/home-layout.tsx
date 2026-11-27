import Button from "@/components/ui/bootstrap/button";
import Header from "@/components/layouts/home/header";
import SideNav from "@/components/ui/customs/side-nav";
import ScrollToTop from "@/components/ui/customs/scroll-to-top";
import ChatbotUI from "@/components/ui/customs/chatbot-ui";
import { NavigationProvider } from "@/context/NavigationContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <Button
        as="a"
        href="#main-content"
        color="primary"
        className="visually-hidden-focusable position-fixed top-0 start-0 m-3 z-3"
      >
        Skip to main content
      </Button>
      <Header />
      <main id="main-content">{children}</main>
      <SideNav />
      <div
        className="position-fixed bottom-0 end-0 m-3 m-md-4 d-flex flex-row align-items-end gap-2"
        style={{ zIndex: 1040, pointerEvents: "none" }}
      >
        <ScrollToTop />
        <ChatbotUI />
      </div>
    </NavigationProvider>
  );
}
