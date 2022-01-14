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
  transitions?: Transition[];
};

export class NFA {
  public start: State;

  /** Retrieve all transitions. */
  // public get transitions(): State[] {

  // }

  constructor(start: State) {
    this.start = start;
  }

  public recognizes(s: string): boolean {
    return this.recognizeDfs(this.start, s, 0);
  }

  public concat(x: NFA): NFA {
    throw "not done";
  }

  /** 
   * Return an NFA that recognizes any string in this NFA's language,
   * or the given NFA's language.
   */
  public union(x: NFA): NFA {
    const head: State = {};
    head.transitions = [
      {letter: 'ε', state: this.start},
      {letter: 'ε', state: x.start},
    ];
    return new NFA(head);
  }

  /** Concatenate this machine with itself n times.*/
  public pow(n: number): NFA {
    throw "not done";
  }

  private recognizeDfs(state: State, s: string, i: number): boolean {
    if(i === s.length) {
      return !!state.accept;
    }

    for(const t of state.transitions ?? []) {
      if(t.letter === 'ε') {
        if(this.recognizeDfs(t.state, s, i)) {
          return true;
        }
      } else if(t.letter === s.charAt(i)) {
        if(this.recognizeDfs(t.state, s, i+1)) {
          return true;
        }
      }
    }

    return false;
  }
}
