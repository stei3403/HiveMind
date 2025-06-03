import { useState } from "react";

export function useOpenAISuggestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = async (stepName: string, ideaData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://us-central1-hivemindapp-f1ac8.cloudfunctions.net/openaiAutofill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stepName, ideaData }),
        }
      );

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error || "Request failed");
      }

      const { content } = await response.json();
      return content;
    } catch (err: any) {
      console.error("Error calling OpenAI function:", err);
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateSuggestion, loading, error };
}
