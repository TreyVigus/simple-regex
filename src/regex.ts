import { Letter, NFA } from './NFA/nfa.ts';
import { emptyMachine, oneLetterMachine } from "./NFA/nfaFactory.ts";
type Operator = {
  x: number,
  y: number
}

/**
 * Accepted Symbols:
 * a-z
 * []
 * {x,y} where x,y are positive naturals.
 * ()
 */
export class Regex {
  private nfa: NFA;
  constructor(expr: string) {
    this.nfa = this.buildNFA(expr, 0, expr.length-1);
  }

  public test(s: string): boolean {
    return this.nfa.recognizes(s);
  }

  /** Generate the NFA for substring s[start...end] */
  private buildNFA(expr: string, start: number, end: number): NFA {
    let M = emptyMachine();
    let operator: Operator | undefined;
    for(let i = end; i >= start; i--) {
      const c = expr.charAt(i);
      if(c === '}') {
        const idx = this.findOpeningCurlyIdx(expr, i);
        operator = this.formOperator(expr, idx, i);
      } else {
        let Q: NFA;
        if(c === ')') {
          const idx = this.findOpeningParenIdx(expr, i);
          Q = this.buildNFA(expr, idx+1, i-1);
        } else if(c === ']') {
          const idx = this.findOpeningBracketIdx(expr, i);
          Q = this.formBracketMachine(expr, idx, i);
        } else {
          Q = oneLetterMachine(c as Letter);
        }
        if(operator) {
          Q = this.applyOperator(Q, operator);
          operator = undefined;
        }
        M = Q.concat(M);
      }
    }
    return M;
  }

  private findOpeningCurlyIdx(expr: string, closingIdx: number): number {
    for(let i = closingIdx - 1; i > -1; i--) {
      if(expr.charAt(i) === '{') {
        return i;
      }
    }
    return -1;
  }

  /**
   * start: index of opening {
   * end: index of closing }
   */
  private formOperator(expr: string, start: number, end: number): Operator {
    if(end - start + 1 === 3) {
      const num = parseInt(expr.substring(start+1, end));
      return {x: num, y: num};
    }
    const commaIdx = expr.indexOf(',', start);
    const x = parseInt(expr.substring(start+1, commaIdx));
    const y = parseInt(expr.substring(commaIdx+1, end));
    return {x, y};
  }

  private applyOperator(nfa: NFA, op: Operator): NFA {
    let unionMachine = emptyMachine();
    for(let i = op.x; i <= op.y; i++) {
      const powMachine = nfa.pow(i);
      unionMachine = unionMachine.union(powMachine);
    }
    return unionMachine;
  }

  //TODO: same as findOpeningCurlyIdx
  private findOpeningBracketIdx(expr: string, closingIdx: number): number {
    for(let i = closingIdx - 1; i > -1; i--) {
      if(expr.charAt(i) === '[') {
        return i;
      }
    }
    return -1;
  }

  private formBracketMachine(expr: string, openingBracketIdx: number, closingBracketIndex: number): NFA {
    const letters = expr.substring(openingBracketIdx+1, closingBracketIndex).split('');
    let unionMachine = emptyMachine();
    letters.forEach(l => {
      const m = oneLetterMachine(l as Letter);
      unionMachine = unionMachine.union(m);
    });
    return unionMachine;
  }

  private findOpeningParenIdx(expr: string, closingIdx: number): number {
    const stack = [];
    for(let i = closingIdx; i > -1; i--) {
      if(expr.charAt(i) === ')') {
        stack.push(i);
      } else if(expr.charAt(i) === '(') {
        stack.pop();
        if(stack.length === 0) {
          return i;
        }
      }
    }
    return -1;
  }
}

//(bl){1,2}(hxy{2,3}){2,3}q{2}
//[abc]xy{3}(q(efff){2}){3,4}

/**
 * Generate the NFA for substring s[start...end]
 * M(s, start, end)
 *
 * * = concat
 * | = union
 * M = empty machine
 * operator = {1, 1}
 * for i = end to start
    c = s[i];
    if c === }
        j = index of opening {
        operator = {x, y} //use j and i to construct operator
        continue;
    if c === )
        j = index of opening (
        Q = M(j+1, i-1)
    if c === a-z
        Q = singleCharacterMachine(c) //machine that recognizes c
    if c === ]
        j = index of opening [
        Q = unionCharacterMachine(j+1, i-1) // machine for [cde]
    Q = applyOperator(Q, operator)
    operator = {1,1}
    M = Q * M
 */