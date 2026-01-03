import { GoogleGenAI } from "@google/genai";
import {
  breaks,
  addBreaks,
  setSignInTime,
  setSignOffTime,
} from "../stores/time-store";
import type { Break } from "../types/types";

const prompt = `You are an AI assistant for a Work Time Tracker application. Your task is to extract work schedule data from chat screenshots.

CONTEXT:
This application helps users track their daily work hours. Users sign in when they start working, take breaks, and sign off when they finish. The app calculates total worked time by subtracting break durations from the time between sign-in and sign-off.

YOUR TASK:
Analyze the provided chat screenshots and extract:
1. Sign-in time - when the user started their workday (look for messages like "sign in", "signed in", "logging in", "good morning", "starting work", etc.)
2. Sign-off time - when the user ended their workday (look for messages like "sign off", "signing off", "logging off", "good night", "EOD", "ending work", etc.)
3. All breaks - periods when the user stepped away and returned. Look for:
   - Break start: "AFK", "away", "stepping out", "break", "BRB", "be right back", "lunch", etc.
   - Break end: "Back", "returned", "I'm back", "here", "available", etc.

IMPORTANT NOTES:
- Screenshots may be provided in any order; reorder them chronologically based on timestamps before analyzing.
- A break may start on one screenshot and end on a different screenshot. Correlate these events across all images.
- The time is usually displayed above or beside each message.
- Use 24-hour format (HH:MM) for all times.
- Be flexible in recognizing intent - the exact wording may vary.

Return the result ONLY in this JSON format:
{
  "signIn": "HH:MM",
  "signOff": "HH:MM",
  "breaks": [
    { "start": "HH:MM", "end": "HH:MM" }
  ]
}

If any value cannot be determined from the screenshots, set it to null.`;

function initializeGenAiClient(apiKey: string) {
  return new GoogleGenAI({ apiKey: apiKey });
}

async function encodeFileToBase64(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });

  return base64EncodedDataPromise;
}

function updateStores(data: {
  signIn: string;
  signOff: string;
  breaks: Break[];
}) {
  if (data.signIn) setSignInTime(data.signIn);
  if (data.signOff) setSignOffTime(data.signOff);

  if (data.breaks && Array.isArray(data.breaks)) {
    breaks.set({});
    addBreaks(data.breaks);
  }
}

async function processChatImage(ai: GoogleGenAI, imageFiles: File[]) {
  const imageContents = await Promise.all(
    imageFiles.map(async (file) => {
      const data = await encodeFileToBase64(file);
      return { inlineData: { data, mimeType: file.type } };
    })
  );

  const contents = [...imageContents, { text: prompt }];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  const text = response.text;

  const jsonMatch = text?.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse AI response as JSON.");

  const data = JSON.parse(jsonMatch[0]);

  updateStores(data);
}

export { initializeGenAiClient, processChatImage };
