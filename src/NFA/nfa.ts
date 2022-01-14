/** Single character string. */
export type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "ε";

export type Transition = {
  letter: Letter;
  state: State;
};

//TODO: is start boolean even needed?
export type State = {
  accept?: boolean;
  start?: boolean;
  transitions?: Transition[];
};

export class NFA {
  constructor(start: State) {}

  public recognizes(s: string): boolean {
    return false;
  }

  public concat(x: NFA): NFA {
    throw "not done";
  }

  public union(x: NFA): NFA {
    throw "not done";
  }

  /** Concatenate this machine with itself n times.*/
  public pow(n: number): NFA {
    throw "not done";
  }
}
