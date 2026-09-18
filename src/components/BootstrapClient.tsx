"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Dynamically import bootstrap's bundle JS on the client side
    import("bootstrap").then((bootstrap) => {
      // Patch Bootstrap Carousel lifecycle issues for React SPA / Next.js
      const Carousel = bootstrap.Carousel;
      if (
        Carousel &&
        !(Carousel as unknown as { __reactPatched?: boolean }).__reactPatched
      ) {
        (Carousel as unknown as { __reactPatched: boolean }).__reactPatched =
          true;

        const proto = Carousel.prototype as unknown as {
          dispose: () => void;
          _maybeEnableCycle: () => void;
          _getItems: () => Element[];
          _element?: HTMLElement | null;
          _config?: { ride?: string | boolean } | null;
          touchTimeout?: ReturnType<typeof setTimeout>;
        };

        const origDispose = proto.dispose;
        proto.dispose = function (this: typeof proto) {
          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }
          return origDispose.call(this);
        };

        const origMaybeEnable = proto._maybeEnableCycle;
        proto._maybeEnableCycle = function (this: typeof proto) {
          if (!this || !this._config) return;
          return origMaybeEnable.call(this);
        };

        const origGetItems = proto._getItems;
        proto._getItems = function (this: typeof proto) {
          if (!this || !this._element) return [];
          try {
            return origGetItems.call(this);
          } catch {
            return [];
          }
        };
      }

      // Patch Bootstrap Tooltip lifecycle issues for React SPA / Next.js
      const Tooltip = bootstrap.Tooltip;
      if (
        Tooltip &&
        !(Tooltip as unknown as { __reactPatched?: boolean }).__reactPatched
      ) {
        (Tooltip as unknown as { __reactPatched: boolean }).__reactPatched =
          true;

        const proto = Tooltip.prototype as unknown as {
          _isWithActiveTrigger: () => boolean;
          _activeTrigger?: Record<string, boolean> | null;
        };

        const origIsWithActiveTrigger = proto._isWithActiveTrigger;
        proto._isWithActiveTrigger = function (this: typeof proto) {
          if (!this || !this._activeTrigger) return false;
          try {
            return origIsWithActiveTrigger.call(this);
          } catch {
            return false;
          }
        };
      }
    });
  }, []);

  return null;
}
