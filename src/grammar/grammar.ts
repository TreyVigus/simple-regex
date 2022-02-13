export type Rule = {
  variable: string;
  replacement: string;
};

export class Grammar {
  public rules: Rule[];
  public terminals: Set<string>;
  public variables: Set<string>;
  constructor(rules: Rule[]) {
    this.rules = rules;
    this.variables = this.getVariables(rules);
    this.terminals = this.getTerminals(rules, this.variables);
  }

  get startVariable(): string {
    return this.rules[0].variable;
  }

  getVariables(rules: Rule[]): Set<string> {
    const variables: Set<string> = new Set();
    rules.forEach((rule) => {
      variables.add(rule.variable);
    });
    return variables;
  }

  getTerminals(rules: Rule[], variables: Set<string>): Set<string> {
    const terminals: Set<string> = new Set();
    rules.forEach((rule) => {
      [...rule.replacement].forEach((char) => {
        if (!variables.has(char)) {
          terminals.add(char);
        }
      });
    });
    return terminals;
  }

  public hasTerminal(char: string) {
    return this.terminals.has(char);
  }

  public hasVariable(char: string) {
    return this.variables.has(char);
  }

  public getReplacements(variable: string): string[] {
    return this.rules.filter((r) => r.variable === variable).map((r) =>
      r.replacement
    );
  }
}
