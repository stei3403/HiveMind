import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import corsLib from "cors";


const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

admin.initializeApp();

const cors = corsLib({origin: true});

export const openaiAutofill = onRequest(
  {
    region: "us-central1",
    secrets: [OPENAI_API_KEY],
  },
  async (req, res) => {
    cors(req, res, async () => {
      const {stepName, ideaData} = req.body;

      if (!stepName || !ideaData) {
        res.status(400).json({error: "Missing stepName or ideaData"});
        return;
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
          model: "o4-mini",
          messages: [{role: "user", content: prompt}],
        });

        res.status(200).json({
          content: response.choices[0].message?.content || "",
        });
      } catch (err) {
        console.error("OpenAI error:", err);
        res.status(500).json({error: "Failed to generate AI autofill content"});
      }
    });
  }
);
