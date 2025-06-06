import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import corsLib from "cors";

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

admin.initializeApp();

const cors = corsLib({ origin: true });

export const openaiAutofill = onRequest(
  {
    region: "us-central1",
    secrets: [OPENAI_API_KEY],
  },
  async (req, res) => {
    cors(req, res, async () => {
      const { stepName, ideaData } = req.body;

      if (!stepName || !ideaData) {
        res.status(400).json({ error: "Missing stepName or ideaData" });
        return;
      }

      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY.value(),
      });

      // Only include key fields likely to be useful context
      const relevantFields = ['name', 'problem', 'solution', 'status', 'links'];
      const trimmedData: Record<string, any> = {};

      for (const key of relevantFields) {
        if (ideaData[key]) trimmedData[key] = ideaData[key];
      }

      const prompt = `Help complete the "${stepName}" section of a startup idea form based on this info:\n${JSON.stringify(
        trimmedData,
        null,
        0
      )}\nRespond with a short, plain suggestion (under 100 characters).`;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // switch to gpt-4o if quality becomes a concern
          messages: [{ role: "user", content: prompt }],
        });

        const content = response.choices[0].message?.content?.trim() || "";

        const debug = req.query.debug === "true";

        if (debug) {
          console.log("🧠 Prompt sent to OpenAI:\n", prompt);
          console.log("📝 Response from OpenAI:\n", content);
        }

        res.status(200).json(
          debug
            ? { content, debugPrompt: prompt, debugResponse: content }
            : { content }
        );
      } catch (err) {
        console.error("❌ OpenAI error:", err);
        res.status(500).json({ error: "Failed to generate AI autofill content" });
      }
    });
  }
);
