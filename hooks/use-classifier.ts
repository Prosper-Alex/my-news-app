import { useState, useCallback } from "react";
import { ClassificationResult } from "@/lib/keyword-classifier";

/**
 * React hook for classifying news queries
 */
export function useClassifier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classify = useCallback(
    async (query: string): Promise<ClassificationResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/classify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("Classification failed");
        }

        const result: ClassificationResult = await response.json();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { classify, loading, error };
}
