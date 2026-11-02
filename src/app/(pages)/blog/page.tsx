import Footer from "@/components/layouts/home/footer";
import PageHeader from "@/components/layouts/pages/page-header";
import "./blog.css";
import UnderConstruction from "@/components/ui/UnderConstruction";

export default function BlogPage() {
  return (
    <div
      className="d-flex flex-column min-vh-100 bg-body-tertiary"
      style={{ paddingTop: "75px" }}
    >
      <PageHeader fullname="Resume" withLogo />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center text-center p-4">
        <UnderConstruction />
      </main>
      <Footer className="blog-footer mt-auto d-print-none" />
    </div>
  );
}
