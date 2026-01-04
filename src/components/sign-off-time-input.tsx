import type { ChangeEvent, ComponentProps } from "react";
import { useStore } from "@nanostores/react";
import { setSignOffTime, signInTime, signOffTime } from "../stores/time-store";

type SignOffTimeInputProps = ComponentProps<"input">;

function handleChangeSignOffTime({ target }: ChangeEvent<HTMLInputElement>) {
  setSignOffTime(target.value);
}

function SignOffTimeInput(props: SignOffTimeInputProps) {
  const $signInTime = useStore(signInTime);
  const $signOffTime = useStore(signOffTime);

  const isInvalid = Boolean(
    $signInTime && $signOffTime && $signOffTime < $signInTime
  );

  return (
    <>
      <input
        aria-invalid={isInvalid}
        type="time"
        className="bg-slate-950/60 border w-full border-slate-800/50 rounded-lg p-3 text-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer scheme-dark aria-invalid:border-red-500/50 aria-invalid:focus:ring-red-500/20"
        aria-describedby="sign-off-help sign-off-error"
        value={$signOffTime}
        onChange={handleChangeSignOffTime}
        {...props}
      />
      <small
        id="sign-off-help"
        className="text-xs text-slate-400 mt-1 opacity-70"
      >
        Defaults to now if empty
      </small>
      {isInvalid && (
        <span
          id="sign-off-error"
          className="text-xs text-red-400 mt-1"
          aria-live="assertive"
        >
          Sign off time must be after sign in time
        </span>
      )}
    </>
  );
}

export { SignOffTimeInput };
