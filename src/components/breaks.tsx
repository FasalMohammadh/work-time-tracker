import { useStore } from "@nanostores/react";
import { breaks, removeBreak, updateBreak } from "../stores/time-store";
import type { ChangeEvent } from "react";

function handleBreakChange(event: ChangeEvent<HTMLInputElement>, key: string) {
  const { value, name } = event.target;
  updateBreak(key, { [name]: value });
}

function Breaks() {
  const $breaks = useStore(breaks);

  return Object.entries($breaks).map(([key, value]) => {
    return (
      <div
        className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-lg border border-transparent transition-colors hover:border-slate-800/50 animate-slide-in"
        key={key}
      >
        <div className="flex flex-1 items-center gap-2">
          <div className="mb-0 flex-1 flex flex-col">
            <label
              htmlFor={`break-start-${key}`}
              className="text-sm mb-1 text-slate-400"
            >
              Start
            </label>
            <input
              id={`break-start-${key}`}
              type="time"
              className="p-2 bg-slate-950/60 border border-slate-800/50 rounded-lg text-slate-50 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer scheme-dark"
              name="start"
              required
              value={value.start}
              onChange={(event) => handleBreakChange(event, key)}
            />
          </div>
          <div className="text-slate-500 text-xl mt-6">→</div>
          <div className="mb-0 flex-1 flex flex-col">
            <label
              htmlFor={`break-end-${key}`}
              className="text-sm mb-1 text-slate-400"
            >
              End
            </label>
            <input
              id={`break-end-${key}`}
              type="time"
              className="p-2 bg-slate-950/60 border border-slate-800/50 rounded-lg text-slate-50 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer scheme-dark"
              name="end"
              required
              value={value.end}
              onChange={(event) => handleBreakChange(event, key)}
            />
          </div>
        </div>
        <button
          type="button"
          className="bg-transparent border-none text-slate-500 cursor-pointer p-2 rounded-lg transition-all mt-6 hover:text-red-500 hover:bg-red-500/10"
          aria-label="Remove break"
          onClick={() => removeBreak(key)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    );
  });
}

export { Breaks };
