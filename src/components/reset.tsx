import { reset } from "../stores/time-store";

function Reset() {
  return (
    <button
      type="reset"
      id="reset-btn"
      className="bg-transparent text-slate-400 border border-slate-700/50 py-2 px-6 rounded-lg cursor-pointer font-medium transition-all hover:text-white hover:border-slate-500"
      onClick={reset}
    >
      Reset
    </button>
  );
}

export { Reset };
