import { Letter, NFA, State } from "./nfa.ts";

/** Get a machine that recognizes only the string ''. */
export function emptyMachine(): NFA {
  const startState: State = { accept: true, start: true };
  return new NFA(startState);
}

/** NFA that recognizes only the letter given. */
export function oneLetterMachine(letter: Letter): NFA {
  if (letter.length !== 1) {
    throw "c must be a single letter";
  }
  const startState: State = { start: true };
  const acceptState: State = { accept: true };
  startState.transitions = [
    { letter, state: acceptState },
  ];
  return new NFA(startState);
}

// function getLowercaseAlphabet(): Letter[] {
//     return ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
// }
