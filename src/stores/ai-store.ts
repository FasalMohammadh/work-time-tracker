import { atom } from "nanostores";
import { getIsClient } from "../lib/utils";

const GEMINI_API_KEY = "gemini_api_key";

const isAnalyzing = atom(false);
const analysisError = atom<string | null>(null);

const geminiApiKey = atom(
  getIsClient() ? localStorage.getItem(GEMINI_API_KEY) ?? "" : ""
);

const setGeminiApiKey = (key: string) => {
  geminiApiKey.set(key);
  localStorage.setItem(GEMINI_API_KEY, key);
};

export { geminiApiKey, isAnalyzing, analysisError, setGeminiApiKey };
