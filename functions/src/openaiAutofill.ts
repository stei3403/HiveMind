import {onCall} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as admin from "firebase-admin";
import OpenAI from "openai";

// Attach the secret
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

admin.initializeApp();

export const openaiAutofill = onCall(
  {
    region: "us-central1",
    secrets: [OPENAI_API_KEY],
  },
  async (request) => {
    const {data} = request;
    const {stepName, ideaData} = data;

    if (!stepName || !ideaData) {
      throw new Error("Missing stepName or ideaData");
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY.value(),
    });

    const prompt = `You are helping a user fill out a startup idea submission. They have completed the following steps:\n\n${JSON.stringify(
      ideaData,
      null,
      2
    )}\n\nBased on this information, suggest autofill content for the "${stepName}" section.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{role: "user", content: prompt}],
      });

      return {content: response.choices[0].message?.content || ""};
    } catch (err) {
      console.error("OpenAI error:", err);
      throw new Error("Failed to generate AI autofill content");
    }
  }
);
