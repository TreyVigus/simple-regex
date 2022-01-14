/**
 * Accepted Symbols:
 * a-z
 * []
 * {x, y} where x,y are integers
 * ()
 */
export class Regex {
  private expr: string;
  constructor(expr: string) {
    this.expr = expr;
  }
  /**
   * Does the set of strings described by the
   * Regex contain s?
   */
  public test(s: string): boolean {
    return false;
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
