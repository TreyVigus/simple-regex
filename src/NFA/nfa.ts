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

export type State = {
  accept?: boolean;
  transitions?: Transition[];
};

export class NFA {
  public start: State;

  constructor(start: State) {
    this.start = start;
  }

  public recognizes(s: string): boolean {
    //Note: This will throw an exception if the machine has an infinite ε loop.
    const recognizeDfs = (current: State, i: number): boolean => {
      for(const t of current.transitions ?? []) {
        if(t.letter === 'ε') {
          if(recognizeDfs(t.state, i)) {
            return true;
          }
        }
      }
  
      if(i === s.length) {
        return !!current.accept;
      }
  
      for(const t of current.transitions ?? []) {
        if(t.letter === s.charAt(i)) {
          if(recognizeDfs(t.state, i+1)) {
            return true;
          }
        }
      }
  
      return false;
    }

    return recognizeDfs(this.start, 0);
  }

  /** Retrieve all transitions. */
  public get states(): State[] {
    const states: State[] = [];
    const getStatesDFS = (current: State): void => {
      if(states.includes(current)) {
        return;
      } else {
        states.push(current);
      }
  
      for(const t of current.transitions ?? []) {
        getStatesDFS(t.state);
      }
    }
    getStatesDFS(this.start);
    return states;
  }

  public concat(x: NFA): NFA {
    const accept = this.states.filter(s => !!s.accept);
    accept.forEach(state => {
      state.accept = false;
      state.transitions = state.transitions ?? [];
      state.transitions.push({letter: 'ε', state: x.start});
    });
    return this;
  }

  /** 
   * Return an NFA that recognizes any string in this NFA's language,
   * or the given NFA's language.
   */
  public union(x: NFA): NFA {
    const head: State = {};
    head.transitions = [
      {letter: 'ε', state: this.start},
      {letter: 'ε', state: x.start}
    ];
    return new NFA(head);
  }

  /** Concatenate this machine with itself n times.*/
  public pow(n: number): NFA {
    throw "not done";
  }
}
