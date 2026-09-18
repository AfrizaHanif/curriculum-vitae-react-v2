"use client";

import { useEffect, useState } from "react";
import {
  siteConfig,
  type ResponsiveItemsPerPageConfig,
} from "@/config/siteConfig";

export type ResponsiveItemsPerPageInput =
  | Partial<ResponsiveItemsPerPageConfig>
  | number;

/**
 * Hook to dynamically determine items per slide based on viewport breakpoints.
 * - Mobile (< 768px): 1 item per slide (or config.mobile)
 * - Tablet (768px - 991px): 2 items per slide (or config.tablet)
 * - Desktop (992px - 1199px): 3 items per slide (or config.desktop)
 * - Wide (1200px - 1399px): 4 items per slide (or config.wide)
 * - Ultrawide / 4K (>= 1400px): 4 items per slide (or config.ultrawide)
 */
export function useResponsiveItemsPerPage(
  inputConfig?: ResponsiveItemsPerPageInput,
): number {
  const resolvedMobile =
    typeof inputConfig === "object" && inputConfig?.mobile !== undefined
      ? inputConfig.mobile
      : siteConfig.projects.itemsPerPage.mobile;

  const resolvedTablet =
    typeof inputConfig === "object" && inputConfig?.tablet !== undefined
      ? inputConfig.tablet
      : siteConfig.projects.itemsPerPage.tablet;

  const resolvedDesktop =
    typeof inputConfig === "number"
      ? inputConfig
      : typeof inputConfig === "object" && inputConfig?.desktop !== undefined
        ? inputConfig.desktop
        : siteConfig.projects.itemsPerPage.desktop;

  const resolvedWide =
    typeof inputConfig === "number"
      ? inputConfig > 3
        ? inputConfig
        : siteConfig.projects.itemsPerPage.wide
      : typeof inputConfig === "object" && inputConfig?.wide !== undefined
        ? inputConfig.wide
        : siteConfig.projects.itemsPerPage.wide;

  const resolvedUltrawide =
    typeof inputConfig === "number"
      ? inputConfig > 3
        ? inputConfig
        : siteConfig.projects.itemsPerPage.ultrawide
      : typeof inputConfig === "object" && inputConfig?.ultrawide !== undefined
        ? inputConfig.ultrawide
        : siteConfig.projects.itemsPerPage.ultrawide;

  const [itemsPerPage, setItemsPerPage] = useState<number>(resolvedDesktop);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(resolvedMobile);
      } else if (width < 992) {
        setItemsPerPage(resolvedTablet);
      } else if (width < 1200) {
        setItemsPerPage(resolvedDesktop);
      } else if (width < 1400) {
        setItemsPerPage(resolvedWide);
      } else {
        setItemsPerPage(resolvedUltrawide);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    resolvedMobile,
    resolvedTablet,
    resolvedDesktop,
    resolvedWide,
    resolvedUltrawide,
  ]);

  return itemsPerPage;
}
