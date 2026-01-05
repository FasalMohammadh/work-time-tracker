import { addBreak } from "../stores/time-store";

function handleClick() {
  addBreak();
}

function AddBreak() {
  return (
    <button
      type="button"
      id="add-break-btn"
      className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-all hover:bg-indigo-500/20 hover:-translate-y-px"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add Break
    </button>
  );
}

export { AddBreak };
