/**
 * Note: This component uses Google reCAPTCHA.
 * Make sure to add your reCAPTCHA site key to the .env.local file.
 *
 * @example
 * <Recaptcha
 *   siteKey="your-site-key"
 *   onChange={(token) => console.log(token)}
 * />
 */

"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useTheme } from "@/context/ThemeContext";

declare global {
  interface Window {
    grecaptcha?: {
      ready?: (callback: () => void) => void;
      render?: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          theme?: "light" | "dark";
          size?: "normal" | "compact";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset?: (opt_widget_id?: number) => void;
      getResponse?: (opt_widget_id?: number) => string;
    };
    onRecaptchaLoaded?: () => void;
  }
}

export interface RecaptchaRef {
  reset: () => void;
}

export interface RecaptchaProps {
  siteKey?: string;
  onChange: (token: string | null) => void;
  className?: string;
}

const Recaptcha = forwardRef<RecaptchaRef, RecaptchaProps>(function Recaptcha(
  { siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, onChange, className },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const { resolvedTheme } = useTheme();
  const lastThemeRef = useRef<string>(resolvedTheme);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (
        widgetIdRef.current !== null &&
        typeof window !== "undefined" &&
        typeof window.grecaptcha?.reset === "function"
      ) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
          onChangeRef.current(null);
        } catch {
          // ignore reset error if widget is not active
        }
      }
    },
  }));

  useEffect(() => {
    if (!siteKey || typeof window === "undefined") return;

    let isMounted = true;

    // Suppress benign third-party reCAPTCHA promise timeout rejections from triggering Next.js dev overlays
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const errorMsg =
        typeof reason === "string"
          ? reason
          : reason?.message || String(reason || "");
      if (
        errorMsg.includes("reCAPTCHA") ||
        errorMsg.includes("Timeout (b)") ||
        errorMsg.includes("Timeout (a)")
      ) {
        event.preventDefault();
        console.warn(
          "[reCAPTCHA] Suppressed third-party script timeout:",
          errorMsg,
        );
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    const renderWidget = () => {
      if (
        !isMounted ||
        !containerRef.current ||
        typeof window.grecaptcha?.render !== "function"
      )
        return;

      // If already rendered with the current theme and has content, avoid re-rendering
      if (
        widgetIdRef.current !== null &&
        lastThemeRef.current === resolvedTheme &&
        containerRef.current.hasChildNodes()
      ) {
        return;
      }

      // Safely reset previous widget if theme changed
      if (
        widgetIdRef.current !== null &&
        typeof window.grecaptcha?.reset === "function"
      ) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch {
          // Safe catch
        }
      }

      containerRef.current.innerHTML = "";
      widgetIdRef.current = null;
      lastThemeRef.current = resolvedTheme;

      try {
        const id = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: resolvedTheme,
          callback: (token: string) => {
            if (isMounted) onChangeRef.current(token);
          },
          "expired-callback": () => {
            if (isMounted) onChangeRef.current(null);
          },
          "error-callback": () => {
            if (isMounted) onChangeRef.current(null);
          },
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.warn("[reCAPTCHA] render failed:", err);
      }
    };

    let checkInterval: NodeJS.Timeout | null = null;

    const executeRender = () => {
      if (typeof window.grecaptcha?.ready === "function") {
        window.grecaptcha.ready(renderWidget);
      } else {
        renderWidget();
      }
    };

    // Check if reCAPTCHA script is already loaded
    if (typeof window.grecaptcha?.render === "function") {
      executeRender();
    } else {
      // Load reCAPTCHA script if not present
      const existingScript = document.getElementById("google-recaptcha-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-recaptcha-script";
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          executeRender();
        };
        script.onerror = () => {
          console.warn("[reCAPTCHA] Failed to load Google reCAPTCHA script.");
        };
        document.head.appendChild(script);
      } else {
        checkInterval = setInterval(() => {
          if (typeof window.grecaptcha?.render === "function") {
            if (checkInterval) clearInterval(checkInterval);
            executeRender();
          }
        }, 100);
      }
    }

    return () => {
      isMounted = false;
      if (checkInterval) clearInterval(checkInterval);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, [siteKey, resolvedTheme]);

  if (!siteKey) return null;

  return (
    <div
      className={`recaptcha-container d-flex justify-content-start overflow-hidden ${className ?? ""}`}
      style={{ minHeight: "78px" }}
    >
      <div key={`${siteKey}-${resolvedTheme}`} ref={containerRef} />
    </div>
  );
});

export default Recaptcha;

/*
  Notes
  - Do not change this code unless you know what you are doing.
*/
