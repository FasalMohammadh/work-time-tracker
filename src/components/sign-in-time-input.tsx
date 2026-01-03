import type { ChangeEvent, ComponentProps } from "react";
import { useStore } from "@nanostores/react";
import { setSignInTime, signInTime } from "../stores/time-store";

type SignInTimeInputProps = ComponentProps<"input">;

function handleChangeSignInTime({ target }: ChangeEvent<HTMLInputElement>) {
  setSignInTime(target.value);
}

function SignInTimeInput(props: SignInTimeInputProps) {
  const $signInTime = useStore(signInTime);

  return (
    <input
      type="time"
      required
      className="bg-slate-950/60 border border-slate-800/50 rounded-lg p-3 text-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer scheme-dark"
      value={$signInTime}
      onChange={handleChangeSignInTime}
      {...props}
    />
  );
}

export { SignInTimeInput };
