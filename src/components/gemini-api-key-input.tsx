import { useStore } from "@nanostores/react";
import { geminiApiKey, setGeminiApiKey } from "../stores/ai-store";
import type { ChangeEvent } from "react";

function handleChangeGeminiApiKey(event: ChangeEvent<HTMLInputElement>) {
  setGeminiApiKey(event.target.value);
}

function GeminiApiKeyInput() {
  const $apiKey = useStore(geminiApiKey);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Gemini AI Setup</h2>
      </div>
      <div className="flex flex-col mb-4">
        <label
          htmlFor="gemini-api-key"
          className="text-sm text-slate-400 mb-2 font-medium"
        >
          Gemini API Key
        </label>
        <div className="flex flex-col gap-2">
          <input
            id="gemini-api-key"
            type="password"
            className="w-full bg-slate-950/60 border border-slate-800/50 rounded-lg p-3 text-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Enter your Gemini API key..."
            value={$apiKey}
            onChange={handleChangeGeminiApiKey}
          />
          <small className="text-xs text-slate-400 mt-1 opacity-70">
            Get your key from{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 no-underline hover:underline"
            >
              Google AI Studio
            </a>{" "}
            .
          </small>
        </div>
      </div>
    </div>
  );
}

export { GeminiApiKeyInput };
