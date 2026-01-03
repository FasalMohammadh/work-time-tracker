type Break = {
  start: string;
  end: string;
};

type BreakMap = Record<string, Partial<Break>>;

export type { Break, BreakMap };
