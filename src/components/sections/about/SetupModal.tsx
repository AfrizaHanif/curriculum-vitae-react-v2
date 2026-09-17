"use client";

import { useMemo } from "react";
import type { Setup } from "@/types/setup";
import Modal from "@/components/ui/bootstrap/modal";
import NextImage from "@/components/ui/react/image";
import placeholderImage from "@/assets/images/placeholders/placeholder-image.png";
import { getShimmerDataUrl } from "@/lib/shimmer";
import { useLanguage } from "@/context/LanguageContext";
import Accordion, {
  AccordionItemProps,
} from "@/components/ui/bootstrap/accordion";
import Spinner from "@/components/ui/bootstrap/spinner";

interface SetupModalProps {
  setups: Setup[];
  setupImage?: string | null;
  isLoading?: boolean;
}

export default function SetupModal({
  setups = [],
  setupImage,
  isLoading = false,
}: SetupModalProps) {
  const { t } = useLanguage();

  const setupItems: AccordionItemProps[] = useMemo(() => {
    // Kelompokkan item per kategori
    const grouped = setups.reduce<Record<string, Setup[]>>((acc, item) => {
      const cat = item.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, items], index) => ({
      id: `setup-cat-${index}`,
      title: `${category} (${items.length})`,
      show: index === 0,
      content: (
        <div className="d-flex flex-column gap-3">
          {items.map((item, itemIdx) => (
            <div
              key={itemIdx}
              className="border-bottom pb-3 last:border-bottom-0"
            >
              <h6 className="fw-bold mb-1 text-primary">{item.name}</h6>
              <p className="mb-1 small text-body">{item.description}</p>
              {item.why && (
                <small className="text-body-secondary fst-italic">
                  &ldquo;{item.why}&rdquo;
                </small>
              )}
            </div>
          ))}
        </div>
      ),
    }));
  }, [setups]);

  return (
    <Modal
      id="workspace-setup-modal"
      title={t.sections.about.setupModal.title}
      size="xl"
      centered
      scrollable
      buttonItems={[
        {
          label: t.common.close,
          color: "secondary",
          size: "sm" as const,
          dismiss: true,
        },
      ]}
    >
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner
            color="primary"
            label={t.sections.about.setupModal.loading}
          />
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-md-6">
            {setupImage && (
              <div className="sticky-md-top mb-4 mb-md-0" style={{ top: 0 }}>
                <div className="rounded-4 overflow-hidden shadow-sm border position-relative">
                  <NextImage
                    src={setupImage || placeholderImage}
                    alt="Workspace Setup"
                    width={900}
                    height={450}
                    responsive
                    placeholder="blur"
                    blurDataURL={getShimmerDataUrl(900, 450)}
                    showSkeleton
                    showSpinner
                    enableZoom
                    modalTitle={t.sections.about.setupModal.title}
                    className="w-100 object-fit-cover"
                    style={{ maxHeight: "380px" }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 m-3 px-3 py-1.5 rounded-pill bg-dark bg-opacity-75 text-white d-flex align-items-center gap-2 small shadow-sm"
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    <i className="bi bi-display" />
                    <span className="fw-medium">
                      {t.sections.about.setupModal.badgePhoto}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <Accordion item={setupItems} />
          </div>
        </div>
      )}
    </Modal>
  );
}
