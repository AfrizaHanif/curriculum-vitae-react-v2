import { useState, useEffect, useCallback, useRef } from "react";

// In-memory cache for resolved data and active in-flight requests
const apiCache = new Map<string, unknown>();
const inFlightMap = new Map<string, Promise<unknown>>();

export interface UseFetchOptions<T> extends RequestInit {
  fallbackData?: T;
}

export function useFetch<T>(
  url: string | null, // Pass null to skip fetching (e.g. if waiting for user authentication)
  options?: UseFetchOptions<T>,
) {
  // Initialize from cache or fallback data if available to avoid loading flicker and enable SSR
  const [data, setData] = useState<T | null>(() => {
    if (url && apiCache.has(url)) {
      return apiCache.get(url) as T;
    }
    return options?.fallbackData ?? null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (!url) return false;
    if (apiCache.has(url)) return false;
    if (options?.fallbackData !== undefined) return false;
    return true;
  });
  const [error, setError] = useState<Error | null>(null);

  // Keep options ref stable to prevent infinite re-fetching from inline options objects
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(
    async (ignoreCache = false, signal?: AbortSignal) => {
      if (!url) {
        if (
          process.env.NODE_ENV === "development" &&
          optionsRef.current?.fallbackData !== undefined
        ) {
          console.info(
            `[useFetch] Fallback data has been used (no URL provided).`,
          );
        }
        setData(optionsRef.current?.fallbackData ?? null);
        setIsLoading(false);
        return;
      }

      // If cached and not a forced refetch, use cached data
      if (!ignoreCache && apiCache.has(url)) {
        setData(apiCache.get(url) as T);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let fetchPromise = inFlightMap.get(url);

        if (!fetchPromise || ignoreCache) {
          fetchPromise = (async () => {
            const fetchOptions = { ...optionsRef.current };
            delete fetchOptions.fallbackData;
            const res = await fetch(url, { ...fetchOptions, signal });
            if (!res.ok) {
              throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
            }
            return await res.json();
          })();

          inFlightMap.set(url, fetchPromise);
        }

        const json = (await fetchPromise) as T;
        apiCache.set(url, json);
        setData(json);
        setIsLoading(false);

        if (process.env.NODE_ENV === "development") {
          console.info(`[useFetch] Successfully fetched from: "${url}"`);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Ignore fetch cancellations
        }

        // Gracefully use fallback data if live API is down or fails
        if (optionsRef.current?.fallbackData !== undefined) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[useFetch] Request failed for "${url}". Using fallback data.`,
              err,
            );
            console.info(
              `[useFetch] Fallback data has been used for: "${url}"`,
            );
          }
          setData(optionsRef.current.fallbackData);
          setError(null);
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
        setIsLoading(false);
      } finally {
        inFlightMap.delete(url);
      }
    },
    [url],
  );

  useEffect(() => {
    const controller = new AbortController();

    // Defer state updates to avoid synchronous setState inside useEffect warning
    const timer = setTimeout(() => {
      fetchData(false, controller.signal);
    }, 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [fetchData]);

  const handleSetData = useCallback(
    (value: React.SetStateAction<T | null>) => {
      setData((prev) => {
        const next =
          typeof value === "function"
            ? (value as (prev: T | null) => T | null)(prev)
            : value;
        if (url && next !== null) {
          apiCache.set(url, next);
        }
        return next;
      });
    },
    [url],
  );

  // Return the states and a manual refetch function
  return {
    data,
    setData: handleSetData, // Syncs local state updates to cache
    isLoading,
    error,
    refetch: () => fetchData(true),
  };
}
