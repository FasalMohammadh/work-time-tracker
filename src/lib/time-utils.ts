import type { BreakMap } from "../types/types";

const parseTime = (timeString: string) => {
  if (!timeString.trim().length) return null;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const calculateTotalBreak = (breaks: BreakMap) => {
  let total = 0;
  Object.values(breaks).forEach((b) => {
    const start = parseTime(b.start);
    const end = parseTime(b.end);
    if (start !== null && end !== null && end >= start) {
      total += end - start;
    }
  });
  return total;
};

const calculateTotalWorked = (
  signIn: string,
  signOff: string,
  breaks: BreakMap
) => {
  const start = parseTime(signIn);
  if (start === null) return 0;

  let end = parseTime(signOff);
  if (end === null) {
    const now = new Date();
    end = now.getHours() * 60 + now.getMinutes();
  }

  const rawWorked = end - start;
  const totalBreak = calculateTotalBreak(breaks);

  return Math.max(0, rawWorked - totalBreak);
};

export { parseTime, formatMinutes, calculateTotalBreak, calculateTotalWorked };
