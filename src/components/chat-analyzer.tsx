import { useState, useRef } from "react";
import { useStore } from "@nanostores/react";
import { geminiApiKey, isAnalyzing, analysisError } from "../stores/ai-store";
import { initializeGenAiClient, processChatImage } from "../lib/ai-handler";

function ChatAnalyzer() {
  const $apiKey = useStore(geminiApiKey);
  const $isAnalyzing = useStore(isAnalyzing);
  const $error = useStore(analysisError);

  const genAiClient = initializeGenAiClient($apiKey);

  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      setFile(file);
      setSuccess(false);
    }
  };

  const handleAnalyze = async () => {
    if (!$apiKey) {
      alert("Please enter your Gemini API key first.");
      return;
    }
    if (!file) return;

    try {
      isAnalyzing.set(true);
      analysisError.set(null);
      setSuccess(false);

      await processChatImage(genAiClient, file);

      setSuccess(true);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error(err);
      analysisError.set(err.message || "Failed to analyze image.");
    } finally {
      isAnalyzing.set(false);
    }
  };

  return (
    <div className="border border-dashed border-indigo-500 bg-slate-900/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">AI Chat Analysis</h2>
      </div>

      <div className="analyzer-content">
        <p className="text-sm text-slate-400 mb-6">
          Upload a screenshot of your chat logs. Gemini will detect your
          sign-in, sign-off, and AFK/Back breaks.
        </p>

        <div className="mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            id="chat-upload"
            className="hidden"
          />
          <label
            htmlFor="chat-upload"
            className="flex items-center justify-center gap-2.5 bg-slate-930/40 border border-slate-800/50 p-4 rounded-lg cursor-pointer transition-all text-slate-50 font-medium hover:bg-indigo-500/10 hover:border-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            {file ? file.name : "Choose Chat Screenshot"}
          </label>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 bg-indigo-500 text-white border-none py-2 px-6 rounded-lg cursor-pointer font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:bg-indigo-600 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!file || $isAnalyzing || !$apiKey}
          onClick={handleAnalyze}
        >
          {$isAnalyzing ? (
            <>
              <span className="w-[18px] h-[18px] border-2 border-white/30 rounded-full border-t-white animate-spin"></span>
              {" Analyzing..."}
            </>
          ) : (
            "Analyze"
          )}
        </button>

        {$error && (
          <div className="text-xs text-red-500 mt-2 flex items-center gap-1">
            {$error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-green-500 flex items-center justify-center gap-1.5 text-sm animate-[scaleIn_0.3s_ease-out]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Successfully updated times!
          </div>
        )}
      </div>
    </div>
  );
}

export { ChatAnalyzer };
