import { useState } from "react";

export function useOpenAISuggestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = async (stepName: string, ideaData: any) => {
    setLoading(true);
    setError(null);

    const debug = import.meta.env.MODE === "development";
    const autofillUrl =
      import.meta.env.VITE_OPENAI_AUTOFILL_URL ||
      "https://us-central1-hivemindapp-f1ac8.cloudfunctions.net/openaiAutofill";

    try {
      const response = await fetch(
        `${autofillUrl}${debug ? "?debug=true" : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stepName, ideaData }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to generate suggestion");
      }

      // Safely log everything for debugging
      if (debug) {
        console.log("📦 Full response JSON:", result);
        console.log("🧠 Prompt sent to OpenAI:", result.debugPrompt || "⚠️ No debugPrompt returned");
        console.log("📝 AI response:", result.debugResponse || "⚠️ No debugResponse returned");
      }

      return result.content;
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
