"use client";

import { useEffect, useState } from "react";

/**
 * Hook to dynamically determine items per slide based on viewport breakpoints.
 * - Mobile (< 768px): 1 item per slide for comfortable reading/touch interaction.
 * - Tablet (768px - 991px): 2 items per slide (or 4 if desktop is 6).
 * - Desktop (>= 992px): full desktopCount (default 3, easily changed to 6).
 */
export function useResponsiveItemsPerPage(desktopCount: number = 3): number {
  const [itemsPerPage, setItemsPerPage] = useState<number>(desktopCount);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(1);
      } else if (width < 992) {
        setItemsPerPage(desktopCount > 3 ? 4 : 2);
      } else {
        setItemsPerPage(desktopCount);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [desktopCount]);

  return itemsPerPage;
}
