import { useState, useCallback } from "react";

// This is a hook file for mutation requests.
// Do not modify as this one is working. Modify if there's something wrong.
// WARNING: This hooks is only for POST, PUT, or DELETE requests. To use for GET requests, use useFetch().

export function useMutation<T, Args extends unknown[]>(
  mutationFn: (...args: Args) => Promise<T>,
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await mutationFn(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        throw errorObj;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn],
  );

  return { execute, data, isLoading, error };
}
