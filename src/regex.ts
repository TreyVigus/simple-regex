import { Letter, NFA, isLetter } from "./NFA/nfa.ts";
import { emptyMachine, oneLetterMachine } from "./NFA/nfaFactory.ts";
import { RegexParser, ParseNode } from "./parser/parser.ts";

type Operator = {
  x: number;
  y: number;
};

export class Regex {
  private parser: RegexParser;
  private nfa: NFA;
  constructor(expr: string) {
    this.parser = new RegexParser();
    const parseRoot = this.parser.parse(expr);
    if(!parseRoot) {
      throw 'unable to parse the expression';
    }
    this.nfa = this.buildRegexMachine(parseRoot!, expr);
  }

  public test(s: string): boolean {
    return this.nfa.recognizes(s);
  }

  private buildRegexMachine(R: ParseNode, expr: string): NFA {
    if(!R.children || R.children.length === 0) {
      return isLetter(R.value) ? oneLetterMachine(R.value) : emptyMachine();
    }
    const replacement = this.getReplacement(R);
    if(replacement === 'RNO') {
      const operandMachine = this.buildOperandMachine(R.children[1], expr);
      const operator = this.buildOperator(R.children[2], expr);
      return this.buildRegexMachine(R.children[0], expr).concat(this.applyOperator(operandMachine, operator));
    } else if(replacement === 'RN') {
      return this.buildRegexMachine(R.children[0], expr).concat(this.buildOperandMachine(R.children[1], expr));
    } else if(replacement === 'N') {
      return this.buildOperandMachine(R.children[0], expr);
    } else if(replacement === 'NO') {
      const operandMachine = this.buildOperandMachine(R.children[0], expr);
      const operator = this.buildOperator(R.children[1], expr);
      return this.applyOperator(operandMachine, operator);
    }

    return emptyMachine();
  }

  private buildOperandMachine(N: ParseNode, expr: string): NFA {
    const replacement = this.getReplacement(N);
    if(replacement === '[P]') {
      const P = N.children![1];
      return this.buildBracketMachine(expr, P.start, P.end);
    } else if(replacement === '(R)') {
      return this.buildRegexMachine(N.children![1], expr);
    } else {
      //replacement === 'L'
      return this.buildLetterMachine(N.children![0]);
    }
  }

  private buildBracketMachine(
    expr: string,
    start: number,
    end: number,
  ): NFA {
    const letters = expr.slice(start, end+1)
      .split("");
    let unionMachine = oneLetterMachine(letters[0] as Letter);
    letters.slice(1).forEach((l) => {
      const m = oneLetterMachine(l as Letter);
      unionMachine = unionMachine.union(m);
    });
    return unionMachine;
  }

  //TODO: handle the O->OO replacement
  private buildOperator(O: ParseNode, expr: string): Operator {
    const A = O.children![1];
    const x = this.buildNumber(A.children![0], expr);
    if(A.children!.length === 1) {
      return {x, y: x};
    } 
    return {x, y: this.buildNumber(A.children![2], expr)};
  }

  private buildNumber(I: ParseNode, expr: string): number {
    return parseInt(expr.substring(I.start, I.end+1));
  }

  private buildLetterMachine(L: ParseNode): NFA {
    return oneLetterMachine(this.getReplacement(L) as Letter);
  }

  private getReplacement(parentNode: ParseNode): string {
    return parentNode.children!.map(c => c.value).join('');
  }

  private applyOperator(nfa: NFA, op: Operator): NFA {
    let unionMachine = nfa.pow(op.x);
    for (let i = op.x + 1; i <= op.y; i++) {
      const powMachine = nfa.pow(i);
      unionMachine = unionMachine.union(powMachine);
    }
    return unionMachine;
  }
}