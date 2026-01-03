import { atom, map } from "nanostores";
import type { Break, BreakMap } from "../types/types";

const SIGN_IN_TIME_KEY = "signInTime";
const SIGN_OFF_TIME_KEY = "signOffTime";
const BREAKS_KEY = "breaks";

const signInTime = atom<string>("");
const signOffTime = atom<string>("");
const breaks = map<BreakMap>({});

const setSignInTime = (time: string) => {
  localStorage.setItem(SIGN_IN_TIME_KEY, time);
  signInTime.set(time);
};

const setSignOffTime = (time: string) => {
  localStorage.setItem(SIGN_OFF_TIME_KEY, time);
  signOffTime.set(time);
};

const addBreak = (id: string, breakData?: Break) => {
  breaks.setKey(id, {
    start: breakData?.start ?? "",
    end: breakData?.end ?? "",
  });
  localStorage.setItem(BREAKS_KEY, JSON.stringify(breaks.get()));
};

const addBreaks = (breaksData: Break[]) => {
  const currentBreaks = breaks.get();
  const newBreaks = breaksData.reduce((acc, breakData) => {
    acc[crypto.randomUUID()] = breakData;
    return acc;
  }, {} as BreakMap);
  breaks.set({ ...currentBreaks, ...newBreaks });
  localStorage.setItem(BREAKS_KEY, JSON.stringify(breaks.get()));
};

const updateBreak = (id: string, breakData: Partial<Break>) => {
  const currentBreaks = breaks.get();
  const currentBreak = currentBreaks[id];
  if (currentBreak) {
    breaks.setKey(id, { ...currentBreak, ...breakData });
    localStorage.setItem(BREAKS_KEY, JSON.stringify(breaks.get()));
  }
};

const removeBreak = (id: string) => {
  const current = { ...breaks.get() };
  delete current[id];
  breaks.set(current);
  localStorage.setItem(BREAKS_KEY, JSON.stringify(current));
};

const reset = () => {
  signInTime.set("");
  signOffTime.set("");
  breaks.set({});
  localStorage.removeItem(SIGN_IN_TIME_KEY);
  localStorage.removeItem(SIGN_OFF_TIME_KEY);
  localStorage.removeItem(BREAKS_KEY);
};

export {
  setSignInTime,
  setSignOffTime,
  signInTime,
  signOffTime,
  breaks,
  removeBreak,
  addBreak,
  addBreaks,
  updateBreak,
  reset,
  SIGN_IN_TIME_KEY,
  SIGN_OFF_TIME_KEY,
  BREAKS_KEY,
};
