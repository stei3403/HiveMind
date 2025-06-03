import { functions } from "../firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useState } from "react";

export function useOpenAISuggestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = async (stepName: string, ideaData: any) => {
    setLoading(true);
    setError(null);
    try {
      const functions = getFunctions();
      const autofill = httpsCallable(functions, "openaiAutofill");
      const result = await autofill({ stepName, ideaData });
      return result.data;
    } catch (err: any) {
      setError(err.message);
      console.error("Error calling OpenAI function:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateSuggestion, loading, error };
}
