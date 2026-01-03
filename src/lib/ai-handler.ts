import { GoogleGenAI } from "@google/genai";
import {
  signInTime,
  signOffTime,
  breaks,
  addBreaks,
} from "../stores/time-store";
import type { Break } from "../types/types";

const prompt = `Analyze this chat screenshot. Find the sign-in time, sign-off time, and all breaks.
Breaks are identified by messages starting with 'AFK' (start of break) and 'Back' (end of break).
The time is usually shown above the message or beside it.
Return the result ONLY in JSON format:
{
"signIn": "HH:MM",
"signOff": "HH:MM",
"breaks": [
  { "start": "HH:MM", "end": "HH:MM" }
]
}
If a value is not found, leave it as null. Use 24-hour format (HH:MM).`;

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
  if (data.signIn) signInTime.set(data.signIn);
  if (data.signOff) signOffTime.set(data.signOff);

  if (data.breaks && Array.isArray(data.breaks)) {
    breaks.set({});
    addBreaks(data.breaks);
  }
}

async function processChatImage(ai: GoogleGenAI, imageFile: File) {
  const imageBase = await encodeFileToBase64(imageFile);
  const contents = [
    { inlineData: { data: imageBase, mimeType: imageFile.type } },
    { text: prompt },
  ];
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
