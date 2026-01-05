import { useState, useRef, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { geminiApiKey, isAnalyzing, analysisError } from "../stores/ai-store";
import { initializeGenAiClient, processChatImage } from "../lib/ai-handler";

function ChatAnalyzer() {
  const $apiKey = useStore(geminiApiKey);
  const $isAnalyzing = useStore(isAnalyzing);
  const $error = useStore(analysisError);

  const genAiClient = initializeGenAiClient($apiKey);

  const [files, setFiles] = useState<
    { file: File; id: string; preview: string }[]
  >([]);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const newFiles = selectedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file),
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      setSuccess(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(event.target.files || []));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    processFiles(droppedFiles);
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const filesRef = useRef(files);
  filesRef.current = files;

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            pastedFiles.push(file);
          }
        }
      }

      if (pastedFiles.length > 0) {
        processFiles(pastedFiles);
      }
    };

    globalThis.addEventListener("paste", handlePaste);
    return () => {
      globalThis.removeEventListener("paste", handlePaste);
      filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const handleAnalyze = async () => {
    if (!$apiKey) {
      alert("Please enter your Gemini API key first.");
      return;
    }
    if (files.length === 0) return;

    try {
      isAnalyzing.set(true);
      analysisError.set(null);
      setSuccess(false);

      await processChatImage(
        genAiClient,
        files.map((f) => f.file)
      );

      setSuccess(true);
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      console.error(err);
      analysisError.set(err.message || "Failed to analyze search.");
    } finally {
      isAnalyzing.set(false);
    }
  };

  const fileCount = files.length;
  const isMultiple = fileCount > 1;
  const pluralSuffix = isMultiple ? "s" : "";
  const analyzeButtonLabel = $isAnalyzing
    ? "Analyzing..."
    : `Analyze ${fileCount} Screenshot${pluralSuffix}`;

  let uploadLabelText = "Upload, Drag, or Ctrl+V to paste";
  if (isDragging) {
    uploadLabelText = "Drop screenshots here";
  } else if (fileCount > 0) {
    uploadLabelText = `${fileCount} image${pluralSuffix} selected`;
  }

  return (
    <div className="border border-dashed border-indigo-500 bg-slate-900/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">AI Chat Analysis</h2>
      </div>

      <div className="analyzer-content">
        <p className="text-sm text-slate-400 mb-6">
          Upload screenshots of your chat logs. Gemini will detect your sign-in,
          sign-off, and AFK/Back breaks from all images.
        </p>

        <section
          className="mb-6"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label="Chat screenshot upload area"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            id="chat-upload"
            className="hidden"
          />
          <label
            htmlFor="chat-upload"
            className={`flex flex-col items-center justify-center gap-3 bg-slate-930/40 border border-slate-800/50 p-8 rounded-xl cursor-pointer transition-all text-slate-400 font-medium group ${
              isDragging
                ? "border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                : "hover:bg-indigo-500/10 hover:border-indigo-500"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDragging
                  ? "bg-indigo-500/20"
                  : "bg-slate-800 group-hover:bg-indigo-500/20"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors ${
                  isDragging
                    ? "text-indigo-400"
                    : "text-slate-300 group-hover:text-indigo-400"
                }`}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <span>{uploadLabelText}</span>
          </label>
        </section>

        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {files.map((fileObj) => (
              <div
                key={fileObj.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 bg-slate-800 animate-scale-in"
              >
                <img
                  src={fileObj.preview}
                  className="w-full h-full object-cover"
                  alt={`Preview ${fileObj.file.name}`}
                />
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="absolute top-1.5 right-1.5 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg z-10 active:scale-90"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 bg-indigo-500 text-white border-none py-3 px-6 rounded-lg cursor-pointer font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:bg-indigo-600 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={files.length === 0 || $isAnalyzing || !$apiKey}
          onClick={handleAnalyze}
        >
          {$isAnalyzing && (
            <span className="w-[18px] h-[18px] border-2 border-white/30 rounded-full border-t-white animate-spin"></span>
          )}
          {analyzeButtonLabel}
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
