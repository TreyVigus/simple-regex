import { Grammar } from "../grammar/grammar.ts";
import { getRegexGrammar } from "../grammar/grammarFactory.ts";

//TODO: test start, end

export type ParseNode = {
  value: string;
  children?: ParseNode[];
  /** This node parses expression[start...end] */
  start: number;
  end: number;
};

export interface Parser {
  parse(expression: string): ParseNode | null;
}

export class RegexParser implements Parser {
  public grammar: Grammar;
  private dummyParseNodeValue = "DUMMY";
  constructor() {
    this.grammar = getRegexGrammar();
  }

  /**
   * Parse the expression and return the root of the parse tree.
   * If impossible, return null.
   *
   * TODO: this isn't generic enough to handle changes to the grammar rules.
   */
  public parse(expression: string): ParseNode | null {
    const cache = this.getEmptyCache(expression);

    const parseDFS = (
      startVar: string,
      start: number,
      end: number,
    ): ParseNode | null => {
      if (start > end) {
        return null;
      }

      const matrix = cache.get(startVar)!;
      if (matrix[start][end]) {
        if (matrix[start][end]!.value === this.dummyParseNodeValue) {
          return null;
        }
        return matrix[start][end];
      }

      const windowLen = end - start + 1;
      const replacements = this.grammar.getReplacements(startVar);

      let parentNode: ParseNode | null = null;

      for (const replacement of replacements) {
        if (this.grammar.hasTerminal(replacement)) { //handle terminal replacements e.g. L->f
          if (windowLen === 1 && replacement === expression[start]) {
            parentNode = {
              value: startVar,
              children: [{ value: replacement, start, end }],
              start,
              end,
            };
            break;
          }
        } else if (["(R)", "[P]", "{A}"].includes(replacement)) {
          const [first, last] = [
            replacement[0],
            replacement[replacement.length - 1],
          ];
          if (
            expression[start] === first && expression[end] === last &&
            windowLen > 1
          ) {
            const child = parseDFS(replacement[1], start + 1, end - 1);
            if (child) {
              parentNode = {
                value: startVar,
                children: [
                  { value: first, start: start, end: start },
                  child,
                  { value: last, start: end, end: end },
                ],
                start,
                end,
              };
              break;
            }
          }
        } else if (["I,I"].includes(replacement)) {
          for (let i = start; i < end; i++) {
            if (expression[i] === ",") {
              const leftChild = parseDFS("I", start, i - 1);
              if (!leftChild) {
                continue;
              }
              const rightChild = parseDFS("I", i + 1, end);
              if (rightChild) {
                parentNode = {
                  value: startVar,
                  children: [
                    leftChild,
                    { value: ",", start: i, end: i },
                    rightChild,
                  ],
                  start,
                  end,
                };
                break;
              }
            }
          }
        } else if (replacement.length === 1) { //handle single var replacements e.g. P->L
          const child = parseDFS(replacement, start, end);
          if (child) {
            parentNode = {
              value: startVar,
              children: [child],
              start,
              end,
            };
            break;
          }
        } else if (replacement.length === 2) { //handle 2 var replacements i.e R->RO
          for (let i = start; i < end; i++) {
            const leftChild = parseDFS(replacement[0], start, i);
            if (!leftChild) {
              continue;
            }
            const rightChild = parseDFS(replacement[1], i + 1, end);
            if (rightChild) {
              parentNode = {
                value: startVar,
                children: [leftChild, rightChild],
                start,
                end,
              };
              break;
            }
          }
        } else if (replacement.length === 3) {
          for (let i = start; i < end - 1; i++) {
            const leftChild = parseDFS(replacement[0], start, i);
            if (!leftChild) {
              continue;
            }
            for (let j = i + 1; j < end; j++) {
              const middleChild = parseDFS(replacement[1], i + 1, j);
              if (!middleChild) {
                continue;
              }

              const rightChild = parseDFS(replacement[2], j + 1, end);
              if (rightChild) {
                parentNode = {
                  value: startVar,
                  children: [leftChild, middleChild, rightChild],
                  start,
                  end,
                };
              }
            }
          }
        }
      }

      //use a dummy to differentiate between null and not visited.
      matrix[start][end] = parentNode ??
        { value: this.dummyParseNodeValue, start, end };
      return parentNode;
    };

    return parseDFS(this.grammar.startVariable, 0, expression.length - 1);
  }

  private getEmptyCache(
    expression: string,
  ): Map<string, (ParseNode | null)[][]> {
    const cache: Map<string, (ParseNode | null)[][]> = new Map();
    this.grammar.variables.forEach((v) => {
      cache.set(v, this.getEmptyMatrix(expression.length));
    });
    return cache;
  }

  private getEmptyMatrix(dimension: number): (ParseNode | null)[][] {
    const matrix: (ParseNode | null)[][] = [];
    for (let i = 0; i < dimension; i++) {
      matrix.push([]);
      for (let j = 0; j < dimension; j++) {
        matrix[i].push(null);
      }
    }
    return matrix;
  }
}
