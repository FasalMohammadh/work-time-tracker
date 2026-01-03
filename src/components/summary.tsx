import { useStore } from "@nanostores/react";
import { signInTime, signOffTime, breaks } from "../stores/time-store";
import {
  formatMinutes,
  calculateTotalBreak,
  calculateTotalWorked,
} from "../lib/time-utils";

function Summary() {
  const $signIn = useStore(signInTime);
  const $signOff = useStore(signOffTime);
  const $breaks = useStore(breaks);

  const totalBreakMins = calculateTotalBreak($breaks);
  const totalWorkedMins = calculateTotalWorked($signIn, $signOff, $breaks);

  return (
    <section className="grid sm:grid-cols-2 gap-4 mb-8">
      <div className="bg-slate-900/40 p-4 rounded-lg flex flex-col items-center justify-center text-center">
        <span className="text-slate-400 mb-1">Total Break</span>
        <span className="text-2xl font-bold">
          {formatMinutes(totalBreakMins)}
        </span>
      </div>
      <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg flex flex-col items-center justify-center text-center">
        <span className="text-slate-400 mb-1">Total Worked</span>
        <span
          data-incomplete={totalWorkedMins < 8 * 60}
          className="text-2xl font-bold text-indigo-400 data-[incomplete=true]:text-red-400"
        >
          {formatMinutes(totalWorkedMins)}
        </span>
      </div>
    </section>
  );
}

export { Summary };
